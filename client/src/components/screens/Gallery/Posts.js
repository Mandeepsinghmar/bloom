import React, { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import "./style.css";
import { Link } from "react-router-dom";

const Posts = ({ data }) => {
  return (
    <div className="posts-container-wrapper">
      {data ? (
        data.map((post) => (
          <div key={post._id}>
            <Link to={`/post/${post._id}`}>
              <div className="posts-container">
                <img src={post.imageUrl} alt="" className="image-url" />
                <div className="likes-comment">
                  <div
                    className="likes-comment-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "5px",
                    }}
                  >
                    <i
                      className="bx bxs-heart"
                      style={{
                        fontSize: "2rem",
                        color: "white",
                      }}
                    ></i>
                    <span>
                      {post.likes.length}{" "}
                      {post.likes.length === 1 || 0 ? "like" : "likes"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "5px",
                    }}
                    className="likes-comment-container"
                  >
                    <i
                      className="bx bx-comment"
                      style={{
                        fontSize: "1.8rem",
                        color: "white",
                      }}
                    ></i>
                    <span>
                      {post.comments.length}{" "}
                      {post.comments.length === 1 ? "comment" : "comments"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className="loader">
          <FadeLoader
            color="#1a91da"
            height={10}
            width={2}
            radius={1}
            margin={2}
          />
        </div>
      )}
    </div>
  );
};

export default Posts;
