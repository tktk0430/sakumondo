import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { enableSoundAtom } from "atoms/Atoms";
import { Flex } from "components/Flex";
import { useAtom } from "jotai";

const Header = () => {
  const [enableSound, setEnableSound] = useAtom(enableSoundAtom);

  const onSoundButtonClick = () => {
    localStorage.setItem("enableSound", String(!enableSound));
    setEnableSound(!enableSound);
  };

  return (
    <Flex justifyContent="center" style={{ position: "relative" }}>
      <div style={{ fontSize: "1.5rem" }}>
        <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
          SAKUMONDO
        </a>
      </div>
      <div
        className="hoge"
        style={{ position: "absolute", right: 0, top: "0.4rem" }}
      >
        <FontAwesomeIcon
          icon={enableSound ? faVolumeHigh : faVolumeMute}
          style={{ cursor: "pointer" }}
          onClick={onSoundButtonClick}
        />
      </div>
    </Flex>
  );
};

export { Header };
