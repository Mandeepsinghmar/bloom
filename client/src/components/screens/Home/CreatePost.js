import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router";
import "./style.css";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const history = useHistory();

  // useEffect(() => {
  //   const abortCont = new AbortController();

  //   return () => {
  //     abortCont.abort();
  //   };
  // }, [imageUrl]);

  const handlePost = () => {
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
          setImageUrl(data.url);
        })
        .catch((err) => console.log(err));
    }

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
            classes: "blue",
          });
          history.push("/explore");
        });
    } else {
      M.toast({
        html: "Please upload image!!",

        classes: "toast",
      });
    }
  };
  return (
    <div className="post-container">
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
                <i class="bx bxs-camera-plus"></i>
              </span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper" style={{ width: "100%" }}>
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
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn  waves-effect waves-light  post-btn"
            onClick={() => handlePost()}
          >
            <i className="bx bx-send"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
