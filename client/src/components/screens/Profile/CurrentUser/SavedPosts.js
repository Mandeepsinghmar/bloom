import React, { useState, useEffect } from "react";
import Posts from "../../Gallery/Posts";

function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState();

  useEffect(() => {
    let abortCont = new AbortController();

    fetch(
      "/getbookmarkposts",

      {
        signal: abortCont.signal,

        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setSavedPosts(data);
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
    <div>
      <Posts data={savedPosts} />
    </div>
  );
}

export default SavedPosts;
