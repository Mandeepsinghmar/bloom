import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import PostCard from "./PostCard";
import "./style.css";

const Post = ({ data, setData }) => {
  return (
    <div>
      <div className="home" style={{ marginTop: "70px" }}>
        {data ? (
          data.map((post) => (
            <PostCard
              post={post}
              data={data}
              setData={setData}

            />
            {console.log(post)}
          ))
        ) : (
          <div className="loader">
            <FadeLoader
              color="#1a91da"
              height={10}
              width={2}
              radius={1}
              margin={2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
