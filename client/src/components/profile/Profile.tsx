import React, { useEffect, useState } from "react";
import ComeBack from "../games/ComeBack";
import { toast, ToastContainer } from "react-toastify";
import { Button, Icon, Input, LoadIcon, StatisticBox } from "../ui";
import { faCrosshairs, faPager, faPencil } from "@fortawesome/free-solid-svg-icons";
import type { FastTypingStatistics } from "../../services/FastTypingService";
import FastTypingService from "../../services/FastTypingService";
import AccountService from "../../services/AccountService";
import type { SnakeGameRecordStatistics } from "../../services/SnakeGameService";
import SnakeGameService from "../../services/SnakeGameService";

type ProfileBoxWrapperProps = {
  title: string;
  children?: any;
};
const ProfileBoxWrapper: React.FC<ProfileBoxWrapperProps> = ({ title, children }) => {
  return (
    <div className="relative w-[65%] min-h-[150px] border-2 border-[#111111] mt-2 rounded-lg shadow-lg p-5">
      <h3 className="absolute text-sky-500 -top-[18px] text-2xl shadow-xl w-full">{title}</h3>
      {children}
    </div>
  );
};

type ProfileBoxProps = {
  children?: any;
};
const ProfileBox: React.FC<ProfileBoxProps> = ({ children }) => {
  return <div className="w-full min-h-[100px] hover:bg-[#0e0e0e] cursor-pointer border-b border-[#111111] rounded-lg">{children}</div>;
};

const Account: React.FC = () => {
  const [account, setAccount] = useState<{ username: string; email: string }>({} as { username: string; email: string });

  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const data = await AccountService.getAccount();
      if (data.success) {
        setAccount(data.data);
      } else {
        toast.error(data.error.message);
      }
    })();
  }, []);

  const changeUsername = async () => {
    const data = await AccountService.changeUsername(newUsername);
    if (data.success) {
      toast.success(data.data);

      const accountData = await AccountService.getAccount();
      if (accountData.success) {
        setAccount(accountData.data);
      } else {
        toast.error(accountData.error.message);
      }
    } else {
      toast.error(data.error.message);
    }
    setIsEditingUsername(false);
  };

  const changeEmail = async () => {
    const data = await AccountService.changeEmail(newEmail);
    if (data.success) {
      toast.success(data.data);
      setIsEditingEmail(true);

      const accountData = await AccountService.getAccount();
      if (accountData.success) {
        setAccount(accountData.data);
      } else {
        toast.error(accountData.error.message);
      }
    } else {
      toast.error(data.error.message);
    }
    setIsEditingEmail(false);
  };

  return (
    <ProfileBoxWrapper title={"Hesap"}>
      <ProfileBox>
        <div className="w-full h-full px-5 flex gap-5 justify-center">
          <div className="mt-5 flex gap-3">
            <h3 className="text-xl leading-10 text-stone-600">Kullanıcı Adı</h3>
            <Input type={"text"} placeholder={account.username} disabled={!isEditingUsername} onChange={(e) => setNewUsername(e.target.value)} />

            <Button
              onClick={() => setIsEditingUsername(!isEditingUsername)}
              bg={!isEditingUsername ? "indigo" : "rose"}
              style={{ width: "50px", marginTop: "4px" }}
            >
              <Icon _icon={!isEditingUsername ? faPencil : faCrosshairs} />
            </Button>

            <Button onClick={changeUsername} bg="emerald" style={{ width: "50px", marginTop: "4px" }} disabled={!isEditingUsername}>
              <Icon _icon={faPager} />
            </Button>
          </div>
        </div>
      </ProfileBox>

      <ProfileBox>
        <div className="w-full h-full px-5 flex gap-5 justify-center">
          <div className="mt-5 flex gap-3">
            <h3 className="text-xl leading-10 text-stone-600 mr-14">Email</h3>
            <Input type={"email"} placeholder={account.email} disabled={!isEditingEmail} onChange={(e) => setNewEmail(e.target.value)} />

            <Button
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              bg={!isEditingEmail ? "indigo" : "rose"}
              style={{ width: "50px", marginTop: "4px" }}
            >
              <Icon _icon={!isEditingEmail ? faPencil : faCrosshairs} />
            </Button>

            <Button onClick={changeEmail} bg="emerald" style={{ width: "50px", marginTop: "4px" }} disabled={!isEditingEmail}>
              <Icon _icon={faPager} />
            </Button>
          </div>
        </div>
      </ProfileBox>

      <ProfileBox>
        <div className="w-full h-full px-5 flex gap-5 justify-center">
          <div className="mt-5 flex gap-3">
            <h3 className="text-xl leading-10 text-stone-600 mr-14">Şifre</h3>
            <Input type={"password"} placeholder={"*********************"} disabled={true} />

            <Button onClick={() => {}} bg="indigo" style={{ width: "50px", marginTop: "4px" }}>
              <Icon _icon={faPencil} />
            </Button>

            <Button onClick={() => {}} bg="emerald" style={{ width: "50px", marginTop: "4px" }} disabled={!isEditingUsername}>
              <Icon _icon={faPager} />
            </Button>
          </div>
        </div>
      </ProfileBox>
    </ProfileBoxWrapper>
  );
};

