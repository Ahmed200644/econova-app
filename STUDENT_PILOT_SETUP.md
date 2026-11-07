# EcoNova Campus Recycling Mobile MVP v1.0.0 — Student Pilot Setup Guide

## Overview
This guide instructs student testers and pilot facilitators on how to launch, configure, and navigate the **EcoNova Mobile MVP v1.0.0** during pilot testing sessions.

---

## 1. How a Tester Starts the Application

1. **Launch App:** Open the application via Expo client or web preview URL.
2. **Initial Welcome Screen:**
   * You will see the Welcome screen displaying the tagline: `RECYCLE · EARN · IMPACT`.
   * Tap **Get Started** or **Already have an account? Log In**.

---

## 2. Onboarding & Setup

1. **Complete Campus Setup Screen:**
   * **Full Name:** Enter your name (e.g., "Sarah" or "Ahmed").
   * **Select University:** Tap your university (Default: `Luxor University`).
   * **Select Faculty:** Tap your faculty (Default: `Faculty of Science`).
   * **Academic Year:** Select your year (Default: `Year 3`).
   * Tap **Confirm & Continue to Dashboard**.

2. **Reach Home Screen:**
   * You will land directly on the **Home Screen** displaying your personalized greeting, Green Points hero card, quick action cards, impact summary, active challenge streak, and nearby recycling station.

---

## 3. How to Test Core Features

### A. Performing a Recycling Action
1. From the Home screen, tap the prominent middle **Scan** dock button or **Scan & Earn** card.
2. You will see the **Scan Station QR Code** viewfinder screen.
3. **Simulated Scan:** Tap directly inside the central green viewfinder box to simulate scanning station `EcoNova Main Hub`.
4. **Manual Code Fallback:** Alternatively, tap **Enter Code Manually (Fallback)**, type `ST-101` or `ST-102`, and tap **Verify Code**.
5. On the **Select Recycled Items** screen:
   * Increase quantities using the `+` buttons for Plastic, Paper, Metal, or E-Waste.
   * Observe the real-time **Estimated Points & Impact** card update.
   * Tap **Confirm Recycling Action**.
6. On the **Action Success** screen, review your awarded Green Points and CO2e avoided, then tap **Back to Dashboard**.

### B. Checking Green Points & History
1. Tap the Green Points hero card on the Home screen.
2. View your updated point balance, level badge, and itemized transaction history.

### C. Testing Challenges
1. Tap the **Challenges** tab in the bottom dock.
2. Filter by All, Weekly, or Daily Streaks.
3. Tap **Join Challenge** on any active sprint.
4. Complete a recycling action and return to verify progress updates.

### D. Testing Campus Leaderboard
1. From the Home screen greeting or Profile menu, tap **Campus Leaderboard & Cup** (or **Leaderboard →** link).
2. View the Top 3 Podium (Gold, Silver, Bronze) and locate your entry highlighted in dark Emerald green.
3. Switch between **Top Students** and **Faculties Cup** tabs.

### E. Testing Rewards & Vouchers
1. Tap the **Rewards** tab in the bottom dock.
2. Browse available rewards (e.g., "Campus Cafe 20% Off Coffee" - 200 pts).
3. Tap **Redeem** and confirm redemption.
4. Switch to **My Vouchers** tab to view your generated voucher code (`ECO-XXXX`).
5. Tap the voucher card to open the scannable QR display modal and test **Mark as Used**.

### F. Testing Environmental Impact
1. Tap **Profile** → **Environmental Impact Analytics** (or tap **See all →** on Home).
2. View real-world equivalencies (Trees Planted, Energy Saved, Car Distance Offset) and composition graphs.
3. Tap **Share My Environmental Impact** to test the share preview card and link copy action.

### G. Testing Achievements & Settings
1. Tap **Profile** → **Campus Achievements & Badges** to view unlocked vs. locked badges.
2. Tap **Settings & Preferences** to test push notification and dark mode switches, language toggle, and logout confirmation.
