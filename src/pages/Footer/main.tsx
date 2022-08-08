import gitIcon from "images/github.png";

const Footer = () => {
  return (
    <div className="external-links">
      <a
        href="https://github.com/tktk0430/sakumondo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={gitIcon} alt="github link" />
      </a>
    </div>
  );
};

export { Footer };
