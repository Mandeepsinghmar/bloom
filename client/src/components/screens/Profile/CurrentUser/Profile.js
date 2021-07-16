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
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

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
    if (state) {
      setName(state.name);
      setBio(state.bio);
      setWebsite(state.website);
    }
  }, [state]);

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

  const updateProfile = () => {
    fetch("/updateprofile", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
        bio,
        website,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setEdit(false);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...state,
            name: result.name,
            bio: result.bio,
            website: result.website,
          })
        );
        dispatch({
          type: "UPDATEPROFILE",
          payload: {
            name: result.name,
            bio: result.bio,
            website: result.website,
          },
        });

        M.toast({
          html: "Update profile done!!",

          classes: "#43a047 green darken-1 rounded",
        });
      });
  };

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      {state ? (
        <div className="profile-container-wrapper">
          <div className="profile-container user">
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
            <div
              className="profile-desc"
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "25px",
                    marginTop: "30px",
                  }}
                >
                  {edit ? (
                    <>
                      <div
                        style={{ marginLeft: "90px" }}
                        className="edit-profile"
                      >
                        <input
                          style={{
                            width: "300px",
                            border: "none",
                            border: "1px solid rgba(219,219,219) ",
                            outline: "none",
                            padding: "4px 10px",
                            borderRadius: "10px",
                          }}
                          placeholder="John Doe"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <p
                        style={{
                          fontSize: "2rem",
                          textTransform: "lowercase",
                          fontWeight: "300",
                        }}
                      >
                        {state.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {edit ? (
                ""
              ) : (
                <div className="follower">
                  {myPosts ? (
                    <p>
                      <strong style={{ fontSize: "1.2rem" }}>
                        {myPosts.length}
                      </strong>{" "}
                      posts
                    </p>
                  ) : (
                    <p>
                      <strong style={{ fontSize: "1.2rem" }}>0</strong> post
                    </p>
                  )}

                  <p>
                    <strong style={{ fontSize: "1.2rem" }}>
                      {state.followers.length}
                    </strong>{" "}
                    followers
                  </p>
                  <p>
                    <strong style={{ fontSize: "1.2rem" }}>
                      {state.following.length}
                    </strong>{" "}
                    following
                  </p>
                </div>
              )}

              <div>
                {/* <p>{state.bio}</p> */}
                {edit ? (
                  <>
                    <div
                      style={{
                        marginLeft: "90px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="edit-profile"
                    >
                      <textarea
                        style={{
                          width: "325px",
                          height: "90px",
                          border: "none",
                          border: "1px solid rgba(219,219,219) ",
                          outline: "none",
                          padding: "4px 10px",
                          borderRadius: "10px",
                          overflowY: "hidden",
                        }}
                        placeholder="Write your cool bio!"
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <input
                        style={{
                          width: "300px",
                          border: "none",
                          border: "1px solid rgba(219,219,219) ",
                          outline: "none",
                          padding: "4px 10px",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                        placeholder="https://example.com"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        textTransform: "lowercase",
                        width: "200px",
                        fontWeight: "400",
                      }}
                    >
                      {state.bio}
                    </p>
                    <p style={{ marginTop: "10px", fontWeight: "600" }}>
                      <a href={state.website} target="_blank" rel="noreferrer">
                        {state.website && state.website.slice(8)}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
            {edit ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginLeft: "30px",
                }}
                className="btn-container"
              >
                <p className="profile-btn save-btn" onClick={updateProfile}>
                  Save Profile
                </p>
                <p
                  className="profile-btn cancel-btn"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </p>
              </div>
            ) : (
              <div className="btn-container">
                <p
                  className="profile-btn edit-tn"
                  onClick={() => setEdit(!edit)}
                >
                  Edit Profile
                </p>
              </div>
            )}
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
