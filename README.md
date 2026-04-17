# MediaPlayer

MediaPlayer is an app for watching videos and recording audio. It is designed to work smoothly on both Android and iPhone. It uses special custom code to control things like volume and screen brightness directly.

---

## Main Features

### Video Player
*   **Fullscreen Mode**: The video automatically fills the whole screen.
*   **Easy Controls**: 
    *   Slide up or down on the left side to change brightness.
    *   Slide up or down on the right side to change volume.
    *   Slide left or right to move forward or backward in the video.
*   **Mini-Player (PiP)**: You can keep watching the video in a small window while using other apps.

### Audio Recorder
*   **Live Waves**: See your voice moving on the screen while you record.
*   **Pause and Resume**: You can stop the recording for a moment and start again.
*   **Background Recording**: The app keeps recording even if you minimize it.
*   **History**: All your recordings are saved in a simple list where you can play or delete them.

---

## How to Install

1.  Open your terminal in the project folder.
2.  Type `npm install` and wait for it to finish.
3.  For iPhone, type `cd ios`, then `npx pod-install`, then `cd ..`.

---

## How to Run the App

1.  First, start the main server by typing: `npm start`
2.  Open a new terminal.
3.  For Android, type: `npm run android`
4.  For iPhone, type: `npm run ios`

---

## App Structure (Where files are)

*   `src/components`: Small parts of the app like buttons and players.
*   `src/screens`: The main pages you see in the app.
*   `src/navigation`: How you move between different pages.
*   `src/redux`: How the app remembers things (like if a video is playing).
*   `src/services`: The code that talks to the phone's hardware.

---

*Made with care by Antigravity.*
