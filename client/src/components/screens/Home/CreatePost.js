import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router";
import "./style.css";
import FadeLoader from "react-spinners/FadeLoader";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const abortCont = new AbortController();
    if (image) {
      setLoading(true);
    }

    if (imageUrl) {
      setLoading(false);
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "monu1");
    if (image) {
      fetch("	https://api.cloudinary.com/v1_1/monu1/image/upload", {
        signal: abortCont.signal,
        method: "post",

        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          setImageUrl(data.url);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      abortCont.abort();
    };
  }, [image]);

  const handlePost = () => {
    if (imageUrl) {
      fetch(
        "/createpost",

        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            caption,
            imageUrl,
          }),
        }
      )
        .then((res) => {
          res.json();
        })
        .then((data) => {
          M.toast({
            html: "Created post successfully",
            classes: "#43a047 green darken-1 rounded",
          });
          window.location.reload();
        });
    } else {
      M.toast({
        html: "Please upload image!!",
        classes: "#e53935 red darken-1 rounded",
      });
    }
  };
  return (
    <div className="post-container">
      <div className=" input-field">
        <div className=" createpost ">
          <textarea
            type="text"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="caption"
            style={{
              border: "1px solid rgba(219,219,219)",
              cursor: "revert",
              outline: "none",
              borderRadius: "10px",
              maxWidth: "300px",
              padding: "10px ",
              minHeight: "60px",
              maxHeight: "200px",
              fontSize: "1.2rem",
            }}
          />
          <div className="file-field input-field post-image">
            <div className="btn   white image-btn">
              <span style={{ textDecoration: "none" }}>
                <p style={{ fontWeight: "600", fontSize: "1.2rem" }}>📷Image</p>
              </span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>{" "}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "20px",
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
            {imageUrl && (
              <div>
                <img
                  src={imageUrl}
                  alt={imageUrl}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "4px",
                    position: "relative",
                    border: "1px solid rgba(219, 219, 219)",
                  }}
                />
                <p
                  style={{
                    position: "absolute",
                    marginLeft: "87px",
                    marginTop: "-112px",
                    cursor: "pointer",
                  }}
                  onClick={() => setImageUrl(null)}
                >
                  ❌
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            className="btn  waves-effect waves-light  post-btn"
            style={{ zIndex: "0" }}
            onClick={() => handlePost()}
          >
            <p>Post🚀</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
