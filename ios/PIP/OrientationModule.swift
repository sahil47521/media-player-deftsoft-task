import Foundation
import UIKit

@objc(OrientationModule)
class OrientationModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func lockToLandscape() {
    DispatchQueue.main.async {
      if #available(iOS 16.0, *) {
        let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene
        windowScene?.requestGeometryUpdate(.iOS(interfaceOrientations: .landscape))
      } else {
        UIDevice.current.setValue(UIInterfaceOrientation.landscapeLeft.rawValue, forKey: "orientation")
      }
      UIViewController.attemptRotationToDeviceOrientation()
    }
  }
  
  @objc
  func lockToPortrait() {
    DispatchQueue.main.async {
      if #available(iOS 16.0, *) {
        let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene
        windowScene?.requestGeometryUpdate(.iOS(interfaceOrientations: .portrait))
      } else {
        UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
      }
      UIViewController.attemptRotationToDeviceOrientation()
    }
  }
}
