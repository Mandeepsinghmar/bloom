import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import FadeLoader from "react-spinners/FadeLoader";
import BeatLoader from "react-spinners/BeatLoader";

function Profile() {
  const [myPosts, setMyPosts] = useState();
  const [image, setImage] = useState("");

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const abortCont = new AbortController();
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMyPosts(data.mypost);
      });
    return () => {
      abortCont.abort();
    };
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "monu1");

      fetch("	https://api.cloudinary.com/v1_1/monu1/image/upload", {
        method: "post",

        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, pic: data.url })
          );
          dispatch({ type: "UPDATEPIC", payload: data.url });
          console.log(data);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      {state ? (
        <div style={{ maxWidth: "800px", margin: "auto", marginTop: "70px" }}>
          <div className="profile-container">
            <div
              className="pic-content"
              style={{
                display: "flex",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              <img
                src={state.pic}
                style={{ width: "120px", height: "120px", borderRadius: "50%" }}
              />

              <div className="file-field input-field">
                <div
                  className="btn   white "
                  style={{
                    fontSize: "1rem",
                    color: "blue",
                    borderRadius: "30px",
                    textTransform: "none",
                    border: "1px solid rgba(219,219,219)",
                  }}
                >
                  <span style={{ textDecoration: "none" }}>Update Pic</span>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                  {/* <div className="file-path-wrapper">
                    <input
                      className="file-path validate"
                      type="text"
                      style={{
                        fontSize: "1rem",
                        borderRadius: "40px",
                        border: "none",
                      }}
                    />
                  </div> */}
                </div>
              </div>
            </div>
            <div>
              <div
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   gap: "4rem",
              // }}
              >
                <h4>{state.name}</h4>
                <h4 style={{ fontSize: "1.4rem", fontWeight: "400" }}>
                  {state.email}
                </h4>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                }}
              >
                <p>{myPosts ? <strong>{myPosts.length}</strong> : "0"} posts</p>
                <p>
                  <strong>{state.followers.length}</strong> followers
                </p>
                <p>
                  <strong>{state.following.length}</strong> following
                </p>
              </div>
            </div>
          </div>

          <div className="gallery">
            {myPosts ? (
              myPosts.map((myPost) => (
                <img className="item" src={myPost.imageUrl} />
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  margin: "250px auto",
                }}
              >
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
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            margin: "250px auto",
          }}
        >
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
