// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router";

// function Post() {
//   const [myPost, setMyPost] = useState();
//   const { _id } = useParams();

//   useEffect(() => {
//     fetch("/singlepost/" + _id, {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("jwt"),
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setMyPost(data);
//       });
//   }, []);
//   return (
//     <div>
//       {myPost && (
//         <div>
//           <img src={myPost.imageUrl} />
//           <p>{myPost.caption}</p>
//         </div>
//       )}
//       <h2>hello</h2>
//     </div>
//   );
// }

// export default Post;
