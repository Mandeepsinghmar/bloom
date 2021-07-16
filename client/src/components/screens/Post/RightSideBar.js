import React, { useState } from "react";
import M from "materialize-css";
import Modal from "react-modal";
import EditPost from "./EditPost";

const RightSideBar = ({ postid, setData, data }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  Modal.setAppElement("#root");

  const deletePost = () => {
    const result = window.confirm("Are you sure you want to delete this post?");
    if (result) {
      fetch("/deletepost/" + postid, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          M.toast({
            html: "Deleted post successfully!",
            classes: "#43a047 green darken-1 rounded",
          });
          const newData = data.filter((post) => {
            return post._id !== result._id;
          });
          setData(newData);
        });
    }
  };
  return (
    <div>
      <div className="post-menu-container">
        {" "}
        <i
          className="bx bx-dots-horizontal-rounded post-menu-icon"
          onClick={() => setShowOptions(!showOptions)}
        ></i>
        {showOptions && (
          <>
            <div className="post-menu-items">
              <p onClick={() => deletePost()}>Delete</p>
              <div>
                <p onClick={() => setModalIsOpen(true)}>Edit</p>
              </div>
            </div>
            <div>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
              >
                <EditPost
                  postId={postid}
                  setModalIsOpen={setModalIsOpen}
                  setShowOptions={setShowOptions}
                />
              </Modal>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
