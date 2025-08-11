import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Comments from "./pages/Comments";
import ManagePost from "./pages/ManagePost";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Auth />} />
          <Route path="/comments/:postId" element={<Comments />} />
          <Route path="/manage-posts/:userId" element={<ManagePost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
