import ReactModal from "react-modal";

const modal_style: ReactModal.Styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    transition: "opacity 200ms ease-in-out",
  },
  content: {
    margin: "10% auto",
    position: "absolute",
    width: "100vw",
    maxWidth: "400px",
    height: "15rem",
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0rem 0.1rem 1rem gray",
  },
};

const Modal = (props: ReactModal.Props) => {
  const { isOpen, children } = props;
  return (
    <ReactModal isOpen={isOpen} style={modal_style}>
      {children}
    </ReactModal>
  );
};

export { Modal };
