import React, { useState } from "react";
import Posts from "../../Gallery/Posts";
import SavedPosts from "./SavedPosts";

function SwitchTabs({ data }) {
  const [tab, setTab] = useState("Posts");

  function setTabData() {
    if (tab === "Posts") {
      return <Posts data={data} />;
    }
    return <SavedPosts />;
  }

  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid rgba(219, 219, 219)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          fontSize: "1.2rem",
          cursor: "pointer",
          marginBottom: "20px",
          marginTop: "-20px",
        }}
        className="tab-container"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i
            className="bx bxs-grid"
            style={{
              color: tab === "Posts" ? " " : "#8E8E8E",
              fontSize: "1.5rem",
            }}
          ></i>
          <span
            style={{ color: tab === "Posts" ? " " : "#8E8E8E" }}
            onClick={(e) => setTab(e.target.innerText)}
          >
            Posts
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i
            className="bx bx-bookmark"
            style={{ color: tab === "Saved" ? " " : "#8E8E8E" }}
          ></i>
          <span
            style={{ color: tab === "Saved" ? "" : "#8E8E8E" }}
            onClick={(e) => setTab(e.target.innerText)}
          >
            Saved
          </span>
        </div>
      </div>
      {setTabData()}
    </div>
  );
}

export default SwitchTabs;
