import { Box, Button, Container, TextField } from "@mui/material";
import React, { use, useEffect, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { transferSchema } from "../../validations/transfer.schema";
import { validator } from "../../helpers/validator";

export default function TransferForm(props) {
  const fileInputRef = useRef(null);
  const [initialValues, setInitialValues] = React.useState({
    emailTo: "",
    fromEmail: "",
    title: "",
    message: "",
    files: null,
  });
  // Handle file upload
  const handleFileUpload = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxTotalSize = 100 * 1024 * 1024; // 100 MB in bytes

    // Check the number of files
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files.`);
      return;
    }

    // Calculate the total size of the files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > maxTotalSize) {
      toast.error(`File exceeds 100 MB.`);
      return;
    }

    setFieldValue("files", files);
  };

  useEffect(() => {
    if (props.profileId) {
      const newInitialValues = { ...initialValues };
      delete newInitialValues.fromEmail;
      setInitialValues(newInitialValues);
    }
  }, [props.profileId]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validate={validator(transferSchema)}
      onSubmit={props.handleTransferSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        resetForm,
        setFieldValue,
      }) => (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          method="post"
        >
          <Box
            sx={{
              bgcolor: "#fff",
              position: "absolute",
              top: "40%",
              left: "20%",
              transform: "translate(-50%, -50%)",
              padding: "10px",
              "& .MuiTextField-root": { m: 1, width: "25ch" },
              borderRadius: "10px",
            }}
          >
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="uploadBtn"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={(e) => handleFileUpload(e, setFieldValue)}
                />
                <img
                  src="/images/add-files-v2.svg"
                  className="UploaderButtonsEmptyState_uploaderButtonFilesIcon___deaj"
                  alt="Add files"
                />

                <span style={{ fontSize: "12px", marginBottom: "5px" }}>
                  {values.files && values.files.length > 0
                    ? `files selected`
                    : "Add files"}
                </span>
              </div>
              <Field
                name="emailTo"
                label="Email to"
                variant="standard"
                as={TextField}
                color={`${errors.emailTo ? "error" : ""}`}
              />
              <ErrorMessage
                name="emailTo"
                component="div"
                style={{ color: "red", fontSize: "12px" }}
              />
              {!props.profileId && (
                <>
                  <Field
                    name="fromEmail"
                    label="Your email"
                    variant="standard"
                    as={TextField}
                    color={`${errors.fromEmail ? "error" : ""}`}
                  />
                  <ErrorMessage
                    name="fromEmail"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />
                </>
              )}
             
              <Field
                name="title"
                label="Title"
                variant="standard"
                as={TextField}
                color={`${errors.title ? "error" : ""}`}
              />
              <Field
                name="message"
                label="Message"
                variant="standard"
                as={TextField}
                color={`${errors.message ? "error" : ""}`}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "16px" }}
              >
                Transfer
              </Button>
            </Container>
          </Box>
        </form>
      )}
    </Formik>
  );
}
