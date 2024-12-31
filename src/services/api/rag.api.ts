import RAGInstance from "../config/RAG-config";

type QuestionType = {
  question: string;
  context: string;
  curFile: number;
};

const getAnswer = (data: QuestionType) => {
  return RAGInstance.post("/ask", data);
};

export const ModelApi = {
  getAnswer,
};
