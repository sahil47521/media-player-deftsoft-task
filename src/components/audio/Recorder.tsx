import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mic, Square, Play, Pause, Loader2 } from 'lucide-react-native';
import CardWrapper from '../common/CardWrapper';
import { COLORS } from '../../constants/variables';

interface RecorderProps {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  duration: string;
  waveformData: number[];
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

const Recorder: React.FC<RecorderProps> = ({
  isRecording,
  isPaused,
  isProcessing,
  duration,
  waveformData,
  onStart,
  onStop,
  onPause,
  onResume,
}) => {
  return (
    <CardWrapper style={styles.card}>
      <View style={styles.content}>
        <View style={styles.waveformContainer}>
          <View style={styles.waveform}>
            {waveformData.map((height, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    height: isRecording ? Math.max(8, height * 1.2) : 8,
                    backgroundColor: isRecording && !isPaused ? COLORS.primary : COLORS.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlsRow}>
          {isRecording && (
            <View style={styles.timerContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.timerText}>{duration}</Text>
            </View>
          )}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.mainButton, isRecording && styles.buttonRecording]}
              onPress={isRecording ? onStop : onStart}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              {isProcessing ? (
                <Loader2 size={24} color={COLORS.white} />
              ) : isRecording ? (
                <Square size={20} color={COLORS.white} fill={COLORS.white} />
              ) : (
                <Mic size={24} color={COLORS.white} />
              )}
            </TouchableOpacity>

            {isRecording && (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={isPaused ? onResume : onPause}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                {isPaused ?
                  <Play size={22} color={COLORS.primary} fill={COLORS.primary} /> :
                  <Pause size={22} color={COLORS.primary} fill={COLORS.primary} />
                }
              </TouchableOpacity>
            )}
          </View>

          {!isRecording && (
            <Text style={styles.readyText}>Ready to Record</Text>
          )}
        </View>
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  waveformContainer: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginBottom: 16,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    width: '100%',
    paddingHorizontal: 10,
  },
  bar: {
    width: 3.5,
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
    fontVariant: ['tabular-nums'],
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonRecording: {
    backgroundColor: COLORS.danger,
    shadowColor: COLORS.danger,
  },
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
});

export default Recorder;
