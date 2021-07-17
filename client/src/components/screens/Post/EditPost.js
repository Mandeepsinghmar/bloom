import React, { useEffect, useState } from "react";
import M from "materialize-css";
import "./style.css";
import FadeLoader from "react-spinners/FadeLoader";

const EditPost = ({ postId, setShowOptions, setModalIsOpen }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    if (imageUrl) {
      setLoading(false);
    }
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
            setLoading(false);

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
          window.location.reload();
          setShowOptions(false);
        });
    } else {
      M.toast({
        html: "Please upload image!!",
        classes: "#e53935 red darken-1 rounded",
      });
    }
  };
  return (
    <>
      <h4 style={{ textAlign: "center" }}>Edit Post!</h4>
      <div
        className="post-container"
        style={{
          marginTop: "20px",
          marginBottom: "50px",
          backgroundColor: "#e3e3e3",
          padding: "30px 50px",
        }}
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
                  <p style={{ fontWeight: "600", fontSize: "1.2rem" }}>
                    📷Image
                  </p>
                </span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
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
            <div style={{ display: "flex", gap: "20px" }}>
              <button
                className="btn  waves-effect waves-light  post-btn"
                onClick={() => handlePost()}
              >
                <p>Save🚀</p>
              </button>
              <button
                style={{
                  padding: "4px 8px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  borderRadius: "15px",
                  border: "1px solid yellow",
                  outline: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalIsOpen(false);
                  setShowOptions(false);
                }}
              >
                <p>Cancel</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPost;
