import instance from "../config";

type QuestionType = {
  question: string;
  conversation?: string;
};

const getAnswerByUser = (data: QuestionType) => {
  return instance.post("/conversation/ask", data);
};

const getAnswerByCustomer = (data: QuestionType) => {
  return instance.post("/customer/question", data);
};

const getConversationUser = () => {
  return instance.get<any>("/conversation");
};

const deleteConversationUser = (id: string) => {
  return instance.delete<any>(`/conversation/${id}`);
};

const getConversationContent = (id: string) => {
  return instance.get(`/conversation/${id}`);
};

const ratingConversationContent = (id: string, feedback: string) => {
  return instance.post(`/user/content/${id}/rate`, {
    feedback,
  });
};

export const ModelApi = {
  getAnswerByUser,
  getAnswerByCustomer,
  deleteConversationUser,
  getConversationUser,
  getConversationContent,
  ratingConversationContent,
};
