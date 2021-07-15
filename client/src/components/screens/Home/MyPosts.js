import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import { UserContext } from "../../../App";
const Post = lazy(() => import("../Post/Post"));

function MyPosts() {
  const { state } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState();

  useEffect(() => {
    const abortCont = new AbortController();
    fetch("/mypost", {
      signal: abortCont.signal,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPosts(data.mypost);
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
  }, [state]);

  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <Post data={myPosts} setData={setMyPosts} state={state} />
      </Suspense>
    </>
  );
}

export default MyPosts;