const FastTypingGameStatistics: React.FC = () => {
  const [fastTypingGameStatistics, setFastTypingGameStatistics] = useState<FastTypingStatistics>({} as FastTypingStatistics);
  const [isVisibleLoadIcon, setIsVisibleLoadIcon] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await FastTypingService.getStatistics();
      if (data.success) {
        setFastTypingGameStatistics(data.data);
      } else {
        toast.error(data.error.message);
      }
      setIsVisibleLoadIcon(true);
    })();
  }, []);

  return (
    <ProfileBoxWrapper title="Hızlı Yazma Oyunu İstatistiğiniz">
      {isVisibleLoadIcon ? (
        <ProfileBox>
          <div className="w-full flex flex-wrap justify-center gap-5 mt-5 p-3">
            <StatisticBox
              title="Doğru Kelime Sayısı"
              statistic={fastTypingGameStatistics.correctWords}
              brackets={fastTypingGameStatistics.wpm}
              color="emerald"
            />
            <StatisticBox
              title="Yanlış Kelime Sayısı"
              statistic={fastTypingGameStatistics.wrongWords}
              brackets={fastTypingGameStatistics.wpm}
              color="rose"
            />
            <StatisticBox title="Dakika Başına Kelime" statistic={fastTypingGameStatistics.wpm} color="yellow" />
            <StatisticBox title="Kelime Doğruluğu" statistic={fastTypingGameStatistics.totalWordAccuracy + "%"} color="violet" />
          </div>
        </ProfileBox>
      ) : (
        <div className="mt-5">
          <LoadIcon />
        </div>
      )}
    </ProfileBoxWrapper>
  );
};

const SnakeGameRecord: React.FC = () => {
  const [isVisibleLoadIcon, setIsVisibleLoadIcon] = useState<boolean>(false);
  const [snakeGameRecord, setSnakeGameRecord] = useState<SnakeGameRecordStatistics>({} as SnakeGameRecordStatistics);

  useEffect(() => {
    (async () => {
      const data = await SnakeGameService.getSnakeGameRecord();
      if (data.success) {
        setSnakeGameRecord(data.data);
      } else {
        throw data.error.message;
      }
      setIsVisibleLoadIcon(true);
    })();
  }, []);

  return (
    <ProfileBoxWrapper title="Yılan Oyunu Rekorunuz">
      {isVisibleLoadIcon ? (
        <ProfileBox>
          <div className="w-full flex flex-wrap justify-center gap-5 mt-5 p-3">
            <StatisticBox title="Oyun Süresi" statistic={snakeGameRecord.playTime} color="emerald" />
            <StatisticBox title="Yenilen Elma Sayısı" statistic={snakeGameRecord.appleCount} color="rose" />
            <StatisticBox title="Duvar Sayısı" statistic={snakeGameRecord.wallCount} color="yellow" />
          </div>
        </ProfileBox>
      ) : (
        <div className="mt-5">
          <LoadIcon />
        </div>
      )}
    </ProfileBoxWrapper>
  );
};

const Profile: React.FC = () => {
  return (
    <div className="px-30 py-10">
      <div className="w-full h-full flex">
        <ComeBack />
      </div>

      <div className="w-full mt-20 flex justify-center">
        <Account />
      </div>

      <div className="w-full mt-20 flex justify-center">
        <FastTypingGameStatistics />
      </div>

      <div className="w-full mt-20 flex justify-center">
        <SnakeGameRecord />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
