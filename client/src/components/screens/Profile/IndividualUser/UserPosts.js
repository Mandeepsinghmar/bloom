import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../../App";
import Post from "../../Post/Post";

function UserPosts() {
  const { state } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState();
  const { userid } = useParams();

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/user/${userid}`, {
      signal: abortCont.signal,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPosts(data.posts);
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
          if (post._id === result._id) {
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
          if (post._id === result._id) {
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
            if (post._id === result._id) {
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
      <Post
        data={myPosts}
        likePost={likePost}
        unLikePost={unLikePost}
        makeComment={makeComment}
        deletePost={deletePost}
        state={state}
      />
    </>
  );
}

export default UserPosts;
