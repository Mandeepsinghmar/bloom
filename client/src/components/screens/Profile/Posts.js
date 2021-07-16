import React from "react";
import FadeLoader from "react-spinners/FadeLoader";

const Posts = ({ myPosts }) => {
  return (
    <div className="posts-container-wrapper">
      {myPosts ? (
        myPosts.map((post) => (
          <div key={post._id}>
            <div className="posts-container">
              <img src={post.imageUrl} alt="" className="image-url" />
            </div>
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
  );
};

export default Posts;
