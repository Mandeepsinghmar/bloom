import React, { useEffect, useState } from "react";
import Posts from "../Gallery/Posts";
import Post from "../Post/Post";

function Explore() {
  const [data, setData] = useState();

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(
      "/allpost",

      {
        signal: abortCont.signal,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
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
      <Posts data={data} setData={setData} />
    </div>
  );
}

export default Explore;
