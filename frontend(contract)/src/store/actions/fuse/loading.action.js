export const LOADING_SHOW = "LOADING_SHOW";
export const LOADING_CLOSE = "LOADING_CLOSE";

export function showRoading() {
  return {
    type: LOADING_SHOW,
  };
}
export function closeRoading() {
  return { type: LOADING_CLOSE };
}
