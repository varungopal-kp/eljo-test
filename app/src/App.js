import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/index";
import HomePage from "./containers/HomePage/index";
import SigninPage from "./containers/AuthPage/SigninPage";
import SignupPage from "./containers/AuthPage/SignupPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import Loader from "./components/Loader";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>{" "}
      <Loader />
    </Provider>
  );
}

export default App;
