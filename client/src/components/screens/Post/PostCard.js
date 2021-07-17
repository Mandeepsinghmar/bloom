import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import InputComment from "./InputComment";
import RightSideBar from "./RightSideBar";

const PostCard = ({ post, setData, data }) => {
  const [showComment, setShowComment] = useState(false);
  const { state } = useContext(UserContext);

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

  const bookmark = (id) => {
    fetch("/bookmark", {
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

  const unBookmark = (id) => {
    fetch("/unbookmark", {
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
      {post && (
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
                justifyContent: "space-between",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "15px",
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
                    <span style={{ fontWeight: "600" }}>
                      {post.likes.length}{" "}
                      {post.likes.length === 0 ? "like" : "likes"}
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

                    <span style={{ fontWeight: "600" }}>
                      <span>{post.likes.length} </span>
                      {post.likes.length > 1 ? "likes" : "like"}
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
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {post.comments.length}{" "}
                  </span>
                </div>
              </div>

              <div className="bookmark">
                {post.bookmarks.includes(state._id) ? (
                  <div className="like" style={{ float: "right" }}>
                    <i
                      className="bx bxs-bookmark"
                      style={{
                        fontSize: "2rem",
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => unBookmark(post._id)}
                    ></i>
                    <span style={{ fontWeight: "600" }}>
                      {post.bookmarks.length}{" "}
                    </span>
                  </div>
                ) : (
                  <div className="unlike">
                    <i
                      className="bx bx-bookmark"
                      style={{
                        fontSize: "2rem",
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => bookmark(post._id)}
                    ></i>

                    <span style={{ fontWeight: "600" }}>
                      {post.bookmarks.length > 0 && (
                        <span>{post.bookmarks.length} </span>
                      )}
                    </span>
                  </div>
                )}
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
            {post.comments.length > 2 && (
              <>
                {!showComment ? (
                  <div
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      fontWeight: "400",
                      marginBottom: "6px",
                    }}
                    onClick={() => setShowComment(!showComment)}
                  >
                    <p
                      style={{
                        color: "#8E8E8E",
                      }}
                    >
                      view all{" "}
                      <span
                        style={{
                          color: "#8E8E8E",
                        }}
                      >
                        {" "}
                        {post.comments.length}{" "}
                        {post.comments.length === 1 ? "comment" : "comments"}
                      </span>{" "}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      fontWeight: "400",
                      marginBottom: "6px",
                    }}
                    onClick={() => setShowComment(!showComment)}
                  >
                    <p
                      style={{
                        color: "#8E8E8E",
                      }}
                    >
                      hide{" "}
                      <span
                        style={{
                          color: "#8E8E8E",
                        }}
                      >
                        {" "}
                        {post.comments.length === 1 ? "comment" : "comments"}
                      </span>{" "}
                    </p>
                  </div>
                )}
              </>
            )}
            {showComment ? (
              <>
                {post.comments.map((comment) => (
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
              </>
            ) : (
              <>
                {post.comments &&
                  post.comments
                    .slice(post.comments.length - 2, post.comments.length)
                    .map((comment) => (
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
              </>
            )}
            <InputComment data={data} setData={setData} postId={post._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
