import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import type { Post } from "./Home";
import defaultPofile from "../assets/defaultProfile.jpg";
import commentIcon from "../assets/comment-1-svgrepo-com.svg";
import CommentForm from "../components/CommentForm";
import { useNavigate } from "react-router-dom";
import backIcon from "../assets/back-svgrepo-com.svg";
import Ylogo from "../components/Ylogo";

const Comments = () => {
  const { postId } = useParams<{ postId: string }>();
  const [currPost, setCurrPost] = useState<Post | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const navigate = useNavigate();

  if (!postId) {
    return <div>Post not found</div>;
  }

  const getCurrPost = async () => {
    const postRef = doc(db, "posts", postId);
    try {
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data() as Post;
        const { id, ...rest } = postData;
        setCurrPost({ id: postId, ...rest });
      } else {
        console.log("Post data not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrPost();
  }, []);

  return (
    <>
      <Ylogo />
      <div className="min-h-screen flex flex-col justify-start items-center bg-gray-950 p-4">
        <div className="relative max-w-xl mx-auto p-8 pt-15 bg-gray-900 rounded-lg shadow-md text-white">
          <button
            onClick={() => navigate(-1)}
            className="
            absolute
            -left-12 top-4
            bg-gray-800 hover:bg-blue-600
            rounded-full
            w-10 h-10
            flex items-center justify-center
            text-white text-2xl
            shadow-lg
            transition duration-300 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Go back"
          >
            <img className="h-6 w-6" src={backIcon} alt="back icon" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <img
              className="w-11 h-11 rounded-full"
              src={currPost?.photoUrl || defaultPofile}
              alt="user profile"
              onError={(e) => {
                e.currentTarget.src = defaultPofile;
              }}
            />
            <div>
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                {currPost?.username}
                <span className="text-gray-400 text-sm font-normal">
                  @{currPost?.username}
                </span>
              </h4>
              <span className="text-gray-500 text-sm">
                {currPost?.timestamp?.toDate().toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-gray-100 text-base whitespace-pre-wrap mb-6">
            {currPost?.content}
          </p>

          <div className="flex gap-3 mb-5">
            <button
              type="button"
              className="w-5 h-5 rounded-md cursor-pointer transition duration-300 ease-in-out
               hover:scale-110
               hover:bg-blue-300/30
               hover:ring-3 hover:ring-blue-300
               hover:outline-none flex items-center justify-center"
              aria-label="Comment"
              onClick={() => {
                setCurrPost(currPost);
                setShowCommentForm(true);
              }}
            >
              <img
                src={commentIcon}
                alt="comment button"
                className="w-full h-full"
              />
            </button>
            <p className="text-sm">{currPost?.comments.length}</p>
          </div>

          <div className="border-t border-gray-700 pt-4 space-y-6 pb-12">
            {currPost?.comments?.map((comment, cIdx) => (
              <div key={cIdx} className="flex gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.photoUrl || defaultPofile}
                    alt={`${comment.username}'s profile`}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultPofile;
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-300 font-semibold">
                    @{comment.username}
                    <span className="text-gray-500 font-normal ml-2 text-xs">
                      · {comment.createdAt?.toDate().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-200 mt-1 text-sm">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-gray-500 mt-8 text-sm">
            End of comments
          </div>
        </div>
        {showCommentForm && currPost && (
          <CommentForm
            post={currPost}
            closePopUp={() => {
              setShowCommentForm(false);
            }}
            updatePostList={getCurrPost}
          />
        )}
      </div>
    </>
  );
};

export default Comments;
