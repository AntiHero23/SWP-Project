import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import "./index.scss";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Track the currently selected post

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blog");
        console.log(response.data.result);
        if (response.data.code === 1000) {
          setPosts(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleTitleClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="blog-section">
      <div className="blog-container">
        <h2>Our Blog</h2>
        {posts.map((post) => (
          <div className="blog-card" key={post.id}>
            <div
              className="blog-image"
              style={{ backgroundImage: `url(${post.mainImage})` }}
            ></div>
            <div className="blog-content">
              <h3
                onClick={() => handleTitleClick(post)}
                className="clickable-title"
              >
                {post.title}
              </h3>
              <p className="blog-author">
                By {post.author} -{" "}
                {new Date(post.publishedDate).toLocaleDateString()}
              </p>
              <p className="blog-text">{post.content}</p>
            </div>
          </div>
        ))}
        {selectedPost && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedPost.title}</h3>
              <p className="modal-author">
                By {selectedPost.author} -{" "}
                {new Date(selectedPost.publishedDate).toLocaleDateString()}
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={selectedPost.mainImage}
                  alt={selectedPost.title}
                  style={{ width: "100px" }}
                />
              </div>
              {selectedPost.content.split("\n").map((line, index) => (
                <p key={index} className="modal-text">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
