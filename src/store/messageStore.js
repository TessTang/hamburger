import { createContext } from "react";

export const MessageContext = createContext({});

export const initState = {
  type: "",
  title: "",
  text: "",
};

//Reducer
export const messageReducer = (state, action) => {
  switch (action.type) {
    case "POST_MESSAGE":
      return {
        ...action.payload,
      };
    case "CLEAR_MESSAGE":
      return {
        ...initState,
      };
    default:
      return state;
  }
};

//success
export function handleSuccessMessage(dispatch, res) {
  dispatch({
    type: "POST_MESSAGE",
    payload: {
      type: "success",
      title: "儲存成功",
      text: res,
    },
  });
  setTimeout(() => {
    dispatch({
      type: "CLEAR_MESSAGE",
    });
  }, 3000);
}

//error
export function handleErrorMessage(dispatch, error) {
  dispatch({
    type: "POST_MESSAGE",
    payload: {
      type: "danger",
      title: "儲存失敗",
      text: Array.isArray(error?.response?.data?.message)
        ? error?.response?.data?.message.join("、")
        : error?.response?.data?.message,
    },
  });
  setTimeout(() => {
    dispatch({
      type: "CLEAR_MESSAGE",
    });
  }, 3000);
}
