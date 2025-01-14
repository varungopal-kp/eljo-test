import { Box, Button, Container, TextField } from "@mui/material";
import React from "react";

export default function OtpForm(props) {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        props.handleOtp(e.target[0].value);
      }}
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
        <h5>Please check your email for OTP</h5>
        <TextField label="OTP" variant="standard" required />
        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: "16px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Button type="submit" variant="contained" color="primary">
              Verify
            </Button>
          </div>
          <div>
            <Button
              type="button"
              variant="contained"
              color="white"
              onClick={props.onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Container>
    </Box>
  );
}
