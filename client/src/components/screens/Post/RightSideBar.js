import React, { useContext, useState } from "react";
import M from "materialize-css";
import Modal from "react-modal";
import EditPost from "./EditPost";
import { UserContext } from "../../../App";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "10px",
    minWidth: "400px",
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
                    <p
                      onClick={() => {
                        setModalIsOpen(false);
                        setShowOptions(false);
                      }}
                      style={{
                        border: "1px solid red",
                        padding: "4px 8px ",
                        width: "50px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        color: "#2e313c",
                        fontWeight: "500",
                      }}
                    >
                      Close
                    </p>

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
