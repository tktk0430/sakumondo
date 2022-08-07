import ReactModal from "react-modal";

const modal_style: ReactModal.Styles = {
  overlay: {
    backgroundColor: "rgba(255,255,255,0.7)",
    transition: "opacity 200ms ease-in-out",
  },
  content: {
    margin: "15vh auto",
    width: "340px",
    maxWidth: "57vw",
    height: "14rem",
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
