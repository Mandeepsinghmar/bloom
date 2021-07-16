import React, { useEffect, useState } from "react";
import M from "materialize-css";
import "./style.css";
import FadeLoader from "react-spinners/FadeLoader";

const EditPost = ({ postId, setModalIsOpen, setShowOptions }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/post/${postId}`, {
      signal: abortCont.signal,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCaption(data.caption);
        setImageUrl(data.imageUrl);
        setImage(data.imageUrl);
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

  useEffect(() => {
    let isMounted = true;

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "monu1");
    if (image) {
      fetch("	https://api.cloudinary.com/v1_1/monu1/image/upload", {
        method: "post",

        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            setImageUrl(data.url);
          }
        })
        .catch((err) => console.log(err));
    }
    return () => {
      isMounted = false;
    };
  }, [image]);

  const handlePost = () => {
    if (imageUrl) {
      fetch(
        "/editpost",

        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            caption,
            imageUrl,
            postId: postId,
          }),
        }
      )
        .then((res) => {
          res.json();
        })
        .then((data) => {
          window.location.reload();
          setShowOptions(false);
          M.toast({
            html: "edited post successfully",
            classes: "#43a047 green darken-1 rounded",
          });
        });
    } else {
      M.toast({
        html: "Please upload image!!",
        classes: "#e53935 red darken-1 rounded",
      });
    }
  };
  return (
    <div
      className="post-container"
      style={{ marginTop: "50px", marginBottom: "50px" }}
    >
      <div className=" input-field">
        <div className=" createpost ">
          <textarea
            type="text"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="caption"
            style={{
              border: "none",
              borderBottom: "1px solid rgba(219,219,219)",
              cursor: "revert",
              outline: "none",
            }}
          />
          <div className="file-field input-field post-image">
            <div className="btn   white image-btn">
              <span style={{ textDecoration: "none" }}>
                <i
                  className="bx bxs-camera-plus"
                  style={{ fontSize: "1.2rem", textTransform: "lowercase" }}
                >
                  upload
                </i>
              </span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            {imageUrl && (
              <div>
                <img
                  src={imageUrl}
                  alt={imageUrl}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            className="btn  waves-effect waves-light  post-btn"
            onClick={() => handlePost()}
          >
            <i className="bx bx-send">Edit</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
