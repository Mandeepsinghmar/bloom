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
      {data ? (
        <Post data={data} setData={setData} state={state} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "6px 12px",
            fontSize: "1.4rem",
            marginTop: "10px",
          }}
        >
          <p>You are not following anyone!</p>
        </div>
      )}

      <Suspense fallback={<div>Loading</div>}>
        <MyPosts />
      </Suspense>
    </div>
  );
}

export default Home;
