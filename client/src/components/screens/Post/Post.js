import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import PostCard from "./PostCard";
import "./style.css";

const Post = ({ data, setData }) => {
  return (
    <div>
      <div className="home">
        {data ? (
          data.map((post) => (
            <div>
              <PostCard post={post} data={data} setData={setData} />
            </div>
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
