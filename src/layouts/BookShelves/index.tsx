import {
  Box,
  Card,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BookMenu from "../../components/BookMenu/BookMenu";
import { IBook } from "../../types";
import Books from "../../components/Books/Books";
import { BookApi } from "../../services";

const BookShelves = () => {
  const [filterTerm, setFilterTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(1);

  const handleFilterChange = (newFilter: string) => {
    setFilterTerm(newFilter);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await BookApi.getBooks({
          page: currentPage,
          perPage: 18,
          search: searchTerm !== "" ? searchTerm : undefined,
        });
        const bookData = response.data?.data;
        setBooks(bookData);
        setTotalBooks(response.data?.meta?.total);
      } catch (err) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchRatedBooks = async () => {
      try {
        setLoading(true);
        const response = await BookApi.getRatedBooks({
          page: currentPage,
          perPage: 16,
          search: searchTerm !== "" ? searchTerm : undefined,
        });
        const bookData = response.data?.data;
        setBooks(bookData);
        setTotalBooks(response.data?.meta?.total);
      } catch (err) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    if (filterTerm === "voted") {
      fetchRatedBooks();
    } else {
      fetchBooks();
    }
  }, [currentPage, filterTerm, searchTerm]);

  return (
    <Box maxWidth="lg" margin={"auto"} marginTop={"20px"}>
      <Grid item xs={3} sx={{ p: 2 }}>
        <BookMenu
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </Grid>
      <Grid item xs={9} sx={{ p: 2 }}>
        <Typography variant="h5" paddingBottom={2}>
          Books
        </Typography>
        {loading ? (
          <Grid container spacing={2}>
            {[...Array(16)].map((_, index) => (
              <Grid item xs={12} md={2} key={index}>
                <Card style={{ padding: "0.25rem" }}>
                  <Skeleton variant="rectangular" height={200} />
                  <Skeleton />
                  <Skeleton width="60%" />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Books books={books} />
        )}
        <Pagination
          count={Math.ceil(totalBooks / 16)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        />
      </Grid>
    </Box>
  );
};

export default BookShelves;
