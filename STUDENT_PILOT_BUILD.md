# EcoNova v1.0.0 — Student Pilot Android Build Guide

## Build & Version Metadata

| Metadata Field | Value |
| :--- | :--- |
| **Application Name** | EcoNova |
| **Version** | `1.0.0` |
| **Android Package Identifier** | `com.econova.app` |
| **Build Date** | October 4, 2026 |
| **Git Release Branch** | `release/v1.0.0` |
| **Target OS / Minimum SDK** | Android 7.0+ (API Level 24+) |
| **Build Format** | Standalone Android APK (`app-release.apk`) |

---

## 1. Installation Instructions

### Option A: Direct Sideloading on Android Phone / Tablet
1. Download `app-release.apk` to your Android device or transfer via USB/Bluetooth.
2. Tap the downloaded `.apk` file using your device's File Manager.
3. If prompted, enable **"Install from Unknown Sources"** for your file browser (Settings → Apps → Special app access → Install unknown apps).
4. Tap **Install** and wait for installation to complete.
5. Tap **Open** or launch **EcoNova** from your app drawer.

### Option B: Installation via ADB (Android Debug Bridge)
1. Connect your Android device via USB with **USB Debugging** enabled.
2. Open a terminal and run:
   ```bash
   adb install -r android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 2. First-Launch & Testing Instructions

1. **Welcome Screen:** Launch EcoNova. Tap **Get Started**.
2. **University & Faculty Selection:** Select your University (e.g. *Luxor University*) and Faculty (e.g. *Faculty of Science*), enter your name, and tap **Complete Setup**.
3. **Home View:** Verify Green Points balance, nearby recycling hubs, and active challenges.
4. **Recycling Action:**
   * Tap **Scan** on the bottom navigation bar.
   * Point camera at a station QR code or tap **Enter Station Code Manually** (e.g., `ST-101`).
   * Select recycled material (Plastic Bottles / Aluminum Cans / E-Waste).
   * Confirm submission to claim Green Points.
5. **Check Engagement:** View updated points on **Leaderboard**, unlock **Achievements**, and inspect your **Environmental Impact** metrics.
6. **Test Rewards:** Navigate to **Rewards**, select a voucher, and tap **Redeem Voucher**.

---

## 3. Known MVP Limitations (Simulated Infrastructure)

* **Client-Side Storage:** All user states, green points, and achievements persist in React Context state.
* **Simulated QR Scanner:** Includes viewfinder simulation and manual station code input fallback (`ST-101`, `ST-102`, `ST-103`).
* **Zero Production Authentication:** No passwords or personal registration required for pilot testers.
* **Simulated Vouchers:** Reward redemption generates instant client-side promotional codes.

---

## 4. Reset & Restart Instructions

If a tester wants to reset the application state back to a fresh onboarding status:
1. Open **Profile** → **Settings**.
2. Tap **Reset Demo State** or clear the app storage via **Android Settings → Apps → EcoNova → Storage & Cache → Clear Data**.
3. Re-launch **EcoNova** to begin a fresh student test run.
