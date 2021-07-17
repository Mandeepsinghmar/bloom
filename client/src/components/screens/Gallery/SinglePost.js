import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Post from "../Post/Post";
import PostCard from "../Post/PostCard";

const SinglePost = () => {
  const { postid } = useParams();
  let [data, setData] = useState();

  const history = useHistory();

  if (!Array.isArray(data)) {
    data = [data];
  }

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/post/${postid}`, {
      signal: abortCont.signal,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(err.message);
        }
      });
    return () => {
      abortCont.abort();
    };
  }, []);

  return (
    <div style={{ marginTop: "100px" }}>
      <p
        onClick={() => history.goBack()}
        style={{
          marginLeft: "100px",
          marginBottom: "-50px",
          backgroundColor: "blue",
          color: "white",
          padding: "6px 12px",
          width: "100px",
          cursor: "pointer",
        }}
        className="go-back"
      >
        Go Back
      </p>
      <div style={{ marginTop: "80px" }}>
        <Post setData={setData} data={data} />
      </div>
    </div>
  );
};

export default SinglePost;
