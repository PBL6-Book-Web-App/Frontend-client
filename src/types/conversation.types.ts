export interface IConversation {
  _id: string;
  contents: string[];
  createdAt: string;
  title: string;
  updatedAt: string;
  user: string;
}

export interface IContent {
  _id: string;
  answer?: string;
  conversation: string;
  question: string;
  type: "ASK" | "ANSWER";
  createdAt: string;
  updatedAt: string;
}
