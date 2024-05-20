export const isset = (params: any) => {
  if (typeof params == "undefined" || params == null || params == "") {
    return false;
  }

  return true;
};
