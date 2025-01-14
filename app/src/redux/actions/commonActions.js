import axios from "../../config/axios";
import {
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../constants/common";

export const getProfile = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE });

  try {
    const response = await axios.get("/users/profile");

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: response.data?.data || null,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: GET_PROFILE_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE });
    const response = await axios.put("/users/profile", data);
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: response.data?.data || null,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
