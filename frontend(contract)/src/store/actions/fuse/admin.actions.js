export const IS_ADMIN = "IS_ADMIN";
export function isAdmin() {
  const admin = sessionStorage.getItem("isAdmin");
  return {
    type: IS_ADMIN,
    payload: admin,
  };
}
