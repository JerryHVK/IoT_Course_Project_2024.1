import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const LogoutConfirm = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Logout"
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          maxWidth: "300px",
          height:"100px",
          margin: "auto",
          padding: "20px",
          borderRadius: "8px",
        },
      }}
    >
      <h2 style={{textAlign: "center"}}>Are you sure?</h2>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={onCancel} style={{ marginRight: "10px" }}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{ backgroundColor: "red", color: "white" }}
        >   
          Logout
        </button>
      </div>
    </Modal>
  );
};

export default LogoutConfirm;
