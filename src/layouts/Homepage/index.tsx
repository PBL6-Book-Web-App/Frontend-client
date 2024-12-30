import { Box, Typography } from "@mui/material";
import BookList from "../../components/BookList/BookList";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { IBook } from "../../types";
import { BookApi } from "../../services";

const Homepage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [topRatedBooks, setTopRatedBooks] = useState<IBook[]>([]);
  const [newReleasesBooks, setNewReleasesBooks] = useState<IBook[]>([]);
  const [mostRatesBooks, setMostRatesBooks] = useState<IBook[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<IBook[]>([]);

  useEffect(() => {
    const getTopRatedBooks = async () => {
      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 10,
          order: "averageRating:desc",
        });
        const bookData = response.data?.data;
        setTopRatedBooks(bookData);
      } catch (err) {
        setTopRatedBooks([]);
      }
    };
    const getNewReleasesBooks = async () => {
      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 10,
          order: "releaseDate:desc",
        });
        const bookData = response.data?.data;
        setNewReleasesBooks(bookData);
      } catch (err) {
        setNewReleasesBooks([]);
      }
    };
    const getMostRatesBooks = async () => {
      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 10,
          order: "numberOfRatings:desc",
        });
        const bookData = response.data?.data;
        setMostRatesBooks(bookData);
      } catch (err) {
        setMostRatesBooks([]);
      }
    };
    const getCFRecommendedBooks = async () => {
      try {
        const response =
          await BookApi.getCollaborativeFilteringRecommendedBooks(userInfo.id);
        const bookData = response.data?.data;
        setRecommendedBooks(bookData);
      } catch (err) {
        setRecommendedBooks([]);
      }
    };
    getTopRatedBooks();
    getNewReleasesBooks();
    getMostRatesBooks();
    if (accessToken) {
      getCFRecommendedBooks();
    }
  }, [accessToken, userInfo]);

  return (
    <Box maxWidth="lg" paddingY={"1rem"} margin={"auto"} marginTop={"20px"}>
      <Typography variant="h2" gutterBottom textAlign={"center"}>
        Welcome to BookGenius
      </Typography>
      {accessToken && (
        <>
          <BookList
            title={"Recommended For You"}
            books={recommendedBooks}></BookList>
        </>
      )}
      <BookList title={"New Releases"} books={newReleasesBooks}></BookList>
      <BookList title={"Top Rated"} books={topRatedBooks}></BookList>
      <BookList
        title={"Book with Most Rates"}
        books={mostRatesBooks}></BookList>
    </Box>
  );
};

export default Homepage;
