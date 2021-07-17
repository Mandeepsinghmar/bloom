import React, { useContext, useState } from "react";
import M from "materialize-css";
import Modal from "react-modal";
import EditPost from "./EditPost";
import { UserContext } from "../../../App";

const customStyles = {
  overlay: {
    position: "fixed",
    top: "0px",

    bottom: "0px",
    left: "0px",
    right: "0px",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolue",
    border: "1px solid #ccc",
    background: "#e3e3e3",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "30px 20px",

    top: "20%",
    bottom: "100px",
    left: "auto",
    right: "auto",
  },
};

Modal.setAppElement("#root");

const RightSideBar = ({ postedBy, postid, setData, data }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { state } = useContext(UserContext);

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
        {state._id === postedBy ? (
          <>
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
                    onRequestClose={() => {
                      setModalIsOpen(false);
                      setShowOptions(false);
                    }}
                    style={customStyles}
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RightSideBar;
