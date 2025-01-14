import React, { use, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TransferForm from "../../components/Forms/TransferForm";
import OtpForm from "../../components/Forms/OtpForm";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  sendGuestTransfer,
  submitTransfer,
} from "../../redux/actions/transferActions";
import BasicModal from "../../components/Modal";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  submitTransferGuest,
  verifyOtp,
} from "../../redux/actions/authActions";
import { getProfile } from "../../redux/actions/commonActions";

export default function Home(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const _transferToken = urlParams.get("transferToken");

  const images = [
    "url('../images/slider1.jpg')",
    "url('../images/slider2.jpg')",
    "url('../images/slider3.jpg')",
    "url('../images/slider4.jpg')",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);

  const [screen, setScreen] = useState(1);
  const [transferToken, setTransferToken] = useState(_transferToken || "");

  const transfer = useSelector((state) => state.transfer);

  useEffect(() => {
    if (transferToken) {
      setScreen(2);
    }
  }, [transferToken]);

  useEffect(() => {
    if (transfer.shared) {
      setShowModel(true);
    }
  }, [transfer.shared]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  const handleTransferSubmit = (values) => {
    if (!values.files) {
      return toast.error("Please select files");
    }
    const formData = new FormData();

    formData.append("emailTo", values.emailTo);
    formData.append("fromEmail", values.fromEmail);
    formData.append("title", values.title);
    formData.append("message", values.message);

    if (values.files) {
      Array.from(values.files).forEach((file) => {
        formData.append("files", file);
      });
    }

    if (props.profileId) {
      dispatch(submitTransfer(formData))
        .then((res) => {
          if (res) {
            return toast.success("Transfer submitted successfully");
          }
        })
        .catch((err) => {
          console.error(err);
          return toast.error("Transfer failed");
        });
    } else {
      dispatch(submitTransferGuest(formData))
        .then((res) => {
          if (res.data) {
            setTransferToken(res.data);
            setScreen(2);
            navigate("/?transferToken=" + res.data);
            return toast.success("Enter OTP");
          }
        })
        .catch((err) => {
          console.error(err);
          return toast.error(err || "Transfer failed");
        });
    }
  };

  const handleOtp = (otp) => {
    try {
      const data = {
        otp,
        transferToken,
      };
      dispatch(verifyOtp(data))
        .then((res) => {
          if (res.data) {
            dispatch(getProfile());

            dispatch(sendGuestTransfer(res.data.data.document))
              .then((res) => {
                if (res.data) {
                  setShowModel(true);
                }
              })
              .catch((err) => {
                return toast.error(err || "Transfer failed");
              });

            return toast.success("Logged in");
          }
        })
        .catch((err) => {
          console.error(err);
          return toast.error(err || "Transfer failed");
        })
        .finally(() => {
          setScreen(1);
          navigate("/");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "#cfe8fc",
          background: images[currentImageIndex],
          height: "100vh",
        }}
        className="slider"
      >
        {screen === 1 ? (
          <TransferForm
            profileId={props.profileId}
            handleTransferSubmit={handleTransferSubmit}
          />
        ) : (
          <OtpForm
            transferToken={transferToken}
            handleOtp={handleOtp}
            onClose={() => {
              setScreen(1);
              navigate("/");
            }}
          />
        )}

        {showModel && (
          <BasicModal open={showModel} modelOnClose={() => setShowModel(false)}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              File shared successfully
            </Typography>
            <p>To : {transfer.shared.toEmail}</p>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  const url =
                    process.env.REACT_APP_API_URL +
                    "/files/" +
                    transfer.shared.filePath;
                  window.open(url, "_blank");
                }}
              >
                Download
              </Button>
            </Typography>
          </BasicModal>
        )}
      </Box>
    </React.Fragment>
  );
}
