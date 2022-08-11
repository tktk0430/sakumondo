import { getOriginURL } from "api/gas";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const Short = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOriginURL = async () => {
      const resp = await fetch(`${getOriginURL}?key=${key}`);
      const q = await resp.text();
      navigate({ pathname: "/", search: `?q=${q}` });
    };
    fetchOriginURL();
  }, [key, navigate]);

  return <div>読み込み中...</div>;
};
