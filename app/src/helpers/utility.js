export const getFullUrl = (url) => {
  if (url) {
    return `${process.env.REACT_APP_API_URL}/files/${url}`;
  } else {
    return process.env.REACT_APP_API_URL;
  }
};
