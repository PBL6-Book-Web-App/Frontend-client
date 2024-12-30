import instance from "./../config";

type InteractionType = {
	bookId: string;
	type: string;
	value?: number;
};

const getCurrentUserInteractionsByBookId = (bookId: string, userId: string) => {
	return instance.get(`/interactions/${bookId}/${userId}`);
};

const updateCurrentUserInteractionsByBookId = (data: InteractionType) => {
	return instance.post(`/interactions`, data);
};

export const InteractionApi = {
	getCurrentUserInteractionsByBookId,
	updateCurrentUserInteractionsByBookId,
};
