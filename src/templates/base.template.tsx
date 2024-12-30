import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import styles from "./Template.module.css";
import { Footer } from "../components/Footer";

function BaseTemplate() {
  return (
    <Box className={styles["main-container"]}>
      <Box className={styles["main-content"]}>
        <Header />
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
}

export default BaseTemplate;
