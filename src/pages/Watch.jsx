// src/pages/Watch.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);
        setComments(res.data.comments || []);
        // count a view
        await axios.post(`http://localhost:5000/api/videos/${id}/view`);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/videos/${id}/like`);
      setVideo((prev) => ({ ...prev, likes: prev.likes + 1 }));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, {
        text: comment,
      });
      // Backend returns full comments array
      setComments(res.data);
      setComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this video: ${video.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!video) return <p className="p-4">Loading video...</p>;

  return (
    <div className="p-3">
      <video
        className="w-full aspect-video rounded-lg mb-3"
        src={video.url}
        controls
        autoPlay
      />
      <h2 className="text-lg font-semibold">{video.title}</h2>
      <p className="text-sm text-gray-600">
        {video.artist} · {video.views} views
      </p>

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleLike}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          👍 Like {video.likes}
        </button>
        <button
          onClick={handleShare}
          className="px-3 py-1 bg-green-500 text-white rounded-md"
        >
          📤 Share
        </button>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Comments</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            onClick={handleComment}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg"
          >
            Post
          </button>
        </div>
        <div className="space-y-2">
          {comments.length ? (
            comments.map((c, i) => (
              <div key={i} className="p-2 border-b">
                <p className="text-sm">{c.text}</p>
                <small className="text-gray-500">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}
                </small>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watch;
