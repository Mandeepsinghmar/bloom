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
      <div style={{ borderBottom: "1px solid black" }}>
        <button onClick={(e) => setTab(e.target.innerText)}>Posts</button>
        <button onClick={(e) => setTab(e.target.innerText)}>Saved</button>
      </div>
      {setTabData()}
    </div>
  );
}

export default SwitchTabs;
