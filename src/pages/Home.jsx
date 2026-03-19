import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(null); // track which video's comments are open

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos");
        setVideos(res.data.reverse());
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/videos/${id}/like`);
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, likes: v.likes + 1 } : v))
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleView = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/videos/${id}/view`);
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, views: v.views + 1 } : v))
      );
    } catch (err) {
      console.error("View failed:", err);
    }
  };

  const handleShare = (video) => {
    const url = `${window.location.origin}/watch/${video._id}`;
    navigator.clipboard.writeText(url);
    alert("Video link copied to clipboard! 📋");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading videos...</p>
      </div>
    );

  if (!videos.length)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">No videos uploaded yet.</p>
      </div>
    );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🎶 FarfaraPop Feed</h2>
      <div className="space-y-8">
        {videos.map((video) => (
          <div
            key={video._id}
            className="border rounded-xl shadow-md bg-white overflow-hidden"
          >
            {/* Video */}
            <div className="relative pb-[56.25%] h-0">
              <video
                className="absolute top-0 left-0 w-full h-full"
                controls
                onPlay={() => handleView(video._id)}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Details */}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <p className="text-sm text-gray-600">
                <strong>Artist:</strong> {video.artist}
                <br />
                <small>
                  Uploaded: {new Date(video.uploadedAt).toLocaleString()}
                </small>
              </p>

              {/* Actions */}
              <div className="flex items-center gap-6 mt-3 text-sm">
                <button
                  onClick={() => handleLike(video._id)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  👍 Like
                </button>
                <span>{video.likes}</span>
                <span>👁 {video.views} views</span>

                <button
                  onClick={() =>
                    setOpenComments(openComments === video._id ? null : video._id)
                  }
                  className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-blue-600 text-white font-semibold text-base md:text-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    💬
                  </span>
                  <span>
                    Comments ({video.comments?.length || 0})
                  </span>
                </button>

                <button
                  onClick={() => handleShare(video)}
                  className="text-green-600 hover:underline"
                >
                  🔗 Share
                </button>
              </div>

              {/* Comments Section */}
              {openComments === video._id && (
                <div className="mt-4 p-3 border-t">
                  {video.comments?.length ? (
                    video.comments.map((c, i) => (
                      <p key={i} className="text-sm text-gray-700 mb-2">
                        <strong>{c.user || "Anon"}:</strong> {c.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
