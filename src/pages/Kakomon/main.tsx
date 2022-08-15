import { getKakomonURL } from "api/gas";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Kakomon = () => {
  const [kakomon, setKakomon] = useState("");

  useEffect(() => {
    const fetchOriginURL = async () => {
      const data = await axios.get(getKakomonURL).then((res) => res.data);
      setKakomon(data);
    };
    fetchOriginURL();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>過去問</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {Object.entries(kakomon).map((entry) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Link to={`/?q=${entry[1]}`}>{entry[0]}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
