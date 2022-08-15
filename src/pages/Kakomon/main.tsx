import { getKakomonURL } from "api/gas";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Kakomon = () => {
  const [kakomon, setKakomon] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchOriginURL = async () => {
      const data = await axios.get(getKakomonURL).then((res) => res.data);
      setKakomon(data);
    };
    fetchOriginURL();
  }, []);

  const calenderedDates = useMemo(() => {
    const monthArray = Object.keys(kakomon).map((raw) => {
      const [year, month] = raw.split("-");
      return `${year}-${month}`;
    });
    const monthUnique = new Set(monthArray);
    const monthReverse = Array.from(monthUnique.values()).reverse();
    return monthReverse.reduce(
      (obj, x) =>
        Object.assign(obj, {
          [x]: [...Array(31).keys()].map((i) => String(i + 1).padStart(2, "0")),
        }),
      {} as { [key: string]: string[] }
    );
  }, [kakomon]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>過去問</h1>
      {Object.entries(calenderedDates).map((entry) => {
        const [yearMonth, dates] = entry;
        return (
          <div key={yearMonth}>
            <h3 style={{ marginBottom: 0 }}>{yearMonth}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 5,
              }}
            >
              {dates.map((day) => {
                const key = `${yearMonth}-${day}`;
                return (
                  <div
                    key={key}
                    style={{
                      textAlign: "center",
                      outline: "solid 0.5px",
                      height: "3.5rem",
                    }}
                  >
                    {key in kakomon ? (
                      <Link
                        to={`/?q=${kakomon[key]}`}
                        style={{ textDecoration: "none" }}
                      >
                        {Number(day)}
                      </Link>
                    ) : (
                      <span></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
