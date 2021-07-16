import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import InputComment from "./InputComment";
import RightSideBar from "./RightSideBar";
import "./style.css";

const Post = ({ data, state, setData }) => {
  const [showComment, setShowComment] = useState(false);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="home" style={{ marginTop: "70px" }}>
        {data ? (
          data.map((post) => (
            <div className=" post-card-container" key={post._id}>
              <div className="post-card">
                <div className="person-profile">
                  <Link
                    className="home-username"
                    to={
                      post.postedBy._id !== state._id
                        ? "/profile/" + post.postedBy._id
                        : "/profile"
                    }
                  >
                    {" "}
                    <img src={post.postedBy.pic} alt={post.postedBy.name} />
                    {post.postedBy.name}
                  </Link>
                </div>
                <RightSideBar
                  postedBy={post.postedBy._id}
                  postid={post._id}
                  setData={setData}
                  data={data}
                />
              </div>

              <div className="card-image">
                <img src={post.imageUrl} />
              </div>
              <div className="card-description">
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {post.likes.includes(state._id) ? (
                    <div className="like">
                      <i
                        className="bx bxs-heart"
                        style={{
                          fontSize: "2rem",
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() => unLikePost(post._id)}
                      ></i>
                      <span>
                        {post.likes.length}{" "}
                        {post.likes.length === 1 || 0 ? "like" : "likes"}
                      </span>
                    </div>
                  ) : (
                    <div className="unlike">
                      <i
                        className="bx bx-heart"
                        style={{
                          fontSize: "2rem",
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => likePost(post._id)}
                      ></i>

                      <span>
                        {post.likes.length}{" "}
                        {post.likes.length === 0 || 1 ? "like" : "likes"}
                      </span>
                    </div>
                  )}

                  <div
                    onClick={() => setShowComment(!showComment)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <i
                      className="bx bx-comment"
                      style={{
                        fontSize: "1.8rem",
                        color: "black",
                      }}
                    ></i>
                    <span>
                      {" "}
                      {post.comments.length}{" "}
                      {post.comments.length === 1 ? "comment" : "comments"}
                    </span>
                  </div>
                </div>
                <div className="postedby" style={{ padding: "6px" }}>
                  <Link
                    className="postedby-link"
                    to={
                      post.postedBy._id !== state._id
                        ? "/profile/" + post.postedBy._id
                        : "/profile"
                    }
                  >
                    {" "}
                    {post.postedBy.name}
                  </Link>

                  <p style={{ display: "inline" }}>{post.caption}</p>
                </div>
                {showComment &&
                  post.comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <Link
                        className="comment-postedby"
                        to={
                          comment.postedBy._id !== state._id
                            ? "/profile/" + comment.postedBy._id
                            : "/profile"
                        }
                      >
                        <img src={comment.postedBy.pic} alt="" />
                        <p>{comment.postedBy.name}</p>
                      </Link>
                      <div style={{ fontSize: "1rem" }}> {comment.text}</div>
                    </div>
                  ))}
                <InputComment data={data} setData={setData} postId={post._id} />
              </div>
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
    </div>
  );
};

export default Post;
