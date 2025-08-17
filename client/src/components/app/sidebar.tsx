import React, { useState, useEffect } from "react";
import { Button, Icon } from "../ui";
import { faCircleArrowLeft, faHome, faRightToBracket, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";

type SideBarLinkProps = {
  children: any;
  to: string;
};
const SideBarLink: React.FC<SideBarLinkProps> = ({ children, to }) => {
  return (
    <a href={to} className="block w-[250px] h-9 bg-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800 duration-300 px-5 leading-8">
      {children}
    </a>
  );
};

const SideBar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await AuthService.isLoggedIn();
      if (data.success) {
        setIsLoggedIn(data.data);
      } else {
        throw new Error(`[ ${data.error.error} ] => ${data.error.message}`);
      }
    })();
  }, []);

  const logout = async () => {
    const data = await AuthService.logout();
    if (data.success) {
      toast.success(data.data);
      setIsLoggedIn(false);
      setTimeout(() => (window.location.href = "/"), 500);
    } else {
      toast.error(data.error.message);
      console.log(data.error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-[15%] h-full p-5 justify-between">
      <div className="w-full h-[70%]">
        <ul className="w-full flex flex-wrap gap-5">
          <li>
            <SideBarLink to={"/"}>
              <Icon _icon={faHome} className="mr-3" />
              <span>Ana Sayfa</span>
            </SideBarLink>
          </li>
        </ul>
      </div>

      <div className="w-full h-[30%]">
        <ul className="w-full h-full flex flex-col gap-5 justify-end">
          {!isLoggedIn && (
            <li>
              <SideBarLink to={"/signin"}>
                <Icon _icon={faRightToBracket} className="mr-3" />
                <span>Giriş Yap</span>
              </SideBarLink>
            </li>
          )}

          {!isLoggedIn && (
            <li>
              <SideBarLink to={"/signup"}>
                <Icon _icon={faUserPlus} className="mr-3" />
                <span>Kayıt Ol</span>
              </SideBarLink>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <SideBarLink to={"/profile"}>
                <Icon _icon={faUser} className="mr-3" />
                Profile
              </SideBarLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Button onClick={logout} bg="rose" style={{ width: "100%" }}>
                <Icon _icon={faCircleArrowLeft} className="mr-3" />
                Çıkış Yap
              </Button>
            </li>
          )}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SideBar;
