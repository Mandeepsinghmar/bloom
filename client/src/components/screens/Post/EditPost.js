import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router";
import "./style.css";

const EditPost = ({ postId, setModalIsOpen, setShowOptions }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const history = useHistory();

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
          console.log(data.url);
          setImageUrl(data.url);
        })
        .catch((err) => console.log(err));
    }
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
    <div className="post-container" style={{ marginTop: "100px" }}>
      <div className=" input-field">
        <div className=" createpost ">
          <input
            type="text"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="caption"
            style={{
              borderBottom: "1px solid rgba(219,219,219)",
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
            {/* <div className="file-path-wrapper" style={{ width: "100%" }}>
              <input
                className="file-path validate"
                type="text"
                style={{
                  paddingLeft: "10px",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  borderBottom: "1px solid rgba(219,219,219)",
                }}
              />
            </div> */}
          </div>
        </div>

        <div>
          <button
            className="btn  waves-effect waves-light  post-btn"
            onClick={() => handlePost()}
          >
            <i className="bx bx-send">
              <p>Edit</p>
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
