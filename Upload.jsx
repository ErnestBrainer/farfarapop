import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      setMessage("Please select a .mp4 video");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("title", title);
      formData.append("artist", artist);

      const token = localStorage.getItem("token");

      const uploadRes = await axios.post(
        "http://farfarapop-backend.onrender.com", // ✅ match backend route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      // ✅ Use the correct field returned from backend
      setVideoUrl(`http://10.23.15.151:5000${uploadRes.data.video.url}`);
      setMessage("✅ Upload successful!");
      setProgress(0);
      setTitle("");
      setArtist("");
      setVideo(null);
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error);
      setMessage(
        error.response?.data?.error || "❌ Upload failed. Please try again."
      );
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Video</h1>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Artist"
              value={artist}
              required
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-gray-400">Select Video (.mp4)</label>
            <input
              type="file"
              accept="video/mp4"
              required
              onChange={(e) => setVideo(e.target.files[0])}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Upload Video
          </button>
        </form>

        {progress > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("✅") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {message}
          </div>
        )}

        {videoUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Preview:</h3>
            <video className="w-full rounded-lg" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
