export const getJwt = () => {
  return localStorage.getItem("token");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const getUser = () => {
  return localStorage.getItem("user");
};
