import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import { UserContext } from "../../../App";
const Post = lazy(() => import("../Post/Post"));

function MyPosts() {
  const { state } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState();

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(
      "/mypost",
      // { signal: abortCont.signal },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMyPosts(data.mypost);
      });
    return () => {
      abortCont.abort();
    };
  }, []);

  return (
    <>
      <Suspense>
        <Post data={myPosts} setData={setMyPosts} state={state} />
      </Suspense>
    </>
  );
}

export default MyPosts;
