package com.pip;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.pip.audio.AudioRecorderModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class AudioRecorderPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AudioRecorderModule(reactContext));
        modules.add(new PipModule(reactContext));
        modules.add(new SettingsModule(reactContext));
        return modules;
    }

    public List<String> createJSModules() {
        return Collections.emptyList();
    }
}
