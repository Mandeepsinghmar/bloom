import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import FadeLoader from "react-spinners/FadeLoader";
import M from "materialize-css";
import { useHistory } from "react-router";
import MyPosts from "../screens/MyPosts";

function Home() {
  const [data, setData] = useState();

  const { state, dispatch } = useContext(UserContext);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const history = useHistory();

  useEffect(() => {
    const abortCont = new AbortController();
    if (imageUrl) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          caption,
          imageUrl,
        }),
      })
        .then((res) => {
          res.json();
        })
        .then((data) => {
          M.toast({
            html: "Created post successfully",
            classes: "blue",
          });
          history.push("/explore");
        });
    }
    return () => {
      abortCont.abort();
    };
  }, [imageUrl]);

  const handlePost = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "monu1");

    fetch("	https://api.cloudinary.com/v1_1/monu1/image/upload", {
      method: "post",

      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url);
        setImageUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const abortCont = new AbortController();
    fetch("/getsubspost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
    return () => {
      abortCont.abort();
      console.log("unsubscribed compon");
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
          const newData = data.map((post) => {
            if (post._id == result._id) {
              return result;
            } else {
              return post;
            }
          });
          console.log(result);
          setData(newData);
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
          const newData = data.filter((post) => {
            return post._id !== result._id;
          });
          setData(newData);
        });
    }
  };

  return (
    <div
      className="home"
      style={{
        marginTop: "80px",
      }}
    >
      <div className="post-container input-field">
        <div
          className=" createpost "
          style={{
            width: "100%",

            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <input
            type="text"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              backgroundColor: "white",
              fontSize: "1rem",
              borderRadius: "10px",

              cursor: "pointer",
              paddingLeft: "10px",
              border: "1px solid rgba(219,219,219)",
            }}
          />
          <div
            className="file-field input-field"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // gap: "20px",
              width: "100%",
            }}
          >
            <div
              className="btn   white image-btn"
              style={{
                borderRadius: "20px",
                width: "150px",
                border: "1px solid rgba(219,219,219)",
              }}
            >
              <span style={{ textDecoration: "none" }}>Image📸</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper" style={{ width: "100%" }}>
              <input
                className="file-path validate"
                // placeholder="File-path will shown here"
                type="text"
                style={{
                  fontSize: "0.5rem",
                  paddingLeft: "10px",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  borderBottom: "1px solid rgba(219,219,219)",
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn  waves-effect waves-light  post-btn"
            style={{
              fontSize: "18px",
              borderRadius: "20px",
              display: "flex",
            }}
            onClick={() => handlePost()}
          >
            Post <span style={{ fontSize: "0.8rem" }}> 🚀</span>
          </button>
        </div>
      </div>

      <MyPosts />
      {data ? (
        data.map((post) => (
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
                      fontSize: "1.1rem",
                      float: "right",
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
                  placeholder=" Add a comment.."
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
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            margin: "100px auto",
          }}
        >
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
}

export default Home;
