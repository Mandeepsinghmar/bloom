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
        console.log(data);
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
        console.log(data);
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
          <div className="profile-container">
            <div className="pic-content">
              <img src={userProfile.user.pic} />
            </div>
            <div>
              <div className="username-btn">
                <h4>{userProfile.user.name}</h4>
                {showFollow ? (
                  <button
                    className="follow-btn f-u-btn btn waves-effect waves-light white"
                    onClick={() => followUser()}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="unfollow-btn f-u-btn btn waves-effect waves-light white"
                    onClick={() => unfollowUser()}
                    style={{ background: "red" }}
                  >
                    Following
                  </button>
                )}
              </div>

              <h5>{userProfile.user.email}</h5>
              <div className="follower">
                <p>
                  <strong>{userProfile.posts.length}</strong> posts
                </p>
                <p>
                  <strong>{userProfile.user.followers.length}</strong> followers
                </p>
                <p>
                  <strong>{userProfile.user.following.length}</strong> following
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
