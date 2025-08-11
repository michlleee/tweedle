interface DeletePopUpProps {
  handleLogout: () => void;
  handlePopUp: () => void;
}

const Logout = ({ handlePopUp, handleLogout }: DeletePopUpProps) => {
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
            <div className="bg-blue-500/20 text-blue-500 p-4 rounded-full">
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Log Out?</h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            Are you sure you want to log out? You can always log back in
            anytime.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePopUp}
              className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
