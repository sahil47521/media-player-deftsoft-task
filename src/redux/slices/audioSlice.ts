import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioItem, AudioState } from '../../types';

const audioInitialState: AudioState = {
  isRecording: false,
  isPaused: false,
  recordingDuration: 0,
  audioLevel: 0,
  recordedAudios: [],
  currentAudioPath: undefined,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState: audioInitialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.isPaused = false;
      state.recordingDuration = 0;
    },

    stopRecording: (state) => {
      state.isRecording = false;
      state.isPaused = false;
    },

    pauseRecording: (state) => {
      state.isPaused = true;
    },

    resumeRecording: (state) => {
      state.isPaused = false;
    },

    updateAudioLevel: (state, action: PayloadAction<number>) => {
      state.audioLevel = action.payload;
    },

    updateRecordingDuration: (state, action: PayloadAction<number>) => {
      state.recordingDuration = action.payload;
    },

    addAudioRecording: (state, action: PayloadAction<AudioItem>) => {
      state.recordedAudios.push(action.payload);
    },

    deleteAudioRecording: (state, action: PayloadAction<string>) => {
      state.recordedAudios = state.recordedAudios.filter(audio => audio.id !== action.payload);
    },

    setCurrentAudioPath: (state, action: PayloadAction<string | undefined>) => {
      state.currentAudioPath = action.payload;
    },

    clearAllRecordings: (state) => {
      state.recordedAudios = [];
    },
    
  },
});

export const {
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  updateAudioLevel,
  updateRecordingDuration,
  addAudioRecording,
  deleteAudioRecording,
  setCurrentAudioPath,
  clearAllRecordings,
} = audioSlice.actions;

export default audioSlice.reducer;
