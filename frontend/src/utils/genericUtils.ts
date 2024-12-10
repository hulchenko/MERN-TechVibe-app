export const dateUTCFormat = (date: string) => {
  return new Date(date).toLocaleString("en-US", { timeZone: "UTC" }) + " (UTC)";
};

export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  return passwordRegex.test(password);
};

export const validateEmail = (email: string) => {
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return emailRegex.test(email);
};

export const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
  return nameRegex.test(name);
};
