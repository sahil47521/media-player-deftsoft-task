package com.pip

import android.app.PictureInPictureParams
import android.os.Build
import android.os.Bundle
import android.util.Rational
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
    super.onConfigurationChanged(newConfig)
    val intent = Intent("onConfigurationChanged")
    intent.putExtra("newConfig", newConfig)
    this.sendBroadcast(intent)
  }


  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState)
  }
  override fun getMainComponentName(): String = "MediaPlayer"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)


  companion object {
    @JvmField
    var isPipEnabled: Boolean = false
  }

  //  PiP trigger when user presses home button
  override fun onUserLeaveHint() {
    super.onUserLeaveHint()
    if (isPipEnabled) {
      enterPipMode()
    }
  }

  fun setPipEnabled(enabled: Boolean) {
    isPipEnabled = enabled
  }

  //  PiP Mode Function
  private fun enterPipMode() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val aspectRatio = Rational(16, 9)

      val params = PictureInPictureParams.Builder()
        .setAspectRatio(aspectRatio)
        .build()

      enterPictureInPictureMode(params)
    }
  }

  //  Optional: Detect PiP mode changes
  override fun onPictureInPictureModeChanged(
    isInPictureInPictureMode: Boolean,
    newConfig: android.content.res.Configuration
  ) {
    super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)

    if (isInPictureInPictureMode) {
      // App is in PiP mode
      println("Entered PiP mode")
    } else {
      // Back to fullscreen
      println("Exited PiP mode")
    }
  }
}