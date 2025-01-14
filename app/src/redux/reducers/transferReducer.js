import {
  SUBMIT_TRANSFER_FAILURE,
  SUBMIT_TRANSFER_GUEST_FAILURE,
  SUBMIT_TRANSFER_GUEST_REQUEST,
  SUBMIT_TRANSFER_GUEST_SUCCESS,
  SUBMIT_TRANSFER_REQUEST,
  SUBMIT_TRANSFER_SUCCESS,
} from "../constants/transfer";

const initialState = {
  loading: false,
  error: null,
  shared: null,
};

const transferReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_TRANSFER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        shared: null,
      };
    case SUBMIT_TRANSFER_SUCCESS:
      return {
        ...state,
        loading: false,
        shared: action.payload,
        error: null,
      };
    case SUBMIT_TRANSFER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case SUBMIT_TRANSFER_GUEST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
      case SUBMIT_TRANSFER_GUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
      case SUBMIT_TRANSFER_GUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state;
  }
};
export default transferReducer;
