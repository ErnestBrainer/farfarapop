import React, { useState } from "react";

const VideoCard = ({ video }) => {
  const [likes, setLikes] = useState(video.likes || 0);
  const [comments, setComments] = useState(video.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setComments([...comments, newComment]);
    setNewComment("");
  };

  return (
    <div style={styles.card}>
      {/* Video */}
      <video style={styles.video} controls>
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Details */}
      <h3>{video.title}</h3>
      <p>By {video.artist}</p>
      <p>{video.views || 0} views</p>

      {/* Actions */}
      <button onClick={handleLike}>👍 {likes} Likes</button>
      <button>🔗 Share</button>

      {/* Comments */}
      <div style={styles.commentsSection}>
        <h4>Comments ({comments.length})</h4>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <p key={index} style={styles.comment}>
              {comment}
            </p>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={styles.input}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

// Styling
const styles = {
  card: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "16px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
  },
  video: {
    width: "100%",
    borderRadius: "8px",
  },
  commentsSection: {
    marginTop: "16px",
    paddingTop: "10px",
    borderTop: "1px solid #ddd",
  },
  comment: {
    margin: "4px 0",
    padding: "6px 10px",
    backgroundColor: "#eee",
    borderRadius: "6px",
  },
  commentForm: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
};

export default VideoCard;
