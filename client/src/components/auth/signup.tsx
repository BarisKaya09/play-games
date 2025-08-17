import React, { useRef, useState } from "react";
import { Button, Icon, Input } from "../ui";
import AuthService from "../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Signup: React.FC = () => {
  const [isVisibleLoadIcon, setIsVisibleLoadIcon] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.classList.add("border-emerald-500", "duration-500");
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.classList.remove("border-emerald-500", "duration-500");
  };

  const signup = async () => {
    const username = usernameRef.current?.value as string;
    const email = emailRef.current?.value as string;
    const password = passwordRef.current?.value as string;

    setIsVisibleLoadIcon(true);
    const data = await AuthService.signup(username, email, password);

    if (data.success) {
      toast.success(data.data);
      setIsVisibleLoadIcon(false);

      setTimeout(() => {
        window.location.href = "/signin";
      }, 3000);
    } else {
      toast.error(data.error.message);
      setTimeout(() => setIsVisibleLoadIcon(false), 1000);

      console.log(data.error);
    }
  };

  return (
    <div className="w-[50%] m-auto mt-20 px-10 flex flex-wrap justify-center gap-5">
      <h3 className="w-full h-10 text-2xl text-emerald-500">Kayıt Ol</h3>

      <div className="w-full flex flex-wrap gap-10">
        <div className="w-full h-10">
          <Input type="text" ref={usernameRef} placeholder="Kullanıcı Adı" onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div className="w-full h-10">
          <Input type="email" ref={emailRef} placeholder="Email" onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div className="w-full h-10">
          <Input type="password" ref={passwordRef} placeholder="Şifre" onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div className="w-full h-10">
          <Button onClick={signup} bg="emerald">
            {isVisibleLoadIcon ? <Icon _icon={faSpinner} className="animate-spin mr-3" /> : ""}
            Kayıt Ol
          </Button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
