import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { IBook } from "../../types";
import { FALLBACK_IMAGE_URL } from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { InteractionApi } from "../../services";
import { useCallback } from "react";

const responsive = {
  desktop: {
    breakpoint: { max: 5000, min: 1024 },
    items: 6,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};
interface BookListProps {
  title: string;
  books: IBook[] | [];
}

const BookList = ({ title, books }: BookListProps) => {
  const userId = useSelector((state: RootState) => state.auth.userInfo?.id);

  const handleBookClick = useCallback(
    (bookId: string) => {
      const clickBook = async (type: string) => {
        try {
          await InteractionApi.updateCurrentUserInteractionsByBookId({
            bookId,
            type,
          });
        } catch (err) {
          console.log(err);
        }
      };
      if (title === "Recommended For You" && userId) {
        clickBook("VIEW_COLLABORATIVE");
      }
      if (title === "Related books" && userId) {
        clickBook("VIEW_CONTENT_BASED");
      }
    },
    [title, userId]
  );

  return (
    <>
      <Box marginY={"2rem"}>
        <Typography
          variant="h5"
          fontWeight={"500"}
          paddingLeft={1}
          paddingBottom={3}>
          {title}
        </Typography>
        {books.length === 0 ? (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
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
          <Carousel responsive={responsive}>
            {books.map((book) => (
              <Card
                sx={{
                  margin: "0 10px 10px 0",
                  height: "330px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                }}
                key={book.id}
                onClick={() => handleBookClick(book.id)}>
                <Link to={`/books/${book.id}`} style={{ color: "black" }}>
                  <CardMedia
                    component="img"
                    image={book.imageUrl}
                    alt={book.title}
                    height="200"
                    onError={(e: any) => {
                      /**
                       * Any code. For instance, changing the `src` prop with a fallback url.
                       * In our code, I've added `e.target.className = fallback_className` for instance.
                       */
                      e.target.src = FALLBACK_IMAGE_URL;
                    }}
                  />
                  <CardContent>
                    <Tooltip title={book.title} placement="top">
                      <Typography
                        variant="h6"
                        sx={{
                          width: "150px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          fontSize: "1rem",
                          lineHeight: "1.5rem",
                          marginBottom: "7px",
                        }}>
                        {book.title}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        width: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      {book.authors && book.authors?.length > 0 ? (
                        book.authors.map((item, index) => (
                          <span key={item.author.id}>
                            {item.author.name}
                            {book.authors && index < book.authors?.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        width: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      <svg
                        viewBox="0 0 24 24"
                        role="presentation"
                        style={{
                          width: "16px",
                          height: "16px",
                        }}>
                        <path
                          className={"RatingStar__fill"}
                          d="M24 9.63469C24 9.35683 23.7747 9.13158 23.4969 9.13158H15.0892L12.477 1.34327C12.4269 1.19375 12.3095 1.0764 12.16 1.02625C11.8966 0.937894 11.6114 1.07983 11.523 1.34327L8.91088 9.13158H0.503157C0.33975 9.13158 0.186521 9.21094 0.0922364 9.3444C-0.0680877 9.57134 -0.0140806 9.88529 0.212865 10.0456L7.00408 14.8432L4.40172 22.6166C4.35092 22.7683 4.37534 22.9352 4.46749 23.066C4.6275 23.2932 4.94137 23.3476 5.16853 23.1876L12 18.3758L18.8317 23.183C18.9625 23.2751 19.1293 23.2994 19.281 23.2486C19.5445 23.1604 19.6865 22.8752 19.5983 22.6117L16.996 14.8432L23.7872 10.0456C23.9206 9.95133 24 9.7981 24 9.63469Z"
                          fill="#e87400"></path>
                      </svg>{" "}
                      <span key="average-rating" style={{ fontWeight: "600" }}>
                        {book?.averageRating?.toFixed(2)}
                      </span>
                      <span key="separator" style={{ margin: "0 8px" }}>
                        •
                      </span>
                      <span key="number-of-ratings">
                        {book.numberOfRatings} ratings
                      </span>
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </Carousel>
        )}
      </Box>
      <Divider />
    </>
  );
};

export default BookList;
