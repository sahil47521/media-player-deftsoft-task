import Foundation

@objc(PipModule)
class PipModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func setEnabled(_ enabled: Bool) {
    // iOS handles PiP state mostly via the player itself
    // We provide this method for parity with Android
    print("PiP Enabled set to: \(enabled)")
  }
  
  @objc
  func enterPipMode() {
    // on iOS, PiP is usually triggered by backgrounding the app or via the player UI
    // Manual triggering from JS is possible but usually done through the Video component
    print("enterPipMode called on iOS")
  }
}
