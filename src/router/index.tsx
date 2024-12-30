import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";
import BaseTemplate from "../templates/base.template";
import Homepage from "../layouts/Homepage";
import BookDetail from "../layouts/BookDetail";
import { useEffect, useState } from "react";
import { BookApi } from "../services";
import { IBook } from "../types";
import { Box, CircularProgress } from "@mui/material";
import AboutUs from "../layouts/AboutUs";
import BookShelves from "../layouts/BookShelves";
import { SignUp } from "../pages/SignUp";
import PremiumPage from "../layouts/PremiumPage";

const LoginWrapper = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  if (accessToken) {
    return <Navigate to={"/home-page"} replace={true} />;
  }
  return <Login />;
};

const SignUpWrapper = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  if (accessToken) {
    return <Navigate to={"/home-page"} replace={true} />;
  }
  return <SignUp />;
};

const BookDetailWrapper = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<IBook | null>(null);

  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await BookApi.getBookById(bookId || "");
        if (response?.data) setBook(response?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getBook();
  }, [bookId]);

  if (!book) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return <BookDetail book={book} />;
};

export const router = createBrowserRouter([
  {
    element: <BaseTemplate />,
    children: [
      {
        index: true,
        path: "/",
        element: <Navigate to={"/home-page"} replace={true} />,
      },
      {
        path: "get-premium",
        element: <PremiumPage />,
      },
      {
        path: "home-page",
        element: <Homepage />,
      },

      {
        path: "books/:bookId",
        element: <BookDetailWrapper />,
      },
      {
        path: "bookshelves",
        element: <BookShelves />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginWrapper />,
  },
  {
    path: "sign-up",
    element: <SignUpWrapper />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
