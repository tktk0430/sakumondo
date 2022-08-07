import CryptoJS from "crypto-js";

const SECRET_KEY = "sakumondo";

export const encode = (data: any): string => {
  const json = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  const path = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(json));
  return path;
};

export const decode = (encodePath: string): string => {
  const decodePath = decodeURIComponent(encodePath);
  const data = CryptoJS.enc.Base64.parse(decodePath.toString()).toString(
    CryptoJS.enc.Latin1
  );
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return bytes;
};
