import { getOriginURL } from "api/gas";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export const Short = () => {
  const navigate = useNavigate();
  const qp = useSearchParams()[0];

  useEffect(() => {
    const fetchOriginURL = async () => {
      const validKey = qp.get("key");
      const q = await axios
        .get(`${getOriginURL}?key=${validKey}`)
        .then((res) => res.data);
      navigate({ pathname: "/", search: `?q=${q}` });
    };
    fetchOriginURL();
  }, [navigate, qp]);

  return <div>読み込み中...</div>;
};
