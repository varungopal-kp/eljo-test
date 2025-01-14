import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT,
  VERIFY_TOKEN,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
} from "../constants/auth";
import {
  SUBMIT_TRANSFER_GUEST_FAILURE,
  SUBMIT_TRANSFER_GUEST_REQUEST,
  SUBMIT_TRANSFER_GUEST_SUCCESS,
} from "../constants/transfer";

const API_URL = process.env.REACT_APP_API_URL;
export const signin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // You would typically make an API call here
    const response = await axios.post(API_URL + "/auth/signin", {
      email,
      password,
    });

    // On success, dispatch LOGIN_SUCCESS with the token and user data
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data?.data || null,
    });
    // Save the token to localStorage (or session storage)
    if (response.data.data) {
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("rtoken", response.data.data.refreshToken);
    }
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    const errMessage = error.response?.data?.message || "Login failed";
    dispatch({
      type: LOGIN_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const signup = (data) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP_REQUEST });

    // You would typically make an API call here
    const response = await axios.post(API_URL + "/auth/signup", {
      ...data,
    });

    // On success, dispatch SIGNUP_SUCCESS with the token and user data
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: response.data?.data || null,
    });
    // Save the token to localStorage (or session storage)

    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Signup failed";
    dispatch({
      type: SIGNUP_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const verifyGoogleToken = (data) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const response = await axios.post(API_URL + "/auth/verify-googleToken", {
      ...data,
    });

    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data?.data || null,
    });
    if (response.data.data) {
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("rtoken", response.data.data.refreshToken);
    }
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Signup failed";
    dispatch({
      type: LOGIN_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const verifyToken = (data) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_TOKEN });

    const response = await axios.post(API_URL + "/auth/verify-token", {
      ...data,
    });

    dispatch({
      type: VERIFY_TOKEN_SUCCESS,
      payload: response.data?.data || null,
    });

    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Signup failed";
    dispatch({
      type: VERIFY_TOKEN_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const verifyOtp = (data) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const response = await axios.post(API_URL + "/auth/otp-verify", data);

    dispatch({
      type: VERIFY_OTP_SUCCESS,
      payload: response.data?.data || null,
    });

    const resData = response.data.data || null;
    if (resData) {
      localStorage.setItem("token", resData?.token?.accessToken);
      localStorage.setItem("rtoken", resData?.token?.refreshToken);
    }
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

export const submitTransferGuest = (data) => async (dispatch) => {
  dispatch({ type: SUBMIT_TRANSFER_GUEST_REQUEST });
  try {
    const response = await axios.post(API_URL + "/transfer/share-guest", data);

    dispatch({
      type: SUBMIT_TRANSFER_GUEST_SUCCESS,
      payload: response.data?.data || null,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: SUBMIT_TRANSFER_GUEST_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

// Logout action
export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("rtoken");
    dispatch({ type: LOGOUT });
  };
};
