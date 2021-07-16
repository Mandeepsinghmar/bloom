import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../../App";
import FadeLoader from "react-spinners/FadeLoader";
import UserPosts from "./UserPosts";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/user/${userid}`, {
      signal: abortCont.signal,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
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

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile-container-wrapper">
          <div className="profile-container individual">
            <div className="pic-content">
              <img className="image" src={userProfile.user.pic} />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div className="username-btn">
                <p
                  style={{
                    fontSize: "2rem",
                    textTransform: "lowercase",
                    fontWeight: "300",
                  }}
                >
                  {userProfile.user.name}
                </p>
                {showFollow ? (
                  <p
                    className="follow-btn f-u-btn btn"
                    style={{ zIndex: "0" }}
                    onClick={() => followUser()}
                  >
                    Follow
                  </p>
                ) : (
                  <p
                    className="unfollow-btn f-u-btn btn white"
                    style={{ zIndex: "0" }}
                    onClick={() => unfollowUser()}
                    style={{ background: "red" }}
                  >
                    Following
                  </p>
                )}
              </div>

              <div className="follower">
                <p>
                  <strong style={{ fontSize: "1.2rem" }}>
                    {userProfile.posts.length}
                  </strong>{" "}
                  posts
                </p>
                <p>
                  <strong style={{ fontSize: "1.2rem" }}>
                    {userProfile.user.followers.length}
                  </strong>{" "}
                  followers
                </p>
                <p>
                  <strong style={{ fontSize: "1.2rem" }}>
                    {userProfile.user.following.length}
                  </strong>{" "}
                  following
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "1.2rem",
                    textTransform: "lowercase",
                    width: "200px",
                    fontWeight: "400",
                  }}
                >
                  {userProfile.user.bio}
                </p>
                <p style={{ marginTop: "10px", fontWeight: "600" }}>
                  <a
                    href={userProfile.user.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {userProfile.user.website.slice(8)}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="profile-posts">
            <UserPosts />
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
    </>
  );
}

export default UserProfile;
