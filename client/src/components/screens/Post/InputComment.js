import React, { useState } from "react";

const InputComment = ({ data, setData, postId }) => {
  const [comment, setComment] = useState("");
  const makeComment = (e) => {
    e.preventDefault();

    if (comment !== "") {
      fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text: comment,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((post) => {
            if (post._id === result._id) {
              return result;
            } else {
              return post;
            }
          });

          setData(newData);
        })
        .catch((err) => console.log(err));
    }
    setComment("");
  };
  return (
    <div>
      <form
        className="comment-form"
        onSubmit={makeComment}
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <input
          className="comment-input"
          type="text"
          placeholder="Add a comment.."
          style={{
            fontSize: "0.9rem",
            paddingLeft: "10px",
            border: "none",
          }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button disabled={!comment} type="submit">
          <i className="bx bx-send"></i>
        </button>
      </form>
    </div>
  );
};

export default InputComment;
