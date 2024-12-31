import React, { forwardRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Rating,
  Divider,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BookList from "../../components/BookList/BookList";
import { IBook } from "../../types";
import dayjs from "dayjs";
import { FALLBACK_IMAGE_URL } from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BookApi, InteractionApi } from "../../services";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import AssistantIcon from "@mui/icons-material/Assistant";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
// import { RAGChat } from "../../components/RAGMessage";

// Cấu hình worker cho pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const width = 300;
const height = 424;
interface BookDetailProps {
  book: IBook;
}
interface PageProps {
  pageNumber: number;
}

const BookDetail = ({ book }: BookDetailProps) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [recommendedBooks, setRecommendedBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(300);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Failed to exit fullscreen:", err);
        });
    }
  };

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  const handleResize = (e: { clientX: number }) => {
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 200 && newWidth <= 600) {
      setAssistantWidth(newWidth);
    }
  };

  const stopResize = () => {
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
  };

  const startResize = () => {
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
  };

  useEffect(() => {
    setRecommendedBooks([]);
  }, [book.id]);

  useEffect(() => {
    const getCurrentUserInteractions = async () => {
      try {
        setLoading(true);
        const response =
          await InteractionApi.getCurrentUserInteractionsByBookId(
            book.id,
            userInfo.id
          );
        if (response.data?.data?.length > 0) {
          setUserRating(response.data.data[0].value);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    const getContentBasedRecommendedBooks = async () => {
      try {
        const response = await BookApi.getContentBasedRecommendedBooks(
          book.id,
          book.source.id
        );
        if (response.data?.data) {
          setRecommendedBooks(response.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getContentBasedRecommendedBooks();
    if (userInfo) {
      getCurrentUserInteractions();
    }
  }, [userInfo, book.id, book.source.id]);

  const handleRatingChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setUserRating(newValue);
    }
  };

  const handleRateBook = () => {
    const rateBook = async () => {
      try {
        setLoading(true);
        await InteractionApi.updateCurrentUserInteractionsByBookId({
          bookId: book.id,
          type: "RATING",
          value: userRating,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      if (userRating > 0) {
        rateBook();
      } else {
        toast.info(
          "Invalid rating value. Please enter a value between 1 and 5."
        );
      }
    } else {
      toast.warn("Please login to use this feature!");
    }
  };

  // Hàm mở dialog
  const handleOpenPdfViewer = () => {
    setIsBookModalOpen(true);
  };

  // Hàm đóng dialog
  const handleClosePdfViewer = () => {
    setIsFullscreen(false);
    setIsAIAssistantOpen(false);
    setIsBookModalOpen(false);
  };
  const Page = forwardRef<HTMLDivElement, PageProps>(({ pageNumber }, ref) => {
    return (
      <div ref={ref}>
        <ReactPdfPage pageNumber={pageNumber} width={width} />
      </div>
    );
  });

  Page.displayName = "Page";

  return (
    <Box maxWidth="lg" paddingY={"1rem"} margin={"auto"}>
      {/* MUI Dialog để hiển thị PDF */}
      <Dialog
        open={isBookModalOpen}
        onClose={handleClosePdfViewer}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              maxWidth: "100% !important",
              maxHeight: "100%",
              height: isFullscreen ? "100% !important" : "90% !important",
              width: isFullscreen ? "100% !important" : "90% !important",
              margin: 0,
              //   paddingTop: "10px !important",
              paddingBottom: "0px !important",
            },
          },
        }}>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
          sx={{
            "&.MuiDialogContent-root": {
              overflowY: "hidden !important",
              padding: "0 !important",
              border: "0px !important",
            },
          }}>
          <div
            style={{
              width: isAIAssistantOpen
                ? `calc(100% - ${assistantWidth}px)`
                : "100%",
              height: "100%",
              transition: "width 0.2s",
              position: "relative",
            }}>
            <div
              style={{
                position: "absolute",
                top: "70px",
                right: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                zIndex: 10,
              }}>
              <Tooltip title="Stop Reading" placement="left">
                <IconButton
                  color="error"
                  onClick={handleClosePdfViewer}
                  style={{
                    backgroundColor: "#d32f2f",
                    color: "white",
                    transition: "background-color 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)";
                    e.currentTarget.style.backgroundColor = "#9a0007";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = "#d32f2f";
                  }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={isFullscreen ? "Exit Focus Mode" : "Focus Mode"}
                placement="left">
                <IconButton
                  color="primary"
                  onClick={toggleFullscreen}
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "white",
                    transition: "background-color 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)";
                    e.currentTarget.style.backgroundColor = "#303f9f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = "#3f51b5";
                  }}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  isAIAssistantOpen ? "Close AI Assistant" : "Get AI Assistant"
                }
                placement="left">
                <IconButton
                  color="secondary"
                  onClick={toggleAIAssistant}
                  style={{
                    backgroundColor: "#f50057",
                    color: "white",
                    transition: "background-color 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)";
                    e.currentTarget.style.backgroundColor = "#c51162";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = "#f50057";
                  }}>
                  {isAIAssistantOpen ? <CloseIcon /> : <AssistantIcon />}
                </IconButton>
              </Tooltip>
            </div>
            <iframe
              src={`https://jknopper.win.tue.nl/latex/exercises/day1/snowwhite.pdf`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="PDF Viewer"
            />
          </div>
          {isAIAssistantOpen && (
            <div
              style={{
                position: "relative",
                top: "0",
                right: "0",
                width: `${assistantWidth}px`,
                height: "100%",
                background: "#fff",
                borderLeft: "1px solid #ccc",
                padding: "10px",
                boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}>
              <div
                style={{
                  height: "100%",
                  overflowY: "auto",
                }}>
                <h3>AI Assistant</h3>
                <p>Chat with AI goes here...</p>
                {/* <RAGChat /> */}
              </div>
              <div
                style={{
                  width: "5px",
                  cursor: "ew-resize",
                  background: "#ddd",
                  position: "absolute",
                  left: "0px",
                  height: "100%",
                }}
                onMouseDown={startResize}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Box padding={3}>
        <Box padding={3}>
          <Paper elevation={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} sx={{ padding: "1rem" }}>
                <CardMedia
                  component="img"
                  image={book.imageUrl}
                  alt={book.title}
                  style={{ width: "100%", height: "auto", padding: "1rem" }}
                  onError={(e: any) => {
                    e.target.src = FALLBACK_IMAGE_URL;
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ padding: "1rem" }}>
                <Box>
                  <Typography variant="h4">{book.title}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    by{" "}
                    {book.authors?.map((item, index) => (
                      <span key={item.author.id}>
                        {item.author.name}
                        {book.authors && index < book.authors?.length - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                  </Typography>
                  <Box display="flex" alignItems="center" marginY={1}>
                    <Rating
                      value={book.averageRating}
                      readOnly
                      precision={0.1}
                      max={5}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      marginLeft={1}>
                      ({book.averageRating ? book.averageRating : 0}/5) (
                      {book.numberOfRatings ? book.numberOfRatings : 0} rates)
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="primary">
                    ${book?.price ? book.price.toFixed(2) : "......."}
                  </Typography>
                  <Typography
                    variant="body1"
                    marginY={2}
                    sx={{
                      fontFamily: `"Libre Baskerville", serif !important;`,
                    }}>
                    {book.description}
                  </Typography>
                  <Box display={"flex"} alignItems={"center"} gap={"1rem"}>
                    <Rating
                      value={userRating ?? 0}
                      onChange={handleRatingChange}
                      precision={1}
                      max={5}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRateBook}
                      disabled={loading}>
                      Vote
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleOpenPdfViewer}
                      disabled={loading}>
                      Read this book
                    </Button>
                  </Box>
                  <Divider sx={{ padding: "1rem" }} />
                  <Typography variant="h5" paddingY={2}>
                    Additional information
                  </Typography>
                  {book.publisher && (
                    <Typography variant="subtitle1" color="textSecondary">
                      Published by: {book.publisher}
                    </Typography>
                  )}
                  {book.releaseDate && (
                    <Typography variant="subtitle1" color="textSecondary">
                      Release date:{" "}
                      {dayjs(book.releaseDate).format("DD/MM/YYYY")}
                    </Typography>
                  )}
                  {book.bookCover && (
                    <Typography variant="subtitle1" color="textSecondary">
                      Book cover: {book.bookCover}
                    </Typography>
                  )}
                  {book.numberOfPages && (
                    <Typography variant="subtitle1" color="textSecondary">
                      Number of pages: {book.numberOfPages}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <BookList title={"Related books"} books={recommendedBooks}></BookList>
      </Box>
    </Box>
  );
};

export default BookDetail;
