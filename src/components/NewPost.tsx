import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import defaultProfile from "../assets/defaultProfile.jpg";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { LoggedInUser, Post } from "../pages/Home";

interface NewPostProps {
  addPost: (newData: Post) => void;
  closePopUp: () => void;
}

const NewPost = ({ addPost, closePopUp }: NewPostProps) => {
  const auth = getAuth();
  const [userData, setUserData] = useState<LoggedInUser | null>(null);
  const [content, setContent] = useState("");

  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as LoggedInUser);
        } else {
          console.log("User profile not found in Firestore");
        }
      } else {
        console.log("Not logged in");
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleClick = async () => {
    if (!userData) {
      console.log("user not logged in");
      return;
    }

    try {
      const newPost = {
        comments: [],
        content: content,
        likes: 0,
        timestamp: Timestamp.now(),
        userId: userData?.uid,
        username: userData?.username || "anonymous",
        photoUrl: userData.photoUrl || "",
      };

      const docRef = await addDoc(postsCollectionRef, {
        ...newPost,
        timestamp: serverTimestamp(),
      });

      const postWithId = { ...newPost, id: docRef.id };

      addPost(postWithId);

      setContent("");
      closePopUp();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50  bg-blue-200/20 flex items-start justify-center pt-20">
        <div
          className="bg-gray-950 text-white p-4 rounded-xl shadow-lg w-full 
                max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative"
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
            onClick={closePopUp}
          >
            ✕
          </button>

          <div className="flex items-start gap-4">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={userData?.photoUrl || defaultProfile}
              onError={(e) => {
                e.currentTarget.src = defaultProfile;
              }}
              alt="user profile"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-transparent border-none resize-none text-lg outline-none placeholder-gray-400 pt-3"
              placeholder="What's happening?"
              rows={3}
            />
          </div>

          <div className="border-t border-gray-700 my-3"></div>
          <div className="flex w-full">
            <button
              onClick={handleClick}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;
