# 🕵️ Who Is Lying? (Spy Game Engine)

A real-time, multi-player social deduction game engine. This project demonstrates advanced state synchronization and **asymmetric data distribution**, where players in the same "room" receive different information based on server-side randomization.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🕹️ The Engineering Challenge
The core complexity of a "Spy Game" lies in **Information Symmetry Breaking**. The system must:
1.  Elect a "Host" to control game phases.
2.  Randomly select an "Odd One Out" (the Spy).
3.  Distribute a `MainQuestion` to the majority and an `OddQuestion` to exactly one player—while ensuring the UI remains identical so players cannot identify the spy by screen layout.

---

## ✨ Technical Highlights

### 1. Asymmetric Data Fetching
I implemented a specialized Firebase listener logic that dynamically determines what to display based on the `username` vs. the `oddPlayer` ID stored in the database. 
* **The Logic:** All players listen to the same room node, but the UI conditionally renders the "Odd Question" only if the local `username` matches the `oddPlayer` key.

### 2. Real-Time Presence & Room Management
Using Firebase `onChildAdded`, the app tracks player entry in real-time. 
* **Dynamic Lobby:** Players are added to a local `Map` state immediately as they join, allowing the host to see a live count before starting the game.
* **QR Code Integration:** Built-in `qrcode.react` support for instant mobile-to-mobile room joining, utilizing Next.js `window.location.origin` for dynamic URL generation.

### 3. Synchronized Game Phases
The game follows a strict state machine:
* **Lobby Phase:** Waiting for players (Presence detection).
* **Question Phase:** Information distribution (Asymmetric reveal).
* **Submission Phase:** Tracking player "Ready" states as they input answers.
* **Reveal Phase:** Synchronized "Show Answers" command pushed by the host to all clients simultaneously.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js 16 (App Router) with React 19.
* **State Management:** High-performance `Map` objects and React Hooks for tracking real-time player metadata.
* **Database:** * **Firebase Realtime DB:** Used for sub-second game state updates.
    * **MongoDB:** Integrated for persistent storage of the question bank/categories.
* **Styling:** Tailwind CSS 4.0 for a modern, high-contrast "Dark UI" aesthetic.

---

## 📂 Key Code Highlights

### Deep Dive: Information Distribution Logic
The following snippet (from `PresenceRoom.tsx`) shows how the host distributes roles without exposing the "Odd One Out" to the wrong clients:

```typescript
// Host-side role distribution
const sendQuestion = async () => {
  const keys = Array.from(players.keys());
  const randomPlayerIndex = getRandomInt(players.size);
  
  // Set the "Odd Player" and swap questions globally
  set(ref(db, `rooms/${roomId}/oddPlayer`), keys[randomPlayerIndex]);
  set(ref(db, `rooms/${roomId}/mainQuestion`), mainAsset);
  set(ref(db, `rooms/${roomId}/oddQuestion`), oddAsset);
};
