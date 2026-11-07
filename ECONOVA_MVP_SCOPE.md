# EcoNova Campus Recycling Mobile MVP v1.0.0 — MVP Scope Lock

## Overview
This document defines the strict functional boundary for the **EcoNova Campus Recycling Mobile MVP v1.0.0**. Features listed under **Included** are fully implemented and verified for the Student Pilot phase. Features listed under **Future Production Integrations** are intentionally excluded from the MVP scope and must not be added prior to production backend deployment.

---

## Included MVP Features (v1.0.0)

### 1. Student Onboarding & Identity
* **Welcome Screen:** Tagline, feature overview, and entry point for student registration or login flow.
* **Campus Setup:** Selection of University (e.g. Luxor University), Faculty (e.g. Faculty of Science), Academic Year, and Full Name.
* **Profile Management:** Dynamic student identity card, avatar initials, level badge, and impact metrics snapshot.

### 2. Recycling & Station Discovery
* **Nearby Stations List:** Interactive station cards displaying distance in meters, operating status ("Open"/"Closed"), location details, station code (e.g., `ST-101`), and accepted material tags.
* **Station Search & Filtering:** Filter hubs by material type ("Plastic & Paper", "E-Waste") and real-time text search.
* **Station Details View:** Detailed view listing material acceptance rates (Green Points per item/kg) and direct scan entry.

### 3. Verification & Transaction Processing
* **QR Scanner Viewfinder:** Simulated station QR code scanning with visual target box and corner guides.
* **Manual Code Fallback:** Modal input for entering physical station codes (`ST-101`, `ST-102`, `ST-103`, `ST-104`) with error handling for invalid inputs.
* **Material Selection:** Real-time quantity counters for plastics, paper, metal, and e-waste with live points and CO2e estimate recalculations.
* **Duplicate Protection:** Idempotency checking (`processedSignatures` deduplication lock and `isSubmitting` UI lock) to prevent double-click point duplication.
* **Recycling Action Success Screen:** Hero celebratory view displaying awarded points, CO2e avoided, and confirmation details.

### 4. Gamification & Engagement
* **Green Points System:** Centralized reward point balance, level thresholds (Levels 1–5), level names (e.g., "Recycling Champion"), and progress percentages.
* **Campus Challenges:** Weekly, Daily, and Faculty challenge sprints with joining state, target counts, progress tracking, and reward points.
* **Campus Leaderboard:**
  * **Top Students Podium:** Gold Crown (1st), Silver (2nd), Bronze (3rd) podium rendering.
  * **Dynamic Re-sorting:** Real-time rank recalculation (`1..N`) upon point gain.
  * **Inter-Faculty Cup:** Aggregate points and active student counts per faculty.
* **Campus Achievements:** Badges ("Eco Starter", "Recycling Champion", "Carbon Buster", "E-Waste Guardian", "Streak Master") with dynamic unlock conditions and progress tracking.

### 5. Environmental Impact Analytics
* **Equivalency Engine:** Real-world metrics calculated from actual recycling history:
  * Trees Planted Equivalent (`0.05 × CO2e`)
  * Energy Saved (`2.5 kWh × kg recycled`)
  * Car Distance Offset (`4.2 km × CO2e`)
* **Composition Breakdown:** Material breakdown bar charts.
* **Shareable Impact Card:** Customized summary modal with copyable link.

### 6. Student Rewards & Vouchers
* **Rewards Catalog:** Campus vendor vouchers (coffee discounts, print passes, eco water bottles, bookstore discounts) with point costs and availability stock.
* **Balance Validation:** Automatic validation preventing redemption when point balance is insufficient.
* **Voucher Generation:** Instant creation of single-use voucher codes (`ECO-XXXX`) stored under "My Vouchers".
* **Voucher QR Display & Status:** Interactive modal displaying readable QR code for cashier validation and "Mark as Used" state toggle.

### 7. Settings & Preferences
* **App Preferences:** Toggles for Push Notifications and Dark Mode, language selection ("English" / "Arabic").
* **Logout Confirmation:** Modal confirming logout and safely resetting application state to Welcome view.

---

## Future Production Integrations (Not Included in MVP)

The following infrastructure capabilities are explicitly out of scope for v1.0.0 and categorized for future production milestones:

1. **Production Backend & Cloud Database:** (PostgreSQL, Firebase, Cloud Spanner) for persistent cloud data storage across devices.
2. **Real Authentication & Identity Provider:** (OAuth2, Single Sign-On, University SAML/Active Directory authentication).
3. **Real-time Cloud Synchronization:** WebSockets or server-sent events for multi-device sync.
4. **Hardware Optical QR Scanner SDK:** Integration with device camera drivers for physical barcode scanning (simulated with manual fallback in MVP).
5. **Payment Gateway & Vendor APIs:** Automated POS integration with campus cafes or bookstores.
6. **Administrative Management Portal:** Web dashboard for university staff to add physical bins and manage inventory.
7. **University ERP / Registrar Integration:** Direct syncing with official student enrollment records.
8. **Push Notification Infrastructure:** Apple APNs / Firebase Cloud Messaging (FCM) push service integration.

---

## Scope Governance
No additional features or architectural modifications should be introduced during the Student Pilot Test phase.
