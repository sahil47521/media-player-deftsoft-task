import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoItem } from '../../types';
import { VIDEO_DATA } from '../../services/videoService';

interface VideoProgress {
  [videoId: string]: number; // videoId: currentTime in seconds
}

interface AppState {
  videos: VideoItem[];
  videoProgress: VideoProgress;
  currentVideo: VideoItem | null;
  isFullscreen: boolean;
}

const appInitialState: AppState = {
  videos: VIDEO_DATA,
  videoProgress: {},
  currentVideo: null,
  isFullscreen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setVideos: (state, action: PayloadAction<VideoItem[]>) => {
      state.videos = action.payload;
    },
    updateVideoProgress: (state, action: PayloadAction<{ videoId: string; currentTime: number }>) => {
      const { videoId, currentTime } = action.payload;
      state.videoProgress[videoId] = currentTime;
    },
    setCurrentVideo: (state, action: PayloadAction<VideoItem | null>) => {
      state.currentVideo = action.payload;
    },
    setIsFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    clearVideoProgress: (state, action: PayloadAction<string>) => {
      const videoId = action.payload;
      delete state.videoProgress[videoId];
    },
    clearAllVideoProgress: (state) => {
      state.videoProgress = {};
    },
  },
});

export const {
  setVideos,
  updateVideoProgress,
  setCurrentVideo,
  setIsFullscreen,
  clearVideoProgress,
  clearAllVideoProgress,
} = appSlice.actions;

export default appSlice.reducer;