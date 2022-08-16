import { getKakomonURL } from "api/gas";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getResult, ResultType } from "utils/localStorage";
import { Flex } from "components/Flex";

export const Kakomon = () => {
  const [kakomon, setKakomon] = useState<{ [key: string]: string }>({});

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

  if (Object.keys(kakomon).length === 0) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <Flex justifyContent="center" style={{ position: "relative" }}>
        <h1 style={{ textAlign: "center" }}>過去問</h1>
        <Link to="/" style={{ position: "absolute", right: 0, bottom: 25 }}>
          戻る
        </Link>
      </Flex>
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
                  <DatePanel
                    key={key}
                    isExist={key in kakomon}
                    q={kakomon[key]}
                    day={Number(day)}
                    result={getResult(decodeURIComponent(kakomon[key]))}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

type DatePanleProps = {
  isExist: boolean;
  q: string;
  day: number;
  result: ResultType;
};

const DatePanel = (props: DatePanleProps) => {
  const { isExist, q, day, result } = props;
  const isSolving = result.clickedIndices.length > 0 && !result.isCorrect;

  return (
    <>
      {isExist ? (
        <Link
          to={`/?q=${q}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div
            className="date-panel"
            style={{
              backgroundColor: result.isCorrect ? "#5eec62" : "white",
            }}
          >
            {day}
            {isSolving && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 2,
                  fontSize: 0.5,
                }}
                className="red"
              >
                ●
              </div>
            )}
          </div>
        </Link>
      ) : (
        <div className="date-panel" style={{ backgroundColor: "#F2F2F2" }} />
      )}
    </>
  );
};
