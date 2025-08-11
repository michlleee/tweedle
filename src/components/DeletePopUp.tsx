interface DeletePopUpProps {
  handleDelete: (postId: string) => void;
  postId: string;
  handlePopUp: () => void;
}

const DeletePopUp = ({
  handleDelete,
  postId,
  handlePopUp,
}: DeletePopUpProps) => {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative animate-fadeIn">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition"
            onClick={handlePopUp}
          >
            ✕
          </button>

          <div className="flex justify-center mb-4">
            <div className="bg-red-500/20 text-red-500 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.94-1.088 3.083-2.624L21 5H3l1.055 11.376A3.001 3.001 0 007.062 19z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Delete Post?</h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePopUp}
              className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(postId)}
              className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePopUp;
