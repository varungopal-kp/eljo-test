import React, { useState } from "react";
import { AppBar, Box, Button, Menu, MenuItem, Toolbar } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProfileForm from "../../components/Forms/ProfileForm";
import BasicModal from "../Modal";
import { logout } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";

export default function Header(props) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <header>
        <Box
          sx={{
            float: "left",
            marginTop: "20px",
            marginLeft: "30px",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            return props.navigate("/");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="20"
            fill="none"
            className="styles_module_logo__8a4eaeaf styles_module_dark__8a4eaeaf"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12.23 15.014c-.383-.605-.697-.926-1.254-.926-.558 0-.872.32-1.255.926L8.05 17.686c-.627 1.032-1.15 1.745-2.37 1.745s-1.777-.499-2.369-1.888a42.3 42.3 0 0 1-2.195-6.554C.348 7.89 0 5.967 0 4.4s.488-2.493 2.16-2.813c2.3-.428 5.401-.677 8.816-.677 3.414 0 6.515.25 8.815.677 1.672.32 2.16 1.246 2.16 2.814 0 1.567-.348 3.49-1.115 6.59a42.3 42.3 0 0 1-2.195 6.553c-.592 1.39-1.15 1.888-2.37 1.888-1.219 0-1.741-.713-2.369-1.745zm26.516 2.5c-1.185 1.282-3.415 2.208-6.342 2.208-5.888 0-9.373-4.096-9.373-9.474 0-5.77 4.007-9.19 9.199-9.19 4.634 0 7.7 2.458 7.7 5.77 0 3.135-2.613 5.165-5.575 5.165-1.602 0-2.787-.32-3.588-.961-.314-.25-.488-.214-.488.071 0 1.175.418 2.173 1.184 2.956.628.641 1.812 1.069 2.927 1.069 1.15 0 2.16-.25 3.066-.713s1.673-.32 2.126.428c.523.855-.21 1.959-.836 2.671"
              clipRule="evenodd"
            ></path>
          </svg>
        </Box>
        <Box sx={{ float: "right", marginTop: "20px", marginRight: "10px" }}>
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#fff",
              color: "black",
              borderRadius: "10px",
              float: "left",
            }}
          >
            <Toolbar
              sx={{
                justifyContent: "flex-end",
                minHeight: "48px !important",
                fontFamily: "Actief Grotesque, Arial, Helvetica, sans-serif",
                fontSize: "12px !important",
              }}
            >
              {props.token && props.profile ? (
                <div>
                  {" "}
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                    size="small"
                  >
                    Hi,
                    {props.profile?.email}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setShowProfile(true);
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        dispatch(logout());
                        props.navigate("/signin");
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <>
                  <Button
                    className="nav-btn"
                    onClick={() => props.navigate("/signin")}
                  >
                    Login
                  </Button>
                  <Button
                    className="nav-btn active"
                    onClick={() => props.navigate("/signup")}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </header>
      {showProfile && (
        <BasicModal
          open={showProfile}
          modelOnClose={() => setShowProfile(false)}
        >
          <ProfileForm
            profile={props.profile}
            modelOnClose={() => setShowProfile(false)}
          />
        </BasicModal>
      )}
    </React.Fragment>
  );
}
