import { auth, googleProvider } from "../config/firebase.ts";
import { signInWithPopup } from "firebase/auth";
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

const Auth = () => {
  const navigate = useNavigate();

  const saveUserToFirestore = async (user: FirebaseUser) => {
    const userRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userRef);

    // Only create if not already in DB
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
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 h-screen w-screen">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <img
            src={yLogo}
            alt="Tweedle Logo"
            className="w-16 h-16 mx-auto mb-6"
          />

          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Tweedle
          </h1>
          <p className="text-gray-300 mb-8">
            Your place to share thoughts and connect.
          </p>

          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 font-medium py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;
