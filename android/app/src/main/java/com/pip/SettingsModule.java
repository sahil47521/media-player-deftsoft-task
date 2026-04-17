package com.pip;

import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;
import android.view.Window;
import android.view.WindowManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SettingsModule extends ReactContextBaseJavaModule {
    public SettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SettingsModule";
    }

    @ReactMethod
    public void getVolume(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            AudioManager audioManager = (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);
            int maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            int currentVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
            promise.resolve((float) currentVolume / maxVolume);
        } else {
            promise.reject("ERROR", "Activity not found");
        }
    }

    @ReactMethod
    public void getBrightness(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            WindowManager.LayoutParams layoutParams = activity.getWindow().getAttributes();
            float brightness = layoutParams.screenBrightness;
            if (brightness < 0) brightness = 0.5f; // Default system brightness if not set
            promise.resolve(brightness);
        } else {
            promise.reject("ERROR", "Activity not found");
        }
    }

    @ReactMethod
    public void setVolume(float volume) {
        final Activity activity = getCurrentActivity();
        if (activity != null) {
            AudioManager audioManager = (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);
            int maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            int targetVolume = (int) (volume * maxVolume);
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, targetVolume, 0);
        }
    }

    @ReactMethod
    public void setBrightness(float brightness) {
        final Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                Window window = activity.getWindow();
                WindowManager.LayoutParams layoutParams = window.getAttributes();
                layoutParams.screenBrightness = brightness;
                window.setAttributes(layoutParams);
            });
        }
    }
}
