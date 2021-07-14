import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import { UserContext } from "../../../App";
import CreatePost from "./CreatePost";
import Post from "../Post/Post";

const MyPosts = lazy(() => import("./MyPosts"));

function Home() {
  const [data, setData] = useState();
  const { state } = useContext(UserContext);

  useEffect(() => {
    const abortCont = new AbortController();
    fetch("/getsubspost", {
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
    <div
      className="home"
      style={{
        marginTop: "80px",
      }}
    >
      <CreatePost />

      <Post data={data} setData={setData} state={state} />
      <Suspense fallback={<div>Loading</div>}>
        <MyPosts />
      </Suspense>
    </div>
  );
}

export default Home;
