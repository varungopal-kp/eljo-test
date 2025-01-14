import { Button, Container, TextField } from "@mui/material";
import { Field, Formik } from "formik";
import React from "react";
import { profileSchema } from "../../validations/profile.schema";
import { validator } from "../../helpers/validator";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../redux/actions/commonActions";

export default function Index(props) {
  const dispatch = useDispatch();
  const onSubmit = (values) => {
   
    if (values.password) {
      if (values.password.length < 6) {
        return toast.error("Password must be at least 6 characters");
      }
    }
    const data = {
      name: values.name,
      password: values.password,
    };
    
    dispatch(updateProfile(data))
      .then((res) => {
        if (res) {
          return toast.success("Profile updated successfully");
        }
      })
      .catch((err) => {
        console.error(err);
        return toast.error("Profile update failed");
      })
      .finally(() => {
        props.modelOnClose();
      });
  };
  return (
    <Formik
      initialValues={{
        name: props.profile.name,
        password: "",
      }}
      onSubmit={onSubmit}
      enableReinitialize
      validate={validator(profileSchema)}
    >
      {({ errors, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          method="post"
        >
          <Container>
            <div>
              <Field
                name="name"
                label="Name"
                variant="standard"
                as={TextField}
                color={`${errors.name ? "error" : ""}`}
              />
            </div>
            <div>
              <Field
                name="password"
                label="Change Password"
                variant="standard"
                as={TextField}
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "16px" }}
              >
                Save
              </Button>
            </div>
          </Container>
        </form>
      )}
    </Formik>
  );
}
