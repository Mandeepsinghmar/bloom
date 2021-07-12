import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import FadeLoader from "react-spinners/FadeLoader";
import Post from "../Post/Post";

function Explore() {
  const [data, setData] = useState();

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const abortCont = new AbortController();
    const signal = abortCont.signal;
    fetch(
      "/allpost",

      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      { signal }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
    <>
      <Post data={data} state={state} setData={setData} />
    </>
  );
}

export default Explore;
