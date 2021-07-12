import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const history = useHistory();

  useEffect(() => {
    const abortCont = new AbortController();

    if (imageUrl) {
      fetch(
        "/createpost",
        { signal: abortCont.signal },
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
            classes: "blue",
          });
          history.push("/explore");
        });
    }
    return () => {
      abortCont.abort();
    };
  }, [imageUrl]);

  const handlePost = () => {
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
        console.log(data.url);
        setImageUrl(data.url);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="post-container input-field">
        <div
          className=" createpost "
          style={{
            width: "100%",

            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <input
            type="text"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              backgroundColor: "white",
              fontSize: "1rem",
              borderRadius: "20px",

              cursor: "pointer",
              paddingLeft: "10px",
              border: "1px solid rgba(219,219,219)",
            }}
          />
          <div
            className="file-field input-field"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // gap: "20px",
              width: "100%",
            }}
          >
            <div
              className="btn   white image-btn"
              style={{
                borderRadius: "20px",
                width: "150px",
                border: "1px solid rgba(219,219,219)",
              }}
            >
              <span style={{ textDecoration: "none" }}>Image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper" style={{ width: "100%" }}>
              <input
                className="file-path validate"
                // placeholder="File-path will shown here"
                type="text"
                style={{
                  fontSize: "0.5rem",
                  paddingLeft: "10px",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  borderBottom: "1px solid rgba(219,219,219)",
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn  waves-effect waves-light  post-btn"
            style={{
              fontSize: "18px",
              borderRadius: "20px",
            }}
            onClick={() => handlePost()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
