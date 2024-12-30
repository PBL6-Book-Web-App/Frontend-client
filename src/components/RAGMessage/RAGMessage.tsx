import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RAGChatProps } from "./RAGMessage.types";
import DefaultAvatarIcon from "D:/PBL6/FE-client/book-recommender-client/src/assets/default-avatar-icon.jpg";
import SmallLogoIcon from "D:/PBL6/FE-client/book-recommender-client/src/assets/small-logo-icon.png";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const RAGMessage: FC<RAGChatProps> = ({ data }) => {
  //   const { loggedin, user } = useSelector(authSelector);
  const { user, loggedin } = useSelector((state: RootState) => ({
    user: state.auth.userInfo,
    loggedin: state.auth.isLoggedIn,
  }));
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const layoutRef = useRef<any>(null);
  const [width, setWidth] = useState(0);
  const [component, setComponent] = useState<JSX.Element>();
  const [show, setShow] = useState(false);
  const [bad, setBad] = useState(false);

  function randomColor() {
    const red = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const green = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const blue = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    return `#${red}${green}${blue}`;
  }

  useEffect(() => {
    if (layoutRef.current) {
      setWidth(layoutRef.current.offsetWidth); // Lấy width ban đầu
    }
  }, []);

  if (data.type === "ASK") {
    return (
      <div className="container">
        <img src={DefaultAvatarIcon} alt="Logo" className="avatar" />
        <div className="content">
          <span className="username">{user?.name || "Customer"}</span>
          <div className="question-container">
            <p className="question">{data.question}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-row px-[20px] pt-[30px] items-start gap-2 w-full "
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}>
      <div className="rounded-full min-w-[40px] h-[40px] bg-gray-200 border border-gray-200 flex items-center justify-center">
        <img src={SmallLogoIcon} alt="Logo" className="w-[20px] h-[20px]" />
      </div>
      <div className="flex flex-col gap-4 mt-[7px] w-full">
        <span className="font-sans font-semibold text-black text-xl">Quiz</span>
        <div className="flex flex-col mt-[5px] gap-2">
          <p className="font-sans font-normal text-black text-base mb-[10px]">
            {data.answer === "" ? "Not Found" : data.answer}
          </p>
        </div>
        <div
          className="flex h-[500px] w-full bg-slate-100 rounded-[4px]"
          ref={layoutRef}>
          {component}
        </div>
      </div>
    </div>
  );
};

export default RAGMessage;
