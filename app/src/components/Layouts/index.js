import React, { use, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getProfile } from "../../redux/actions/commonActions";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../redux/actions/authActions";
import BasicModal from "../Modal";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getFullUrl } from "../../helpers/utility";
import { toast } from "react-toastify";

export default function Index({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const fileToken = urlParams.get("fileToken");
  const profile = useSelector((state) => state.common.profile);
  const [showModel, setShowModel] = React.useState(false);
  const [shareDetails, setShareDetails] = React.useState({});

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, []);

  useEffect(() => {
    if (fileToken) {
      dispatch(verifyToken({ token: fileToken }))
        .then((res) => {
          setShowModel(true);
          setShareDetails(res.data);
        })
        .catch((err) => {
          console.error(err);
          return toast.error("Link Expired");
        });
    }
  }, [fileToken]);

  return (
    <div className="layout">
      <Header token={token} profile={profile} navigate={navigate} />
      <main>
        {showModel && (
          <BasicModal
            open={showModel}
            modelOnClose={() => {
              navigate(window.location.pathname, { replace: true });
              setShowModel(false);
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Shared File
            </Typography>
            <p>From : {shareDetails.fromEmail}</p>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  const url = getFullUrl(shareDetails.document);
                  window.open(url, "_blank");
                }}
              >
                Download
              </Button>
            </Typography>
          </BasicModal>
        )}
        {React.cloneElement(children, {
          profile: profile,
          profileId: profile?.id,
        })}
      </main>
      <Footer />
    </div>
  );
}
