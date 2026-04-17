import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  PanResponder,
  StatusBar,
  Modal,
  useWindowDimensions
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { VideoItem } from '../../types';
import { NativeModules } from 'react-native';

const { OrientationModule, PipModule, SettingsModule } = NativeModules;
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Settings,
  Sun,
  Volume2,
  Check,
  Minimize2,
  PictureInPicture2,
  ChevronLeft
} from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateVideoProgress, setIsFullscreen } from '../../redux/slices/AppSlice';
import { COLORS, DW, DH } from '../../constants/variables';

interface CustomVideoPlayerProps {
  video: VideoItem;
}

const SPEED_OPTIONS = [0.5, 1.0, 1.5, 2.0];

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ video }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isFocused = useIsFocused();
  const videoRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const videoProgress = useAppSelector(state => state.app.videoProgress);

  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'main' | 'speed'>('main');
  const isFullscreen = useAppSelector(state => state.app.isFullscreen);
  const [error, setError] = useState<string | null>(null);

  // Gesture Feedback State
  const [gestureType, setGestureType] = useState<'seek' | 'volume' | 'brightness' | null>(null);
  const [gestureValue, setGestureValue] = useState(0);

  const controlsOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentTime > 0) {
      dispatch(updateVideoProgress({ videoId: video.id, currentTime }));
    }
  }, [paused, video.id, dispatch]);

  // Handle Orientation via Native Bridge
  useEffect(() => {
    try {
      if (OrientationModule) {
        if (isFullscreen) {
          OrientationModule.lockToLandscape();
        } else {
          OrientationModule.lockToPortrait();
        }
      }
    } catch (e) {
      console.log('Orientation Error:', e);
    }
    return () => {
      try {
        OrientationModule?.unlockAllOrientations?.();
      } catch (e) { }
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (PipModule && typeof PipModule.setEnabled === 'function') {
      PipModule.setEnabled(isFocused && !paused);
    }
    return () => {
      if (PipModule && typeof PipModule.setEnabled === 'function') {
        PipModule.setEnabled(false);
      }
    };
  }, [isFocused, paused]);

  const hideControls = () => {
    Animated.timing(controlsOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setShowControls(false);
      setShowSettings(false);
    });
  };

  const showControlsUI = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const toggleControls = () => (showControls ? hideControls() : showControlsUI());
  const toggleFullscreen = () => dispatch(setIsFullscreen(!isFullscreen));

  const initialValue = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: (_, gestureState) => {
        const { x0 } = gestureState;
        const currentWidth = isFullscreen ? windowHeight : windowWidth;
        const isLeftSide = x0 < currentWidth / 2;

        if (isLeftSide) {
          SettingsModule?.getBrightness().then((b: number) => {
            initialValue.current = typeof b === 'number' ? b : 0.5;
          }).catch(() => {
            initialValue.current = 0.5;
          });
        } else {
          SettingsModule?.getVolume().then((v: number) => {
            initialValue.current = typeof v === 'number' ? v : 0.5;
          }).catch(() => {
            initialValue.current = 0.5;
          });
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy, x0 } = gestureState;
        if (Math.abs(dx) > Math.abs(dy)) {
          setGestureType('seek');
          setGestureValue(Math.round(dx / 5));
        } else {
          const currentWidth = isFullscreen ? windowHeight : windowWidth;
          const isLeftSide = x0 < currentWidth / 2;

          const delta = -dy / 200;
          const newValue = Math.max(0, Math.min(1, initialValue.current + delta));

          setGestureType(isLeftSide ? 'brightness' : 'volume');
          setGestureValue(Math.round(newValue * 100));

          if (isLeftSide) {
            SettingsModule?.setBrightness(newValue);
          } else {
            SettingsModule?.setVolume(newValue);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureType === 'seek') {
          const newTime = Math.max(0, Math.min(currentTime + Math.round(gestureState.dx / 5), duration));
          videoRef.current?.seek(newTime);
          setCurrentTime(newTime);
        }
        setGestureType(null);
        setGestureValue(0);
      }
    })
  ).current;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const videoSource = useMemo(() => {
    return typeof video.url === 'string' ? { uri: video.url } : video.url;
  }, [video.id, video.url]);

  const renderPlayer = () => (
    <View style={[styles.container, isFullscreen && styles.fullscreenContainer]} {...panResponder.panHandlers}>
      <StatusBar hidden={isFullscreen} translucent={isFullscreen} />
      <TouchableOpacity style={styles.touchArea} activeOpacity={1} onPress={toggleControls}>
        <Video
          ref={videoRef}
          source={videoSource}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
          paused={paused || !isFocused}
          rate={playbackRate}
          bufferConfig={{
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 1500,
            bufferForPlaybackAfterRebufferMs: 2500
          }}
          onLoadStart={() => console.log('Video Load Started')}
          onLoad={(data) => {
            console.log('Video Loaded Successfully:', data.duration);
            setDuration(data.duration);
            setLoading(false);
            if (currentTime > 0) {
              videoRef.current?.seek(currentTime);
            }
          }}
          onProgress={(data) => setCurrentTime(data.currentTime)}
          onBuffer={(data) => setBuffering(data.isBuffering)}
          onError={(e) => setError(JSON.stringify(e.error))}
          playInBackground={false}
          progressUpdateInterval={500}
          repeat={true}
        />

        {gestureType && (
          <View style={styles.gestureOverlay}>
            <View style={styles.gestureContent}>
              {gestureType === 'seek' && <SkipForward color={COLORS.white} size={32} />}
              {gestureType === 'volume' && <Volume2 color={COLORS.white} size={32} />}
              {gestureType === 'brightness' && <Sun color={COLORS.white} size={32} />}
              <Text style={styles.gestureText}>
                {gestureType === 'seek'
                  ? (gestureValue > 0 ? `+${gestureValue}s` : `${gestureValue}s`)
                  : `${gestureValue}%`}
              </Text>
            </View>
          </View>
        )}

        {(loading || buffering) && (
          <View style={styles.centerOverlay}>
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        )}

        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Playback Error: {error}</Text>
          </View>
        )}

        <Animated.View style={[styles.controlsOverlay, { opacity: controlsOpacity }]}>
          <View style={[styles.topBar, isFullscreen && { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
            {isFullscreen && (
              <TouchableOpacity style={styles.iconButton} onPress={toggleFullscreen}>
                <ChevronLeft size={28} color={COLORS.white} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.iconButton} onPress={() => { setShowSettings(!showSettings); setSettingsTab('main'); }}>
              <Settings size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {showSettings && (
            <View style={styles.settingsMenu}>
              {settingsTab === 'main' ? (
                <TouchableOpacity style={styles.settingItem} onPress={() => setSettingsTab('speed')}>
                  <Text style={styles.settingLabel}>Playback Speed</Text>
                  <Text style={styles.settingValue}>{playbackRate}x</Text>
                </TouchableOpacity>
              ) : (
                SPEED_OPTIONS.map(s => (
                  <TouchableOpacity key={s} style={styles.settingItem} onPress={() => { setPlaybackRate(s); setShowSettings(false); }}>
                    <Text style={styles.settingLabel}>{s}x</Text>
                    {playbackRate === s && <Check size={16} color={COLORS.primary} />}
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          <View style={styles.centerControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => videoRef.current?.seek(currentTime - 10)}>
              <SkipBack size={28} color={COLORS.white} fill={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={() => setPaused(!paused)}>
              {paused ? <Play size={36} color={COLORS.white} fill={COLORS.white} /> : <Pause size={36} color={COLORS.white} fill={COLORS.white} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => videoRef.current?.seek(currentTime + 10)}>
              <SkipForward size={28} color={COLORS.white} fill={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <Text style={styles.timeLabel}>{formatTime(currentTime)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onSlidingComplete={(val) => videoRef.current?.seek(val)}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => PipModule?.enterPipMode()}>
              <PictureInPicture2 size={18} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleFullscreen}>
              {isFullscreen ? <Minimize2 size={18} color={COLORS.white} /> : <Maximize2 size={18} color={COLORS.white} />}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {!isFullscreen ? (
        renderPlayer()
      ) : (
        <Modal
          visible={isFullscreen}
          transparent={false}
          statusBarTranslucent={true}
          supportedOrientations={['landscape']}
          animationType="none"
          onRequestClose={toggleFullscreen}
        >
          {renderPlayer()}
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: '#000' },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 0,
    margin: 0,
  },
  touchArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gestureOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 10 },
  gestureContent: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 20, borderRadius: 12, alignItems: 'center', minWidth: 100 },
  gestureText: { color: '#fff', marginTop: 10, fontSize: 18, fontWeight: '700' },
  centerOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  errorOverlay: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: 'rgba(255,0,0,0.7)', padding: 10, borderRadius: 8 },
  errorText: { color: '#fff', fontSize: 12, textAlign: 'center' },
  controlsOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'space-between' },
  topBar: { padding: 20, alignItems: 'flex-end' },
  settingsMenu: { position: 'absolute', top: 60, right: 20, backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 12, width: 180, padding: 8, zIndex: 100 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  settingLabel: { color: '#fff', fontSize: 14, fontWeight: '500' },
  settingValue: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  centerControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40 },
  controlButton: { padding: 10 },
  playButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12, backgroundColor: 'rgba(0,0,0,0.6)' },
  slider: { flex: 1, height: 40 },
  timeLabel: { color: COLORS.white, fontSize: 12, fontWeight: '600', minWidth: 40 },
  iconButton: { padding: 8 },
});

export default CustomVideoPlayer;
