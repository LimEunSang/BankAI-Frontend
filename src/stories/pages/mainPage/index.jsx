import { VideoStateContext, VoiceServiceStateContext } from "App";
import { todayTransfer } from "api/userApi";
import axios from "axios";
import {
  useGetAllAccount,
  useGetSumAccount,
} from "hooks/queries/accountQueries";
import { useGetMyInfo } from "hooks/queries/userQueries";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainCarousel from "stories/molecules/mainCarousel";
import TotalAcc from "stories/molecules/totalAcc";
import ProdContainer from "stories/organisms/prodContainer";

const MainPage = () => {
  const { data: allAccount } = useGetAllAccount();
  const { data: sumAccount } = useGetSumAccount();
  const { data: myInfo, isLoading, error } = useGetMyInfo();
  const [sortedAccounts, setSortedAccounts] = useState([]);
  const navigate = useNavigate();
  const [text, setText] = useState(""); // 음성으로 바뀔 text

  const { result, setResult, setOptions, setType } = useContext(
    VoiceServiceStateContext,
  );
  const setSrc = useContext(VideoStateContext);

  const mainAIList = [
    { name: "내 정보 페이지", data: "/myInfo" },
    { name: "상품 메인페이지", data: "/productMain" },
    { name: "전체 계좌 페이지", data: "/account" },
    { name: "거래내역 조회 페이지", data: "/accountHistory" },
    { name: "계좌이체 페이지", data: "/transferAccount" },
    { name: "오늘 송금 금액", data: "todayTransfer" },
  ];

  useEffect(() => {
    setSrc("/assets/introduce.mov");
    setOptions(mainAIList);
    setType("text");
  }, []);

  useEffect(() => {
    if (myInfo && allAccount) {
      const mainAcc = myInfo.userMainAcc;
      const sorted = [...allAccount].sort((a, b) => {
        if (a.accCode === mainAcc) return -1;
        if (b.accCode === mainAcc) return 1;
        return 0;
      });
      setSortedAccounts(sorted);
    }
  }, [myInfo, allAccount]);

  useEffect(() => {
    if (result) {
      const findData = mainAIList.find((data) => result === data.name);

      // 오늘 송금 금액 조회
      if (findData && findData.data === "todayTransfer") {
        todayTransfer().then((res) => {
          setText("오늘 송금하신 금액은 " + res.data + "원 입니다.");
        });
      } else if (findData && sortedAccounts.length > 0) {
        if (findData.data === "/accountHistory") {
          navigate(findData.data, {
            state: {
              accCode: sortedAccounts[0].accCode,
              prodName: sortedAccounts[0].prodName,
            },
          });
        } else {
          navigate(findData.data);
        }
      }
    }
  }, [result]);

  useEffect(() => {
    if (!text) return;
    convertTextToSpeech();
  }, [text]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  // TTS 함수
  const convertTextToSpeech = async () => {
    try {
      const response = await axios.post(
        "/api/tts",
        { text },
        {
          responseType: "blob",
        },
      );

      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS 요청 실패", error);
    }
  };

  return (
    <div className="pb-20">
      {sortedAccounts.length > 0 && sumAccount && (
        <div className="mb-40 mt-8">
          <div className="flex flex-col space-y-4">
            <p className="text-18 ml-25 font-bold">{sumAccount.userName}님</p>
            <MainCarousel
              data={sortedAccounts}
              mainAcc={myInfo.userMainAcc}
            ></MainCarousel>
          </div>
        </div>
      )}

      <div className="mb-30">
        <ProdContainer
          title={"마이메뉴"}
          data={["전체 계좌", "상품", "내 정보"]}
          imgs={[0, 1, 4]}
          urls={["/account", "/productMain", "/myInfo"]}
        ></ProdContainer>
      </div>
      <div className="mb-30">
        {sumAccount && (
          <TotalAcc
            data={sumAccount.assets}
            date={new Date().toLocaleTimeString()}
          ></TotalAcc>
        )}
      </div>
      <div className="flex flex-col py-20 px-20 border border-gray-border bg-white shadow-custom rounded-20 space-y-4">
        <p className="text-17 font-semibold">금융 상식 톡톡</p>
        <Link
          to={"/bancassurance"}
          className="flex justify-start space-x-3 border border-gray-border rounded-20 py-16 px-18"
        >
          <img src="/assets/toktok1.svg" alt="toktok1" />
          <div className="flex flex-col space-y-1">
            <p className="text-16 font-semibold">
              은행에서도 보험 상품을 판매한다고?
            </p>
            <p className="text-12">내게 맞는 보험 찾기 {">"}</p>
          </div>
        </Link>
        <Link
          to={"/precaution"}
          className="flex justify-start space-x-3 border border-gray-border rounded-20 py-14 px-18"
        >
          <img src="/assets/toktok2.svg" alt="toktok2" />
          <div className="flex flex-col space-y-1">
            <p className="text-16 font-semibold">
              신용대출을 받을 때 꼭 알아야할 유의사항
            </p>
            <p className="text-12">내게 맞는 대출 찾기 {">"}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default MainPage;
