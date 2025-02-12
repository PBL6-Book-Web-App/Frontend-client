import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar, Button, Chip, Divider, Typography } from "@mui/material";
import { Book, Logout } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../../redux/reducers";
import { RootState } from "../../redux/store";
import styles from "./Header.module.css";
import { navItems } from "../../constants";
import { DialogChangePassword } from "../Dialog/ChangePasword";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [openPassword, setOpenPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setHasScrolled(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    setOpenPassword(true);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        className={styles["main-app-header"]}
        style={{
          boxShadow: hasScrolled
            ? "rgba(255, 255, 255, 0.9) 0rem 0rem 0.0625rem 0.1rem inset, rgba(0, 0, 0, 0.1) 0rem 1rem 1.6875rem 0rem"
            : "none",
          top: "1rem",
          position: "sticky",
          zIndex: 1003,
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          width: "85%",
        }}>
        <Toolbar className={styles["toolbar"]}>
          <Box className={styles["title"]}>
            <Typography
              variant="h5"
              gutterBottom
              className={styles["typography-header"]}>
              <Chip label={"BookGenius"} icon={<Book />}></Chip>
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, index) => (
              <Link to={item.link} style={{ color: "black" }} key={item.link}>
                <Button
                  key={item.label}
                  style={{
                    color: index === 0 ? "#4DA1A9" : "black", // Màu vàng cho mục đầu tiên
                    padding: "1rem",
                  }}>
                  {index === 0 && (
                    <span style={{ marginRight: "0.2rem" }}>⭐</span> // Biểu tượng ngôi sao
                  )}
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
          <Box>
            {accessToken ? (
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit">
                  <AccountCircle />
                </IconButton>
                {/* MENU */}
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{
                    "& .MuiList-root": {
                      padding: "0 !important",
                    },
                    "& .MuiPaper-root": {
                      borderRadius: "10px !important",
                      padding: "0 !important",
                    },
                  }}>
                  <Box className={styles["profile-pictures-wrapper"]}>
                    <Avatar
                      alt="profile-background"
                      src={""}
                      className={styles["profile-background"]}
                    />
                    <Avatar
                      alt="profile-avatar"
                      src={""}
                      className={styles["profile-avatar"]}
                    />
                  </Box>
                  <MenuItem
                    className={styles["menu-info-item"]}
                    onClick={handleClose}
                    disabled>
                    <Typography className={styles["username"]}>
                      {userInfo ? `${userInfo.name}` : "Guest"}
                    </Typography>
                  </MenuItem>
                  <Divider className={styles["menu-divider"]} />
                  <MenuItem
                    className={styles["menu-list-item"]}
                    onClick={handleChangePassword}>
                    <Box className={styles["menu-list-text"]}>
                      <KeyIcon className={styles["menu-list-icon-password"]} />
                      Change Password
                    </Box>
                    <ChevronRightIcon className={styles["menu-list-icon"]} />
                  </MenuItem>
                  <MenuItem
                    className={styles["menu-list-item"]}
                    onClick={handleLogout}>
                    <Box className={styles["menu-list-text"]}>
                      <Logout className={styles["menu-list-icon-logout"]} />
                      Logout
                    </Box>
                    <ChevronRightIcon className={styles["menu-list-icon"]} />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Link to={"login"} style={{ color: "black" }}>
                  <Button style={{ color: "black", padding: "1rem" }}>
                    Login
                  </Button>
                </Link>
                <Link to={"sign-up"} style={{ color: "black" }}>
                  <Button style={{ color: "black", padding: "1rem" }}>
                    Signup
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <DialogChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default Header;
