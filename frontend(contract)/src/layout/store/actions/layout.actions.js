export const SET_AVATER = "SET_AVATER";

export const setAvatar = (avatar) =>async (dispatch) => {
  
  dispatch({
    type: SET_AVATER,
    payload: avatar
  })
}