import instance from "./../config";
import contentBasedInstance from "./../config/content-based-config";
import collaborativeFilteringInstance from "../config/collaborative-filtering-config";

type BookSearchType = {
	page: number;
	perPage: number;
	search?: string;
	languages?: string;
	price?: string;
	averageRating?: string;
	order?: string;
};

const getBooks = (params: BookSearchType) => {
	return instance.get("/books", {
		params: params,
	});
};

const getRatedBooks = (params: BookSearchType) => {
	return instance.get("/self/my-voted-books", {
		params: params,
	});
};

const getContentBasedRecommendedBooks = (id: string, sourceId: number) => {
	return contentBasedInstance.get(`/content-based-recommend/${id}-${sourceId}`);
};

const getCollaborativeFilteringRecommendedBooks = (userId: string) => {
	return collaborativeFilteringInstance.get(`/recommend_CF_book/${userId}`);
};

const getBookById = (id: string) => {
	return instance.get(`/books/${id}`);
};

const deleteBookById = (id: string) => {
	return instance.delete(`/books/${id}`);
};

export const BookApi = {
	getBooks,
	getRatedBooks,
	getContentBasedRecommendedBooks,
	getCollaborativeFilteringRecommendedBooks,
	getBookById,
	deleteBookById,
};
