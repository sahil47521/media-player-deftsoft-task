import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

interface AudioRecorderModule {
  startRecording: () => Promise<{
    filePath: string;
    isRecording: boolean;
  }>;
  
  pauseRecording: () => Promise<{
    filePath: string;
    isPaused: boolean;
  }>;
  
  resumeRecording: () => Promise<{
    filePath: string;
    isRecording: boolean;
    isPaused: boolean;
  }>;
  
  stopRecording: () => Promise<{
    filePath: string;
    fileName: string;
    duration: number;
    fileSize: number;
    isRecording: boolean;
  }>;
  
  playRecording: (filePath: string) => Promise<{
    filePath: string;
    isPlaying: boolean;
  }>;
  
  deleteRecording: (filePath: string) => Promise<{
    deleted: boolean;
  }>;
  
  stopPlayback: () => Promise<{
    success: boolean;
  }>;
  
  resetRecordingState: () => Promise<void>;
  
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

interface RecordingState {
  filePath: string;
  fileName?: string;
  duration?: number;
  fileSize?: number;
  isRecording: boolean;
  isPaused?: boolean;
  isPlaying?: boolean;
}

interface AudioData {
  audioData?: number[];
  audioLevel?: number;
  timestamp: number;
}

class AudioRecorderService {
  private audioRecorder: AudioRecorderModule;
  private eventEmitter: any;
  
  constructor() {
    this.audioRecorder = NativeModules.AudioRecorder as AudioRecorderModule;
    this.eventEmitter = this.audioRecorder ? new NativeEventEmitter(this.audioRecorder) : null;
  }

  resetRecordingState = async (): Promise<void> => {
    try {
      await this.audioRecorder.resetRecordingState?.();
    } catch (error) {
      console.log('Error resetting native state:', error);
    }
  };

  async startRecording(): Promise<RecordingState> {
    try {
      const result = await this.audioRecorder.startRecording();
      return {
        ...result,
        isPaused: false,
        isPlaying: false
      };
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  async pauseRecording(): Promise<RecordingState> {
    try {
      const result = await this.audioRecorder.pauseRecording();
      return {
        ...result,
        isRecording: true,
        isPlaying: false
      };
    } catch (error) {
      throw new Error(`Failed to pause recording: ${error}`);
    }
  }

  async resumeRecording(): Promise<RecordingState> {
    try {
      const result = await this.audioRecorder.resumeRecording();
      return {
        ...result,
        isRecording: true,
        isPlaying: false
      };
    } catch (error) {
      throw new Error(`Failed to resume recording: ${error}`);
    }
  }

  async stopRecording(): Promise<RecordingState> {
    try {
      const result = await this.audioRecorder.stopRecording();
      return {
        ...result,
        isRecording: false,
        isPaused: false,
        isPlaying: false
      };
    } catch (error) {
      throw new Error(`Failed to stop recording: ${error}`);
    }
  }

  async playRecording(filePath: string): Promise<RecordingState> {
    try {
      const result = await this.audioRecorder.playRecording(filePath);
      return {
        filePath: result.filePath,
        isRecording: false,
        isPaused: false,
        isPlaying: result.isPlaying
      };
    } catch (error) {
      throw new Error(`Failed to play recording: ${error}`);
    }
  }

  async deleteRecording(filePath: string): Promise<boolean> {
    try {
      const result = await this.audioRecorder.deleteRecording(filePath);
      return result.deleted;
    } catch (error) {
      throw new Error(`Failed to delete recording: ${error}`);
    }
  }

  async stopPlayback(): Promise<boolean> {
    try {
      const result = await this.audioRecorder.stopPlayback();
      return result.success;
    } catch (error) {
      console.error('Failed to stop playback:', error);
      return false;
    }
  }

  onRecordingStateChange(callback: (state: RecordingState) => void) {
    if (!this.eventEmitter) return { remove: () => {} };
    return this.eventEmitter.addListener('onRecordingStateChange', callback);
  }

  onAudioData(callback: (data: AudioData) => void) {
    if (!this.eventEmitter) return { remove: () => {} };
    return this.eventEmitter.addListener('onAudioData', callback);
  }

  isAvailable(): boolean {
    return !!this.audioRecorder;
  }

  getPlatform(): string {
    return Platform.OS;
  }
}

// Singleton instance
export const audioRecorderService = new AudioRecorderService();
export default audioRecorderService;
