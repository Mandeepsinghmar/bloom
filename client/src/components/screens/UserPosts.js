import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { UserContext } from "../../App";

import FadeLoader from "react-spinners/FadeLoader";
import M from "materialize-css";
import { useHistory } from "react-router";

function UserPosts() {
  const { state, dispatch } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState();
  const { userid } = useParams();
  //   if (userPosts) {
  //     setMyPosts(userPosts);
  //   }
  //   console.log(myPosts);
  const history = useHistory();

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setMyPosts(data.posts);
      });
    return () => {
      abortCont.abort();
    };
  }, []);
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
        const newData = myPosts.map((post) => {
          if (post._id == result._id) {
            return result;
          } else {
            return post;
          }
        });
        setMyPosts(newData);
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
        const newData = myPosts.map((post) => {
          if (post._id == result._id) {
            return result;
          } else {
            return post;
          }
        });
        setMyPosts(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    if (text) {
      fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = myPosts.map((post) => {
            if (post._id == result._id) {
              return result;
            } else {
              return post;
            }
          });
          console.log(result);
          setMyPosts(newData);
        })
        .catch((err) => console.log(err));
    }
  };

  const deletePost = (postid) => {
    const result = window.confirm("Are you sure want to delete this post?");
    if (result) {
      fetch("/deletepost/" + postid, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          const newData = myPosts.filter((post) => {
            return post._id !== result._id;
          });
          setMyPosts(newData);
        });
    }
  };
  return (
    <>
      {myPosts
        ? myPosts.map((post) => (
            <div
              className=" home-card"
              key={post._id}
              style={{ border: "0.5px solid rgba(219,219,219)" }}
            >
              <div
                style={{
                  padding: "0px 10px ",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px",
                    gap: "8px",
                  }}
                >
                  <Link
                    className="home-username"
                    style={{
                      fontSize: "1.2rem",
                      textTransform: "lowercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px",
                      gap: "8px",
                    }}
                    to={
                      post.postedBy._id !== state._id
                        ? "/profile/" + post.postedBy._id
                        : "/profile"
                    }
                  >
                    {" "}
                    <img
                      src={post.postedBy.pic}
                      alt=""
                      style={{
                        width: "35px",
                        height: "35px",

                        borderRadius: "50%",
                      }}
                    />
                    {post.postedBy.name}
                  </Link>
                </div>

                <div>
                  {" "}
                  {post.postedBy._id == state._id && (
                    <span
                      className="material-icons"
                      style={{
                        cursor: "pointer",
                        float: "right",
                        fontSize: "1.1rem",
                      }}
                      onClick={() => deletePost(post._id)}
                    >
                      ❌
                    </span>
                  )}
                </div>
              </div>

              <div className="card-image">
                <img src={post.imageUrl} />
              </div>
              <div className="card-description">
                {post.likes.includes(state._id) ? (
                  <div className="like">
                    <i
                      className="material-icons"
                      style={{ fontSize: "2rem" }}
                      onClick={() => unLikePost(post._id)}
                      style={{ cursor: "pointer" }}
                    >
                      favorite
                    </i>
                    <span>{post.likes.length} like</span>
                  </div>
                ) : (
                  <div className="unlike">
                    <i
                      className="material-icons"
                      onClick={() => likePost(post._id)}
                      style={{ cursor: "pointer" }}
                    >
                      favorite_border
                    </i>
                    <span>{post.likes.length} like</span>
                  </div>
                )}

                {/* <span>{post.likes.length}Like</span> */}
                <div
                  style={{
                    fontSize: "1rem",
                    padding: "0px 10px",
                    margin: "0px",
                    lineHeight: "1.4",
                    paddingBottom: "3px",
                  }}
                >
                  <Link
                    className="postedby"
                    className="home-username"
                    style={{
                      fontWeight: "600",
                      marginRight: "4px",
                      overflow: "hidden",
                      fontSize: "0.9rem",
                    }}
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
                {post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    style={{
                      margin: "0px",
                      padding: "2px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <Link
                      className="home-username"
                      style={{
                        fontSize: "1rem",
                        textTransform: "lowercase",
                        display: "flex",
                        alignItems: "center",

                        gap: "8px",
                      }}
                      to={
                        comment.postedBy._id !== state._id
                          ? "/profile/" + comment.postedBy._id
                          : "/profile"
                      }
                    >
                      {" "}
                      <img
                        src={comment.postedBy.pic}
                        alt=""
                        style={{
                          width: "24px",
                          height: "24px",

                          borderRadius: "50%",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          overflow: "hidden",
                        }}
                      >
                        {" "}
                        {comment.postedBy.name}
                      </p>
                    </Link>
                    <div style={{ fontSize: "1rem" }}> {comment.text}</div>
                  </div>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    makeComment(e.target[0].value, post._id);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="comment"
                    type="text"
                    placeholder="Add a comment.."
                    style={{
                      fontSize: "1rem",
                      paddingLeft: "10px",
                      border: "none",
                    }}
                  />
                </form>
              </div>
            </div>
          ))
        : ""}
    </>
  );
}

export default UserPosts;
