import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import type { LoggedInUser, Post } from "./Home";
import commentIcon from "../assets/comment-1-svgrepo-com.svg";
import defaultProfile from "../assets/defaultProfile.jpg";
import backIcon from "../assets/back-svgrepo-com.svg";
import trashIcon from "../assets/trash-icon.svg";
import DeletePopUp from "../components/DeletePopUp";
import NewPost from "../components/NewPost";

const ManagePost = () => {
  const params = useParams();
  const [postData, setPostData] = useState<Post[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const [userData, setUserData] = useState<LoggedInUser | null>(null);
  const [popUp, setPopUp] = useState(false);
  const [newPostPopUp, setNewPostPopUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = params.userId;
    if (!userId) {
      console.log("user not found");
      setUserData(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as LoggedInUser);
        } else {
          console.log("User profile not found in Firestore");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [params.userId]);

  const postRef = collection(db, "posts");
  const getPosts = async () => {
    try {
      const q = query(postRef, where("userId", "==", params.userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        return setPostData([]);
      }
      const allPosts = querySnapshot.docs.map((doc) => {
        const docData = doc.data();

        return {
          id: doc.id,
          userId: docData.userId,
          username: docData.username,
          content: docData.content,
          comments: docData.comments || [],
          timestamp: docData.timestamp,
          photoUrl: docData.photoUrl,
        } as Post;
      });
      setPostData(allPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalComments = () => {
    let total = 0;
    postData.forEach((post) => {
      total += post.comments.length;
    });

    setTotalComments(total);
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPopUp(false);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    getTotalComments();
  }, [postData]);

  return (
    <>
      <div className="relative min-h-screen bg-gray-950 text-white px-4 pb-20">
        <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md px-4 py-3 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-800 hover:bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Go back"
            >
              <img className="h-6 w-6" src={backIcon} alt="back icon" />
            </button>
            <h1 className="text-xl font-bold">Manage Posts</h1>
          </div>
          <button
            onClick={() => setNewPostPopUp(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-white font-medium transition hover:scale-105"
          >
            + New Post
          </button>
        </div>

        <div className="flex flex-col items-center mb-8 mt-6">
          <img
            src={userData?.photoUrl || defaultProfile}
            onError={(e) => {
              e.currentTarget.src = defaultProfile;
            }}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg mb-4"
          />
          <h1 className="text-2xl font-bold capitalize">
            {userData?.username}
          </h1>
          <p className="text-gray-400">
            @{userData?.username.replace(/\s+/g, "").toLowerCase()}
          </p>
          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold">{totalComments}</p>
              <p className="text-gray-400 text-sm">Total Comments</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {postData.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet...</p>
          ) : (
            postData.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900/80 rounded-xl p-6 border border-gray-800 shadow hover:shadow-lg transition relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-400">
                    {post.timestamp?.toDate
                      ? post.timestamp.toDate().toLocaleString()
                      : "No date"}
                  </div>
                  <button
                    onClick={() => {
                      setDeleteId(post.id);
                      setPopUp(true);
                    }}
                    className="p-1 rounded-full hover:bg-red-500/60 transition ease-in-out duration-200"
                  >
                    <img
                      src={trashIcon}
                      alt="delete post"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                <p className="text-base text-gray-100 mb-6 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex gap-2 items-center text-gray-400">
                  <img src={commentIcon} alt="comments" className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {popUp && (
          <DeletePopUp
            handleDelete={handleDelete}
            postId={deleteId}
            handlePopUp={() => {
              setPopUp(false);
            }}
          />
        )}

        {newPostPopUp && (
          <NewPost
            addPost={(newData: Post) => {
              setPostData((prev) => [newData, ...prev]);
            }}
            closePopUp={() => {
              setNewPostPopUp(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ManagePost;
