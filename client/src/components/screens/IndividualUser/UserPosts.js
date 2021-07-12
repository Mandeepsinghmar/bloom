import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import { useHistory } from "react-router";
import Post from "../Post/Post";

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
