package com.pip.audio;

import android.media.MediaRecorder;
import android.media.MediaPlayer;
import android.media.AudioFormat;
import android.media.MediaRecorder.AudioSource;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@ReactModule(name = "AudioRecorder")
public class AudioRecorderModule extends ReactContextBaseJavaModule {

    private MediaRecorder mediaRecorder;
    private MediaPlayer mediaPlayer;
    private String currentRecordingPath;
    private boolean isRecording = false;
    private boolean isPaused = false;
    private long startTime = 0;
    private long pausedTime = 0;
    private Handler audioDataHandler = new Handler(Looper.getMainLooper());
    private Runnable audioDataRunnable;
    
    // Instance management
    private static AudioRecorderModule instance;

    public AudioRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        
        // Initialize instance if not already exists
        if (instance == null) {
            instance = this;
        }
    }

    @Override
    public String getName() {
        return "AudioRecorder";
    }

    @ReactMethod
    public void startRecording(Promise promise) {
        try {
            Log.d("AudioRecorder", "startRecording called - isRecording: " + isRecording + ", isPaused: " + isPaused);
            Log.d("AudioRecorder", "mediaRecorder is null: " + (mediaRecorder == null));
            
            if (isRecording && !isPaused) {
                Log.e("AudioRecorder", "REJECTING - Already recording, isRecording: " + isRecording + ", isPaused: " + isPaused);
                promise.reject("ALREADY_RECORDING", "Already recording", Arguments.createMap());
                return;
            }

            if (isPaused) {
                // Resume recording
                resumeRecording(promise);
                return;
            }

            // Start new recording
            createMediaRecorder();
            Log.d("AudioRecorder", "Starting MediaRecorder - current state: isRecording=" + isRecording + ", isPaused=" + isPaused);
            mediaRecorder.start();
            isRecording = true;
            startTime = System.currentTimeMillis();
            Log.d("AudioRecorder", "Recording started, isRecording: " + isRecording);
            
            startAudioDataPolling();
            
            WritableMap result = Arguments.createMap();
            result.putString("filePath", currentRecordingPath);
            result.putBoolean("isRecording", true);
            
            sendRecordingStateChange("recording", result);
            promise.resolve(result);
            
        } catch (Exception e) {
            Log.e("AudioRecorder", "Error starting recording", e);
            promise.reject("RECORDING_ERROR", "Failed to start recording: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public void pauseRecording(Promise promise) {
        try {
            Log.d("AudioRecorder", "pauseRecording called - isRecording: " + isRecording + ", isPaused: " + isPaused);
            if (!isRecording || isPaused) {
                promise.reject("NOT_RECORDING", "Not recording or already paused", Arguments.createMap());
                return;
            }
            
            if (mediaRecorder != null) {
                Log.d("AudioRecorder", "Pausing MediaRecorder");
                mediaRecorder.pause();
                isPaused = true;
                pausedTime = System.currentTimeMillis();
                Log.d("AudioRecorder", "Recording paused, isRecording: " + isRecording + ", isPaused: " + isPaused);
                
                stopAudioDataPolling();
                
                WritableMap result = Arguments.createMap();
                result.putString("filePath", currentRecordingPath);
                result.putBoolean("isPaused", true);
                
                sendRecordingStateChange("paused", result);
                promise.resolve(result);
            }
        } catch (Exception e) {
            promise.reject("PAUSE_ERROR", "Failed to pause recording", e);
        }
    }

    @ReactMethod
    public void resumeRecording(Promise promise) {
        try {
            if (!isRecording || !isPaused) {
                promise.reject("NOT_PAUSED", "Recording is not paused", Arguments.createMap());
                return;
            }

            if (mediaRecorder != null) {
                mediaRecorder.resume();
                isPaused = false;
                
                startAudioDataPolling();
                
                WritableMap result = Arguments.createMap();
                result.putString("filePath", currentRecordingPath);
                result.putBoolean("isRecording", true);
                result.putBoolean("isPaused", false);
                
                sendRecordingStateChange("recording", result);
                promise.resolve(result);
            }
        } catch (Exception e) {
            promise.reject("RESUME_ERROR", "Failed to resume recording", e);
        }
    }

    @ReactMethod
    public void stopRecording(Promise promise) {
        try {
            if (!isRecording) {
                promise.reject("NOT_RECORDING", "Not recording", Arguments.createMap());
                return;
            }

            stopAudioDataPolling();

            if (mediaRecorder != null) {
                try {
                    mediaRecorder.stop();
                    Log.d("AudioRecorder", "MediaRecorder stopped successfully");
                } catch (RuntimeException stopException) {
                    // This can happen if stop() is called too soon after start()
                    Log.e("AudioRecorder", "RuntimeException: stop() called too soon or failed", stopException);
                }
                mediaRecorder.release();
                mediaRecorder = null;
            }

            long duration = 0;
            if (startTime > 0) {
                long endTime = isPaused ? pausedTime : System.currentTimeMillis();
                duration = (endTime - startTime) / 1000; // Convert to seconds
            }

            isRecording = false;
            isPaused = false;
            startTime = 0;
            pausedTime = 0;

            // Get file info
            File recordingFile = new File(currentRecordingPath);
            long fileSize = recordingFile.exists() ? recordingFile.length() : 0;

            WritableMap result = Arguments.createMap();
            result.putString("filePath", currentRecordingPath);
            result.putString("fileName", recordingFile.getName());
            result.putDouble("duration", duration);
            result.putDouble("fileSize", fileSize);
            result.putBoolean("isRecording", false);
            
            sendRecordingStateChange("stopped", result);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("STOP_ERROR", "Failed to stop recording", e);
        }
    }

    @ReactMethod
    public void playRecording(String filePath, Promise promise) {
        try {
            Log.d("AudioRecorder", "playRecording called for: " + filePath);
            if (mediaPlayer != null) {
                mediaPlayer.release();
            }
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(filePath);
            mediaPlayer.prepare();
            mediaPlayer.start();
            
            mediaPlayer.setOnCompletionListener(mp -> {
                Log.d("AudioRecorder", "Playback completed");
                WritableMap result = Arguments.createMap();
                result.putString("filePath", filePath);
                result.putBoolean("isPlaying", false);
                sendRecordingStateChange("stopped_playing", result);
            });

            WritableMap result = Arguments.createMap();
            result.putString("filePath", filePath);
            result.putBoolean("isPlaying", true);
            
            sendRecordingStateChange("playing", result);
            promise.resolve(result);
        } catch (Exception e) {
            Log.e("AudioRecorder", "Playback error", e);
            promise.reject("PLAYBACK_ERROR", "Failed to play recording: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public void stopPlayback(Promise promise) {
        try {
            Log.d("AudioRecorder", "stopPlayback called");
            if (mediaPlayer != null) {
                Log.d("AudioRecorder", "Stopping and releasing MediaPlayer");
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.reset();
                mediaPlayer.release();
                mediaPlayer = null;
            }
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            promise.resolve(result);
        } catch (Exception e) {
            Log.e("AudioRecorder", "Error stopping playback", e);
            promise.reject("STOP_PLAYBACK_ERROR", "Failed to stop playback: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public void deleteRecording(String filePath, Promise promise) {
        try {
            File file = new File(filePath);
            boolean deleted = file.delete();
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("deleted", deleted);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("DELETE_ERROR", "Failed to delete recording", e);
        }
    }

    private void createMediaRecorder() throws IOException {
        // Create recordings directory
        File recordingsDir = new File(getReactApplicationContext().getExternalFilesDir(null), "recordings");
        if (!recordingsDir.exists()) {
            recordingsDir.mkdirs();
        }

        // Generate unique filename
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String fileName = "recording_" + timestamp + ".mp4";
        currentRecordingPath = new File(recordingsDir, fileName).getAbsolutePath();

        mediaRecorder = new MediaRecorder();
        mediaRecorder.setAudioSource(AudioSource.MIC);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        mediaRecorder.setOutputFile(currentRecordingPath);
        
        // Configure for better quality
        mediaRecorder.setAudioSamplingRate(44100);
        mediaRecorder.setAudioEncodingBitRate(128000);
        mediaRecorder.setAudioChannels(1);
        
        mediaRecorder.prepare();
    }

    private void sendRecordingStateChange(String state, ReadableMap data) {
        WritableMap eventData = Arguments.createMap();
        if (data != null) {
            eventData.merge(data);
        }
        eventData.putString("state", state);
        
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onRecordingStateChange", eventData);
    }

    private void sendAudioData(double[] audioData) {
        WritableMap data = Arguments.createMap();
        data.putArray("audioData", Arguments.fromJavaArgs(new Object[]{audioData}));
        data.putDouble("timestamp", System.currentTimeMillis());
        
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onAudioData", data);
    }

    private void startAudioDataPolling() {
        stopAudioDataPolling();
        audioDataRunnable = new Runnable() {
            @Override
            public void run() {
                if (isRecording && !isPaused && mediaRecorder != null) {
                    try {
                        int amplitude = mediaRecorder.getMaxAmplitude();
                        // getMaxAmplitude() returns 0-32767
                        // We use sqrt to boost lower volumes for better visualization
                        double level = Math.sqrt(amplitude / 32767.0) * 100.0;
                        
                        // Ensure a minimum level for visibility
                        if (level < 8 && amplitude > 0) level = 8;
                        
                        WritableMap data = Arguments.createMap();
                        data.putDouble("audioLevel", level);
                        data.putDouble("timestamp", System.currentTimeMillis());
                        
                        getReactApplicationContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("onAudioData", data);
                            
                    } catch (Exception e) {
                        Log.e("AudioRecorder", "Error polling amplitude", e);
                    }
                    audioDataHandler.postDelayed(this, 100);
                }
            }
        };
        audioDataHandler.post(audioDataRunnable);
    }

    private void stopAudioDataPolling() {
        if (audioDataRunnable != null) {
            audioDataHandler.removeCallbacks(audioDataRunnable);
            audioDataRunnable = null;
        }
    }

    @ReactMethod
    public void resetRecordingState(Promise promise) {
        Log.d("AudioRecorder", "Resetting recording state");
        isRecording = false;
        isPaused = false;
        startTime = 0;
        pausedTime = 0;
        stopAudioDataPolling();
        if (mediaRecorder != null) {
            try {
                mediaRecorder.release();
            } catch (Exception e) {
                Log.e("AudioRecorder", "Error releasing media recorder", e);
            }
            mediaRecorder = null;
        }
        if (mediaPlayer != null) {
            try {
                mediaPlayer.release();
            } catch (Exception e) {
                Log.e("AudioRecorder", "Error releasing media player", e);
            }
            mediaPlayer = null;
        }
        currentRecordingPath = null;
        if (promise != null) {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Required for event emitter
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Required for event emitter
    }
}
