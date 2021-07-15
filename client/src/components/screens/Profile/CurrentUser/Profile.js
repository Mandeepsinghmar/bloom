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
  const [toggle, setToggle] = useState(false);
  const[name,setName] = useState('')

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

  const updateProfile = ()=>{
    fetch("/updateprofile", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
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
  }

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      {state ? (
        <div className="profile-container-wrapper">
          <div className="profile-container">
            <div className="pic-content">
              <div className="file-field input-field">
                <label>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                  <span
                    onMouseEnter={() => setToggle(true)}
                    onMouseLeave={() => setToggle(false)}
                  >
                    <img
                      style={{ position: "relative" }}
                      className="user-image"
                      src={state.pic}
                    />
                    {toggle && <i className="bx bxs-camera camera"></i>}
                  </span>
                </label>
              </div>
            </div>
            <div className="profile-desc">
              <div>
              <input type='text' value={name} onChange={(e)=>setName(e.target.value) } />
                <h4>{state.name}</h4>
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
