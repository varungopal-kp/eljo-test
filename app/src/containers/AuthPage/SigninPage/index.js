import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signin, verifyGoogleToken } from "../../../redux/actions/authActions";
import { toast } from "react-toastify";
import { signinSchema } from "../../../validations/auth.schema";
import { validator } from "../../../helpers/validator";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const _token = localStorage.getItem("token");

  React.useEffect(() => {
    if (_token) {
      navigate("/");
    }
  }, []);

  const handleGoogleSuccess = async (response) => {
    // Send the token to the backend
    dispatch(verifyGoogleToken(response))
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        toast.error(err || "Signin Failed");
      });
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google Login Failed");
  };

  const onSubmit = (values) => {
    dispatch(signin(values.email, values.password))
      .then((res) => {
        if (res) {
          return navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err || "Signin failed");
      });
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h4"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validate={validator(signinSchema)}
            onSubmit={onSubmit}
          >
            {({ errors, touched, handleSubmit }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    as={TextField}
                    color={`${errors.email ? "error" : ""}`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    fullWidth
                    variant="outlined"
                    as={TextField}
                    color={`${errors.password ? "error" : ""}`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>

                <Button type="submit" fullWidth variant="contained">
                  Sign in
                </Button>
              </Box>
            )}
          </Formik>

          <Divider>or</Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleSuccess(credentialResponse);
              }}
              onError={(error) => {
                handleGoogleFailure(error);
              }}
              width="390px"
            />

            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link to="/signup" variant="body2" sx={{ alignSelf: "center" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </React.Fragment>
  );
}
