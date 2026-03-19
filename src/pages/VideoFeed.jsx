import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://10.23.15.151:5000/api/videos");
        setVideos(res.data.reverse());
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleView = async (id) => {
    try {
      await axios.post(`http://10.23.15.151:5000/api/videos/${id}/view`);
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, views: v.views + 1 } : v))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleComments = async (videoId) => {
    try {
      const res = await axios.get(`http://10.23.15.151:5000/api/videos/${videoId}/comments`);
      setComments(res.data.comments || []);
      setShowComments(true);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async (videoId) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`http://10.23.15.151:5000/api/videos/${videoId}/comments`, {
        text: newComment,
      });
      setComments(res.data);
      setNewComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const windowHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / windowHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
      if (videos[newIndex]) {
        handleView(videos[newIndex]._id);
      }
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`http://10.23.15.151:5000/api/videos/${id}/like`);
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, likes: v.likes + 1 } : v))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (video) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: `http://10.23.15.151:5174/watch/${video._id}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`http://10.23.15.151:5174/watch/${video._id}`);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-lg">
        Loading videos...
      </div>
    );

  if (!videos.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white text-lg">
        <p className="mb-4">No videos uploaded yet.</p>
        <Link 
          to="/login" 
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold"
        >
          Login to Upload
        </Link>
      </div>
    );

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Main Video Feed */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => (
          <div
            key={video._id}
            className="h-screen snap-start relative flex items-center justify-center"
          >
            <video
              src={video.url}
              className="w-full h-full object-cover pointer-events-none"
              controls={false}
              autoPlay={index === currentVideoIndex}
              muted={index === currentVideoIndex}
              loop
              onPlay={() => handleView(video._id)}
            />

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50">
              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center pointer-events-auto z-10">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold mb-1">
                    {video.artist?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="text-white text-xs font-semibold">Follow</button>
                </div>
                
                <button
                  onClick={() => handleLike(video._id)}
                  className="flex flex-col items-center text-white hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xl">❤️</span>
                  </div>
                  <span className="text-xs">{video.likes || 0}</span>
                </button>
                
                <button
                  onClick={() => handleComments(video._id)}
                  className="flex flex-col items-center text-white hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xl">💬</span>
                  </div>
                  <span className="text-xs">{video.comments?.length || 0}</span>
                </button>
                
                <button
                  onClick={() => handleShare(video)}
                  className="flex flex-col items-center text-white hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xl">↗️</span>
                  </div>
                  <span className="text-xs">Share</span>
                </button>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-20 text-white">
                <div className="mb-2">
                  <span className="font-bold">@{video.artist || 'unknown'}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{video.title || 'Untitled'}</h3>
                <div className="flex items-center gap-4 text-sm opacity-80">
                  <span>👁 {video.views || 0} views</span>
                  <span>❤️ {video.likes || 0} likes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Overlay */}
      {showComments && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <button
              onClick={() => setShowComments(false)}
              className="text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-white font-semibold">Comments</h3>
            <div className="w-6"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {comments.length ? (
              comments.map((c, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      U
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{c.text}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No comments yet.</p>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(videos[currentVideoIndex]?._id)}
              />
              <button
                onClick={() => handleAddComment(videos[currentVideoIndex]?._id)}
                className="bg-pink-500 text-white px-4 py-2 rounded-full font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;