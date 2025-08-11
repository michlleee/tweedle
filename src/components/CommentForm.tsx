import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import type { Post } from "../pages/Home";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import defaultProfile from "../assets/defaultProfile.jpg";
import { db } from "../config/firebase";
import type { LoggedInUser } from "../pages/Home";

interface CommentFormProps {
  post: Post;
  closePopUp: () => void;
  updatePostList: () => void;
}

const CommentForm = ({
  post,
  closePopUp,
  updatePostList,
}: CommentFormProps) => {
  const [userData, setUserData] = useState<LoggedInUser | null>(null);
  const [content, setContent] = useState("");
  const auth = getAuth();

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
    if (!post.id) {
      console.error("post.id is undefined or null!");
      return;
    }
    const postRef = doc(db, "posts", post.id);

    const newComment = {
      userId: userData?.uid,
      username:
        userData?.username?.replace(/\s+/g, "").toLowerCase() || "anonymous",
      content: content,
      createdAt: Timestamp.now(),
    };
    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      updatePostList();
      closePopUp();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-blue-200/20 flex items-start justify-center pt-20 px-4">
        <div className="bg-gray-950 text-white p-6 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative max-h-[80vh] overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
            onClick={closePopUp}
          >
            ✕
          </button>

          <div className="flex gap-6">
            <div className="flex flex-col items-center flex-shrink-0 w-12">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={post.photoUrl}
                onError={(e) => {
                  e.currentTarget.src = defaultProfile;
                }}
                alt="post profile"
              />
              <div className="w-px bg-gray-700 flex-grow my-2"></div>
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-medium">
                {post.username}{" "}
                <span className="text-sm text-gray-400 font-normal">
                  @{post.username} · {post.timestamp.toDate().getDate()}{" "}
                  {post.timestamp
                    .toDate()
                    .toLocaleString("default", { month: "short" })}
                </span>
              </h4>
              <p className="mt-1">{post.content}</p>
              <p className="text-base text-gray-400 font-normal mt-4">
                Replying to{" "}
                <span className="text-blue-500">@{post.username}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <img
              className="w-12 h-12 rounded-full object-cover mt-1 flex-shrink-0"
              src={userData?.photoUrl || defaultProfile}
              onError={(e) => {
                e.currentTarget.src = defaultProfile;
              }}
              alt="user profile"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent border-none resize-none text-lg outline-none placeholder-gray-400 mt-3"
              placeholder="What's your reply?"
              rows={3}
            />
          </div>

          <div className="border-t border-gray-700 my-3"></div>
          <div className="flex w-full">
            <button
              onClick={handleClick}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentForm;
