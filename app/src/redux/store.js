import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "../redux/reducers/authReducer";
import commonReducer from "../redux/reducers/commonReducer";
import transferReducer from "../redux/reducers/transferReducer";

// Combine multiple reducers (if needed) into a rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
  transfer: transferReducer,
});

// Check if Redux DevTools Extension is installed and use it if available
const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// Create Redux store with middleware and enhancers
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
