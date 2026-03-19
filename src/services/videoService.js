const API_URL = 'http://localhost:5000/api/videos';

export const fetchVideos = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (err) {
    console.error('Error fetching videos:', err);
    return [];
  }
};
