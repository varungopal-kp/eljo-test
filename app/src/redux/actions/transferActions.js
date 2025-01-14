import axios from "../../config/axios";
import {
  SUBMIT_TRANSFER_FAILURE,
  SUBMIT_TRANSFER_REQUEST,
  SUBMIT_TRANSFER_SUCCESS,
} from "../constants/transfer";

export const submitTransfer = (data) => async (dispatch) => {
  dispatch({ type: SUBMIT_TRANSFER_REQUEST });
  try {
    const response = await axios.post("/transfer/share-files", data);

    dispatch({
      type: SUBMIT_TRANSFER_SUCCESS,
      payload: response.data?.data || null,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: SUBMIT_TRANSFER_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

export const sendGuestTransfer = (id) => async (dispatch) => {
  dispatch({ type: SUBMIT_TRANSFER_REQUEST });
  try {
    const response = await axios.post(`/transfer/send/guest/${id}`);

    dispatch({
      type: SUBMIT_TRANSFER_SUCCESS,
      payload: response.data?.data || null,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: SUBMIT_TRANSFER_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
