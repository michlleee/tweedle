import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import NewPost from "../components/NewPost";
import defaultPofile from "../assets/defaultProfile.jpg";
import commentIcon from "../assets/comment-1-svgrepo-com.svg";
import CommentForm from "../components/CommentForm";
import Ylogo from "../components/Ylogo";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Logout from "../components/Logout";

export type LoggedInUser = {
  uid: string;
  username: string;
  photoUrl: string;
  email: string;
  createdAt: Timestamp;
};

type Comment = {
  userId: string;
  username: string;
  photoUrl: string;
  content: string;
  createdAt: Timestamp;
};

export type Post = {
  id: string;
  userId: string;
  username: string;
  content: string;
  comments: Comment[];
  timestamp: Timestamp;
  photoUrl: string;
};

function Home() {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [popUp, setPopUp] = useState(false);
  const [logoutPopUp, setLogoutPopUp] = useState(false);
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

  const postsCollectionRef = collection(db, "posts");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setLoggedInUser(userSnap.data() as LoggedInUser);
        } else {
          console.log("User profile not found in firestore");
        }
      } else {
        setLoggedInUser(null);
        console.log("Not logged in");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const getPostsList = async () => {
    //read data
    //set post state to that data

    try {
      const data = await getDocs(postsCollectionRef);
      const filteredData = data.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          userId: docData.userId,
          username: docData.username,
          content: docData.content,
          comments: docData.comments,
          timestamp: docData.timestamp,
          photoUrl: docData.photoUrl,
        } as Post;
      });
      setPostsList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostsList();
  }, []);

  const handleClick = () => {
    setPopUp(true);
  };

  const handleClose = () => {
    setPopUp(false);
  };

  const handleCloseComment = () => {
    setCommentPost(null);
  };

  const addPostToList = (newPost: Post) => {
    setPostsList((prev) => [newPost, ...prev]);
  };

  const updatePostInList = () => {
    getPostsList();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedInUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Ylogo />
      <div className="min-h-screen bg-gray-950 flex flex-col items-center px-4">
        <div className="text-3xl text-gray-100 font-bold mt-10 mb-10">
          <h2>Your Feed</h2>
        </div>

        <div className="w-full max-w-2xl space-y-6">
          {postsList.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet...</p>
          ) : (
            postsList.map((post, index) => (
              <div
                key={index}
                className="bg-gray-900 text-gray-100 rounded-xl p-6 border border-gray-800 shadow hover:shadow-lg transition"
              >
                <div className="flex gap-3 items-end mb-3">
                  <img
                    className="w-9 h-9 rounded-3xl"
                    src={post.photoUrl || defaultPofile}
                    alt="user profile"
                    onError={(e) => {
                      e.currentTarget.src = defaultPofile;
                    }}
                  />
                  <h4 className="text-xl mb-1 font-medium">
                    {post.username}{" "}
                    <span className="text-gray-400 text-sm">said..</span>
                  </h4>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    @{post.username.replace(/\s+/g, "").toLowerCase()} ·{" "}
                    {post.timestamp.toDate().toLocaleString()}
                  </span>
                </div>

                <p className="text-base text-gray-100 mb-6 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="p-1 rounded outline-1 outline-transparent hover:outline-blue-200 hover:bg-cyan-500/80 hover:scale-110 transition ease-in-out duration-200"
                    aria-label="Comment"
                    onClick={() => {
                      setCommentPost(post);
                    }}
                  >
                    <img
                      src={commentIcon}
                      alt="comment button"
                      className="w-5 h-5"
                    />
                  </button>
                  <p className="py-1 text-sm">{post.comments.length}</p>
                </div>

                {post.comments.length > 0 && (
                  <div className="text-sm pt-3 flex justify-center cursor-pointer">
                    <a
                      className="underline decoration-solid"
                      href={"/comments/" + post.id}
                    >
                      View more comments
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105"
        >
          <span className="text-xl font-bold">+</span>
          <span className="font-medium">New Post</span>
        </button>

        <button
          onClick={() => navigate(`/manage-posts/${loggedInUser?.uid}`)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105"
        >
          <span className="font-medium">Manage Posts</span>
        </button>

        <button
          onClick={() => setLogoutPopUp(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Logout
        </button>
      </div>

      {popUp && <NewPost addPost={addPostToList} closePopUp={handleClose} />}
      {commentPost && (
        <CommentForm
          post={commentPost}
          closePopUp={handleCloseComment}
          updatePostList={updatePostInList}
        />
      )}
      {logoutPopUp && (
        <Logout
          handlePopUp={() => {
            setLogoutPopUp(false);
          }}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
}

export default Home;
