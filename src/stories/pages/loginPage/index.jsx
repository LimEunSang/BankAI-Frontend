import { PwdWindowOptions } from "constants/password";
import { usePostLogin } from "hooks/queries/userQueries";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "stories/atoms/input";
import LongButton from "stories/atoms/longButton";
import Title from "stories/atoms/title";
import { useImmer } from "use-immer";

const LoginPage = () => {
  const [loginForm, setLoginForm] = useImmer({
    userId: "",
    userPwd: "",
  });

  const { mutate: login, msg, isLoginSuccess } = usePostLogin();

  const handleLogin = () => {
    login(loginForm);
  };

  useEffect(() => {
    if (isLoginSuccess) {
      window.location.href = "/main";
    }
  }, [isLoginSuccess]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setLoginForm((draft) => {
      draft[field] = value;
    });
  };

  const openFindId = () => {
    window.open("/findId", "_blank",PwdWindowOptions);
  }

  const openLostPwd = () => {
    window.open("/lostPwd", "_blank",PwdWindowOptions);
  }

  return (
    <div>
      <Title text1={"로그인"} text2={""} />
      <div className="grid grid-cols-1 gap-20 mt-20">
        <Input
          placeholder={"아이디"}
          onChange={handleChange("userId")}
          msg={msg ? msg : null}
        />
        <Input
          placeholder={"비밀번호"}
          onChange={handleChange("userPwd")}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          type={"password"}
        />
      </div>
      <div className="flex flex-col justify-center items-center mt-10 absolute left-0 bottom-0 w-full px-40 mb-50">
        <LongButton
          text={"로그인"}
          active={!!loginForm.userId && !!loginForm.userPwd}
          onClick={handleLogin}
        />
        <div className="mt-10">
          <button onClick={openFindId}>아이디 찾기</button> | <button onClick={openLostPwd}>비밀번호 찾기</button> | <Link to={"/identify"}>회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
