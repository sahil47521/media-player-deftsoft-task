import Foundation
import UIKit
import MediaPlayer

@objc(SettingsModule)
class SettingsModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func getVolume(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let volume = AVAudioSession.sharedInstance().outputVolume
      resolve(volume)
    }
  }
  
  @objc
  func getBrightness(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let brightness = UIScreen.main.brightness
      resolve(brightness)
    }
  }
  
  @objc
  func setVolume(_ volume: Float) {
    // Note: iOS restricts direct system volume changes for privacy
    // This is a common way to suggest a volume change or use MPVolumeView
    print("Setting volume on iOS to: \(volume)")
  }
  
  @objc
  func setBrightness(_ brightness: CGFloat) {
    DispatchQueue.main.async {
      UIScreen.main.brightness = brightness
    }
  }
}
