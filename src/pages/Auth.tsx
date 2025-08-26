import { auth, googleProvider } from "../config/firebase.ts";
import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.ts";
import type { User as FirebaseUser } from "firebase/auth";
import Aurora from "../components/Aurora.tsx";
import yLogo from "../assets/y.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const saveUserToFirestore = async (user: FirebaseUser) => {
    console.log("Saving user to Firestore:", user.email);
    const userRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userRef);

    if (!existingDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: user.displayName || "New User",
        photoUrl: user.photoURL || "",
        createdAt: serverTimestamp(),
        lastSignIn: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        email: user.email,
        username: user.displayName || "New User",
        photoUrl: user.photoURL || "",
        lastSignIn: serverTimestamp(),
      });
    }
    console.log("User saved to Firestore");
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign-in redirect");
      setLoading(true);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Sign-in error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Setting up auth listener");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");

      if (user) {
        try {
          await saveUserToFirestore(user);
          console.log("Navigating to /home");
          navigate("/home");
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
      setLoading(false);
    });

    return () => {
      console.log("Cleanup auth listener");
      unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 h-screen w-screen">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 text-center w-full max-w-md">
          <img
            src={yLogo}
            alt="Tweedle Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6"
          />

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome to Tweedle
          </h1>
          <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
            Your place to share thoughts and connect.
          </p>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className={`flex items-center justify-center gap-2 sm:gap-3 w-full text-gray-900 font-medium py-3 sm:py-3.5 rounded-full shadow-lg transition transform ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white hover:scale-105"
            }`}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-sm sm:text-base">
              {loading ? "Signing in..." : "Sign in with Google"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;
