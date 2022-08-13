import CryptoJS from "crypto-js";

const SECRET_KEY = "sakumondo";

export const encode = (data: any): string => {
  const path = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return path;
};

export const decode = (encodePath: string): string => {
  const decodePath = decodeURIComponent(encodePath);
  const bytes = CryptoJS.AES.decrypt(decodePath, SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return bytes;
};
