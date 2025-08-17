import React, { useRef, useState } from "react";
import { Button, Icon, Input } from "../ui";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";

const Signin: React.FC = () => {
  const [isVisibleLoadIcon, setIsVisibleLoadIcon] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const onFocus = (e: React.FocusEvent) => {
    e.target.classList.add("border-emerald-500", "duration-500");
  };

  const onBlur = (e: React.FocusEvent) => {
    e.target.classList.remove("border-emerald-500", "duration-500");
  };

  const signin = async () => {
    const username = usernameRef.current?.value as string;
    const password = passwordRef.current?.value as string;

    setIsVisibleLoadIcon(true);
    const data = await AuthService.signin(username, password);

    if (data.success) {
      toast.success(data.data);
      setIsVisibleLoadIcon(false);

      setTimeout(() => (window.location.href = "/"), 3000);
    } else {
      toast.error(data.error.message);
      console.log(data.error);
      setTimeout(() => setIsVisibleLoadIcon(false), 1000);
    }
  };

  return (
    <div className="w-[50%] m-auto mt-20 px-10 flex flex-wrap justify-center gap-5">
      <h3 className="w-full h-10 text-2xl text-emerald-500">Giriş Yap</h3>

      <div className="w-full flex flex-wrap gap-10">
        <div className="w-full h-10">
          <Input type="text" ref={usernameRef} placeholder="Kullanıcı Adı" onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div className="w-full h-10">
          <Input type="password" ref={passwordRef} placeholder="Şifre" onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div className="w-full h-10">
          <Button onClick={signin} bg="emerald">
            {isVisibleLoadIcon ? <Icon _icon={faSpinner} className="animate-spin mr-3" /> : ""}
            Giriş yap
          </Button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signin;
