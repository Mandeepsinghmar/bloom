import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../../App";
import FadeLoader from "react-spinners/FadeLoader";
import MyPosts from "../../Home/MyPosts";
import M from "materialize-css";
import "../style.css";

function Profile() {
  const [myPosts, setMyPosts] = useState();
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    let abortCont = new AbortController();
    // let mounted = true;

    fetch(
      "/mypost",

      {
        signal: abortCont.signal,

        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // if (mounted) {
        setMyPosts(data.mypost);
        // }
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
      // mounted = false;
    };
  }, []);

  useEffect(() => {
    let abortCont = new AbortController();

    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "monu1");

      fetch("	https://api.cloudinary.com/v1_1/monu1/image/upload", {
        signal: abortCont.signal,
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              M.toast({
                html: "Update image done!!",

                classes: "blue",
              });
            });
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
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      {state ? (
        <div className="profile-container-wrapper">
          <div className="profile-container">
            <div className="pic-content">
              <img src={state.pic} />
              <div className="file-field input-field">
                <div className="btn   white photo-btn  ">
                  <span style={{ textDecoration: "none" }}>Update Pic</span>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
            <div className="profile-desc">
              <div>
                <h4>{state.name}</h4>
                <h5>{state.email}</h5>
              </div>

              <div className="follower">
                {myPosts ? (
                  <p>
                    <strong>{myPosts.length}</strong> posts
                  </p>
                ) : (
                  <p>
                    <strong>0</strong> post
                  </p>
                )}

                <p>
                  <strong>{state.followers.length}</strong> followers
                </p>
                <p>
                  <strong>{state.following.length}</strong> following
                </p>
              </div>
            </div>
          </div>
          <div className="profile-posts">
            <MyPosts />
          </div>
        </div>
      ) : (
        <div className="loader">
          <FadeLoader
            color="#1a91da"
            height={10}
            width={2}
            radius={1}
            margin={2}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;
