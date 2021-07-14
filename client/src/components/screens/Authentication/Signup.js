import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);

  useEffect(() => {
    if (imageUrl) {
      uploadFields();
    }
  }, [imageUrl]);

  const uploadPic = () => {
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
        setImageUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: imageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          )
        ) {
          M.toast({ html: "Invalid email", classes: "#f44336 red" });
          return;
        } else if (
          !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
            password
          )
        ) {
          M.toast({
            html: "Password should be minimum 8 characters, at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character.",

            classes: "password-length",
          });
          return;
        } else {
          M.toast({ html: data.message, classes: " dark blue" });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div>
      <div className="card-container auth">
        <div className=" card card-content">
          <h2>Bloom</h2>
          <input
            className="input-style"
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-style"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="file-field input-field"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            <div
              className="btn   white photo-btn"
              style={{
                borderRadius: "20px",
                width: "150px",
                display: "flex",

                border: "1px solid rgba(219,219,219)",
              }}
            >
              <span style={{ textDecoration: "none" }}>Photo📸</span>
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

          <button
            className="btn waves-effect waves-light  login-btn"
            onClick={() => PostData()}
          >
            Signup
          </button>
          <p>
            <Link to="/login">Already have an account?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
