# Tweedle

Tweedle is a simple social posting web app where users can create posts, comment on others’ posts, and manage their own feed.  
It’s built with React, Firebase, and TypeScript, focusing on clean design and straightforward user experience.

Checkout the web here --> https://tweedle-kappa.vercel.app/

<img width="1909" height="902" alt="image" src="https://github.com/user-attachments/assets/d8d735db-f53b-4467-aabb-76074352ea36" />
<img width="1915" height="903" alt="image" src="https://github.com/user-attachments/assets/e56edc4a-cfbd-4775-9a56-ed69467ad4c8" />
ps: that long rant text was ai generated.

---

## Features

- **User Authentication** – Sign in and out using Firebase Authentication.  
- **Post Creation** – Share text posts with optional profile pictures.  
- **Comment & Liking System** – Add comments or like directly on posts.  
- **Feed View** – Browse all posts in a clean, scrollable list.  
- **Post Management** – Edit or delete your own posts from a dedicated page.  
- **Responsive UI** – Styled with Tailwind CSS for mobile-friendly layouts.

---

## Tech Stack

- **React** – Frontend framework for building interactive UIs.  
- **TypeScript** – Static typing for safer, more maintainable code.  
- **Firebase Authentication** – User login/logout management.  
- **Firebase Firestore** – Cloud database for posts and comments.  
- **Tailwind CSS** – Utility-first CSS framework for styling.  
- **React Router** – Client-side routing for navigation.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)  
- A Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/michlleee/tweedle.git
   cd tweedle
   ```
2. **Install dependencies**
   ```
   npm install
   # or
   yarn install
   ```
3. **Set up Firebase config**
   Create a file at src/config/firebase.ts and add your Firebase credentials:
   ```
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";
   
   const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_STORAGE_BUCKET",
   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
   appId: "YOUR_APP_ID",
   };
   
   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```
4. **Run the app**
   ```
   npm run dev
    # or
    yarn dev
    ```

## Project Structure
   ```
   tweedle/
   ├── src/
   │   ├── components/       # UI components (forms, buttons, etc.)
   │   ├── pages/            # Main pages (Home, Manage Posts, etc.)
   │   ├── assets/           # Images and icons
   │   ├── config/           # Firebase configuration
   │   └── App.tsx           # App entry point
   ├── public/               # Static assets
   ├── package.json
   └── vite.config.ts
   ```
