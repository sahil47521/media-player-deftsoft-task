import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { AudioItem } from '../types';
import {
  startRecording as startRecordingAction,
  stopRecording as stopRecordingAction,
  pauseRecording as pauseRecordingAction,
  resumeRecording as resumeRecordingAction,
  updateAudioLevel,
  updateRecordingDuration,
  addAudioRecording,
  deleteAudioRecording,
  setCurrentAudioPath
} from '../redux/slices/audioSlice';
import audioRecorderService from '../services/audioRecorderService';
import { COLORS } from '../constants/variables';

// Consolidated Components
import Recorder from '../components/audio/Recorder';
import AudioList from '../components/audio/AudioList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AudioScreen: React.FC = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Redux State
  const {
    isRecording,
    isPaused,
    recordingDuration,
    audioLevel,
    recordedAudios
  } = useSelector((state: RootState) => state.audio);

  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(50).fill(2));

  const timerRef = useRef<any>(null);
  const recordingStartTime = useRef<number>(0);
  const pausedTime = useRef<number>(0);

  // Simple waveform generation
  const generateWaveformData = useCallback((level: number) => {
    const bars = 50;
    const data: number[] = [];
    for (let i = 0; i < bars; i++) {
      data.push(Math.max(2, level * 0.5 + Math.random() * 5));
    }
    setWaveformData(data);
  }, []);

  useEffect(() => {
    const subscription = audioRecorderService.onAudioData((data) => {
      if (isRecording && !isPaused) {
        const level = data.audioLevel || 0;
        dispatch(updateAudioLevel(level));
        generateWaveformData(level);
      }
    });
    return () => subscription.remove();
  }, [isRecording, isPaused, generateWaveformData, dispatch]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      dispatch(updateRecordingDuration(recordingDuration + 1));
    }, 1000);
  }, [dispatch, recordingDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (isProcessing || isRecording) return;
    try {
      setIsProcessing(true);
      const hasPermission = Platform.OS === 'android'
        ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO) === 'granted'
        : true;

      if (!hasPermission) return;

      const result = await audioRecorderService.startRecording();
      dispatch(setCurrentAudioPath(result.filePath));
      dispatch(startRecordingAction());
      recordingStartTime.current = Date.now();
      startTimer();
    } catch (error: any) {
      if (error?.message?.includes('ALREADY_RECORDING')) {
        dispatch(startRecordingAction());
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isRecording, startTimer, dispatch]);

  const pauseRecording = useCallback(async () => {
    try {
      setIsProcessing(true);
      await audioRecorderService.pauseRecording();
      dispatch(pauseRecordingAction());
      pausedTime.current = Date.now();
      stopTimer();
    } catch (error) { } finally {
      setIsProcessing(false);
    }
  }, [dispatch, stopTimer]);

  const resumeRecording = useCallback(async () => {
    try {
      setIsProcessing(true);
      await audioRecorderService.resumeRecording();
      dispatch(resumeRecordingAction());
      const pauseDuration = Date.now() - pausedTime.current;
      recordingStartTime.current += pauseDuration;
      startTimer();
    } catch (error) { } finally {
      setIsProcessing(false);
    }
  }, [dispatch, startTimer]);

  const stopRecording = useCallback(async () => {
    try {
      setIsProcessing(true);
      const result = await audioRecorderService.stopRecording();
      dispatch(stopRecordingAction());
      stopTimer();

      const newRecording: AudioItem = {
        id: Date.now().toString(),
        title: result.fileName || `Recording ${recordedAudios.length + 1}`,
        duration: formatTime(Math.round(result.duration || 0)),
        url: result.filePath,
        filePath: result.filePath,
        size: Math.round(result.fileSize || 0),
        timestamp: Date.now()
      };

      dispatch(addAudioRecording(newRecording));
      setWaveformData(new Array(50).fill(2));
    } catch (error) { } finally {
      setIsProcessing(false);
    }
  }, [recordedAudios.length, dispatch, stopTimer]);

  const playRecording = useCallback(async (recording: AudioItem) => {
    try {
      if (isPlaying) setIsPlaying(null);
      await audioRecorderService.playRecording(recording.url);
      setIsPlaying(recording.id);

      const parts = recording.duration.split(':');
      const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      setTimeout(() => setIsPlaying(null), seconds * 1000);
    } catch (error) { }
  }, [isPlaying]);

  const deleteRecording = useCallback(async (recording: AudioItem) => {
    Alert.alert('Delete', 'Delete recording?', [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: async () => {
          if (isPlaying === recording.id) {
            await audioRecorderService.stopPlayback();
            setIsPlaying(null);
          }
          const result = await audioRecorderService.deleteRecording(recording.url);
          if (result) dispatch(deleteAudioRecording(recording.id));
        }
      }
    ]);
  }, [isPlaying, dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Recorder
        isRecording={isRecording}
        isPaused={isPaused}
        isProcessing={isProcessing}
        duration={formatTime(recordingDuration)}
        waveformData={waveformData}
        onStart={startRecording}
        onStop={stopRecording}
        onPause={pauseRecording}
        onResume={resumeRecording}
      />

      <AudioList
        data={recordedAudios}
        isPlayingId={isPlaying}
        onPlay={playRecording}
        onDelete={deleteRecording}
        formatSize={formatSize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
});

export default AudioScreen;