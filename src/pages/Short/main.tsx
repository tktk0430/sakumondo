import { getOriginURL } from "api/gas";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Short = () => {
  const navigate = useNavigate();
  const qp = useSearchParams()[0];

  useEffect(() => {
    const fetchOriginURL = async () => {
      const validKey = qp.get("key");
      const resp = await fetch(`${getOriginURL}?key=${validKey}`);
      const q = await resp.text();
      navigate({ pathname: "/", search: `?q=${q}` });
    };
    fetchOriginURL();
  }, [navigate, qp]);

  return <div>読み込み中...</div>;
};
