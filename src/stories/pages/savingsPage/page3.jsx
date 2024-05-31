import { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import LongButton from "stories/atoms/longButton";
import SelectBox from "stories/atoms/selectBox";
import Title from "stories/atoms/title";
import HeaderBar from "stories/molecules/headerBar";

const Page3 = ({ moveNextPage, depositForm, setDepositForm }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const options = Array.from({ length: 28 }, (_, i) => `${i + 1}`);

  return (
    <div>
      <HeaderBar text={"적금가입"} />
      <Title text1={"자동 이체일을 선택해주세요"} />
      <div className="mt-25">
        <SelectBox
          options={options}
          selectedOption={selectedDay}
          setSelectedOption={setSelectedDay}
        />
      </div>
      <div className="flex items-center px-5 py-10 space-x-2">
        <ErrorIcon sx={{ fontSize: 18, color: "#4D4D4D" }} />
        <div className="text-14">
          {depositForm.prodName} 이체 한도는 기본{" "}
          {parseInt(depositForm.userTrsfLimit).toLocaleString()}원 입니다.
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10 absolute left-0 bottom-0 w-full px-40 mb-50">
        <LongButton
          text={"다음"}
          active={!!selectedDay}
          onClick={moveNextPage}
        />
      </div>
    </div>
  );
};

export default Page3;