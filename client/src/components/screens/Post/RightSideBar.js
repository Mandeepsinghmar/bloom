import React, { useState } from "react";

const RightSideBar = ({ postid, setData, data }) => {
  const [showOptions, setShowOptions] = useState(false);
  const deletePost = () => {
    const result = window.confirm("Are you sure you want to delete this post?");
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
          const newData = data.filter((post) => {
            return post._id !== result._id;
          });
          setData(newData);
        });
    }
  };
  return (
    <div>
      <div className="post-menu-container">
        {" "}
        <i
          className="bx bx-dots-horizontal-rounded post-menu-icon"
          onClick={() => setShowOptions(!showOptions)}
        ></i>
        {showOptions && (
          <div className="post-menu-items">
            <p onClick={() => deletePost()}>Delete</p>
          </div>
        )}
        {/* {post.postedBy._id == state._id && (
          <i
            className="material-icons"
            style={{ cursor: "pointer", float: "right" }}
            onClick={() => deletePost(post._id)}
          >
            delete
          </i>
        )} */}
      </div>
    </div>
  );
};

export default RightSideBar;
