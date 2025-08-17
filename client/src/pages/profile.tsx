import React, { useState, useEffect } from "react";
import Profile from "../components/profile/Profile";
import AuthService from "../services/AuthService";
import { Icon } from "../components/ui";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ProfilePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await AuthService.isLoggedIn();
      if (data.success) {
        setIsLoggedIn(data.data);
      }
      setTimeout(() => setIsLoaded(true), 1000);
    })();
  }, []);

  if (isLoaded) {
    if (isLoggedIn) {
      return (
        <div>
          <Profile />
        </div>
      );
    } else {
      window.location.href = "/";
    }
  } else {
    return (
      <div className="w-full text-7xl flex justify-center mt-80">
        <Icon _icon={faSpinner} className="animate-spin text-rose-500" />
      </div>
    );
  }
};

export default ProfilePage;
