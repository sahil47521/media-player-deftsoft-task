import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ViewStyle, TextStyle } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';

// Video List Types
export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
  bitrate?: number;
  resolution?: string;
  description?: string;
}

// Navigation Types
export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList>;
  VideoPlayer: { video: VideoItem };
};

export type RootTabParamList = {
  Audio: undefined;
  Video: undefined;
};

export type VideoPlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoPlayer'>;

// Video Component Types
export interface VideoSource {
  uri: string;
}

export interface VideoLoadData {
  currentTime: number;
  duration: number;
  naturalSize: {
    width: number;
    height: number;
    orientation: 'landscape' | 'portrait';
  };
  audioTracks: any[];
  textTracks: any[];
  videoTracks: any[];
}

export interface VideoError {
  error: {
    errorDescription?: string;
    errorException?: string;
    errorCode?: string;
  };
}

export interface VideoBufferData {
  isBuffering: boolean;
}

// Video Component Props
export interface VideoComponentProps {
  source: VideoSource;
  style: ViewStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat';
  paused?: boolean;
  onLoadStart?: () => void;
  onLoad?: (data: VideoLoadData) => void;
  onBuffer?: (data: VideoBufferData) => void;
  onError?: (error: VideoError) => void;
  repeat?: boolean;
  controls?: boolean;
  playInBackground?: boolean;
  playWhenInactive?: boolean;
}

// Screen Component Types
export interface BaseScreenProps {
  navigation?: any;
  route?: any;
}

export interface HomeScreenProps extends BaseScreenProps {
  navigation?: any;
}

export interface AudioScreenProps extends BaseScreenProps {
  navigation?: any;
}

export interface VideoPlayerScreenProps extends BaseScreenProps {
  navigation?: VideoPlayerScreenNavigationProp;
}

// Audio Recording Types
export interface AudioItem {
  id: string;
  title: string;
  duration: string;
  url: string;
  timestamp: number;
  filePath?: string;
  size?: number;
}

export interface AudioState {
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;
  audioLevel: number;
  recordedAudios: AudioItem[];
  currentAudioPath?: string;
}

// Video State Types
export interface VideoState {
  loading: boolean;
  paused: boolean;
  error: string | null;
}

// Style Types
export interface VideoStyles {
  container: ViewStyle;
  video: ViewStyle;
  loader: ViewStyle;
  errorText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}

// App Types
export interface ThemeState {
  isDarkMode: boolean;
}

export interface VideoCardProps {
  video: VideoItem;
  onPress: (video: VideoItem) => void;
}

// Common Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type VideoStatus = 'playing' | 'paused' | 'loading' | 'error';
