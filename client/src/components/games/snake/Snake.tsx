import React, { useEffect, useRef, useState } from "react";
import ComeBack from "../ComeBack";
import { CANVAS_HEIGHT, CANVAS_WIDTH, SnakeGame, MAX_SNAKE_HP, type Listener } from "./snake-game";
import { Button, Icon, InfoBox, StatisticBox } from "../../ui";
import { faAppleWhole, faHeart, faRankingStar, faSpinner } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../../services/AuthService";
import SnakeGameService, { type SnakeGameRecordStatistics } from "../../../services/SnakeGameService";
import { toast, ToastContainer } from "react-toastify";

type SnakeGameStartButtonProps = {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
};
const SnakeGameStartButton: React.FC<SnakeGameStartButtonProps> = ({ setIsStarted, isLoggedIn }) => {
  return (
    <div className="absolute w-full h-full left-0 top-0 bg-black opacity-90">
      <div className="w-full mt-52 flex justify-center">
        <Button onClick={() => setIsStarted(true)} bg="indigo" style={{ width: "300px", height: "60px", marginTop: "100px" }}>
          Başlat
        </Button>
      </div>
      {!isLoggedIn && (
        <div className="w-full flex justify-center mt-20">
          <InfoBox width={"500px"} height={"60px"}>
            Giriş yapmadınız. Bu yüzden oyun verileriniz kaydedilemeyecek!
          </InfoBox>
        </div>
      )}
    </div>
  );
};

type SnakeGameUIProps = {
  hp: number | undefined;
  appleCount: number;
  playTime: string;
  recordAppleCount: number;
};
const SnakeGameUI: React.FC<SnakeGameUIProps> = ({ hp, appleCount, playTime, recordAppleCount }) => {
  return (
    <div className="absolute left-10 -top-16 w-full h-12 px-20 py-3 flex justify-between select-none">
      <div className="h-full flex gap-2 text-4xl">
        {/* //TODO: Burası dinamik değil. sonra düzelt */}
        {Array(hp)
          .fill(0)
          .map((_) => (
            <div>
              <Icon _icon={faHeart} className="text-rose-500" />
            </div>
          ))}
      </div>

      <div></div>
      <div className="h-12 text-3xl px-1 text-slate-500 border-4 border-slate-500 bg-slate-800 rounded-lg inset-shadow-sm inset-shadow-slate-900">
        {playTime}
      </div>
      <div></div>

      <div className="flex gap-5">
        <div className="h-12 text-3xl flex gap-1">
          <Icon _icon={faAppleWhole} className="text-emerald-500" />
          <div className="text-slate-500">{appleCount}</div>
        </div>

        <div className="h-12 text-3xl flex gap-1">
          <Icon _icon={faRankingStar} className="text-yellow-500" />
          <div className="text-slate-500">{recordAppleCount}</div>
        </div>
      </div>
    </div>
  );
};

type ResultProps = {
  result: ResultT;
};
const Result: React.FC<ResultProps> = ({ result }) => {
  const [isSavedRecord, setIsSavedRecord] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsSavedRecord(false);
      const data = await SnakeGameService.saveSnakeGameRecord({ ...result } as SnakeGameRecordStatistics);
      if (data.success) {
        toast.success(data.data);
      } else {
        toast.error(data.error.message);
      }
      setIsSavedRecord(true);
    })();
  }, []);

  return (
    <div className="w-full h-[500px] bg-[#111111] p-10 rounded-lg shadow-xl mt-10">
      <h3 className="w-full h-10 text-2xl text-sky-500 border-b border-sky-500">Sonuçlar</h3>

      <div className="w-full flex flex-wrap justify-center gap-5 mt-30">
        <StatisticBox title="Oynanan Süre" statistic={result.playTime} color="emerald" />

        <StatisticBox title="Yenilen Elma Sayısı" statistic={result.appleCount} color="rose" />

        <StatisticBox title="Duvar Sayısı" statistic={result.wallCount} color="yellow" />
      </div>

      <Button onClick={() => window.location.reload()} bg="indigo" style={{ marginTop: "50px" }} disabled={isSavedRecord != true}>
        {isSavedRecord == false && <Icon _icon={faSpinner} className="animate-spin" />}
        Kapat
      </Button>
    </div>
  );
};

type ResultT = {
  playTime: string;
  appleCount: number;
  wallCount: number;
};
const Snake: React.FC = () => {
  const snakeGameRef = useRef<SnakeGame>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [hp, setHP] = useState<number>(MAX_SNAKE_HP);
  const [appleCount, setAppleCount] = useState<number>(0);
  const [playTime, setPlayTime] = useState<string>("");
  const [died, setDied] = useState<boolean>(false);
  const [result, setResult] = useState<ResultT>({} as ResultT);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [snakeGameRecord, setSnakeGameRecord] = useState<SnakeGameRecordStatistics>({} as SnakeGameRecordStatistics);

  useEffect(() => {
    (async () => {
      const data = await AuthService.isLoggedIn();
      if (data.success) {
        setIsLoggedIn(data.data);
      } else {
        throw data.error.message;
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await SnakeGameService.getSnakeGameRecord();
      if (data.success) {
        setSnakeGameRecord(data.data);
      } else {
        throw data.error.message;
      }
    })();
  }, []);

  useEffect(() => {
    const snakeGame = new SnakeGame();
    snakeGameRef.current = snakeGame;

    // --------------- listeners ---------------
    const updateIsStarted: Listener = (self: SnakeGame) => {
      if (isStarted != self.state.getIsStarted()) {
        setIsStarted(self.state.getIsStarted());
      }
    };

    const updateHP: Listener = (self: SnakeGame) => {
      if (hp != self.snake.getHP()) {
        setHP(self.snake.getHP());
      }
    };

    const updateAppleCount = (self: SnakeGame) => {
      if (appleCount != self.state.getAppleCount()) {
        setAppleCount(self.state.getAppleCount());
      }
    };

    const updatePlayTime = (self: SnakeGame) => {
      if (playTime != self.state.getPlayTime()) {
        setPlayTime(self.state.getPlayTime());
      }
    };

    const updateDied = (self: SnakeGame) => {
      if (died != self.state.isDied()) {
        setDied(self.state.isDied());
      }
    };

    const updateResult = (self: SnakeGame) => {
      if (self.state.isDied()) {
        setResult({ playTime: self.state.getPlayTime(), appleCount: self.state.getAppleCount(), wallCount: self.state.getWalls().length });
      }
    };

    snakeGame.subscribe(updateIsStarted);
    snakeGame.subscribe(updateHP);
    snakeGame.subscribe(updateAppleCount);
    snakeGame.subscribe(updatePlayTime);
    snakeGame.subscribe(updateDied);
    snakeGame.subscribe(updateResult);
    // --------------- listeners ---------------

    snakeGame.start();

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLocaleLowerCase()) {
        case "a":
          snakeGame.snake.setDirection("left");
          break;
        case "d":
          snakeGame.snake.setDirection("right");
          break;
        case "w":
          snakeGame.snake.setDirection("up");
          break;
        case "s":
          snakeGame.snake.setDirection("down");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    snakeGameRef.current?.subscribe((self: SnakeGame) => self.state.setIsStarted(isStarted));
    // sneakGameRef.current?.state.setIsStarted(isStarted);
  }, [isStarted]);

  return (
    <div className="px-30 py-10">
      <ComeBack />
      <div className="w-full h-full relative">
        {!died && <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-2 border-indigo-900 m-auto mt-7" id="snake-game-canvas" />}

        {!died ? (
          <div>
            {!isStarted && <SnakeGameStartButton setIsStarted={setIsStarted} isLoggedIn={isLoggedIn} />}
            {/*//TODO UI menüleri oyun başladığında gözükecek. şimdilik böyle değil. (sonra düzelt) */}
            {isStarted && <SnakeGameUI hp={hp} appleCount={appleCount} playTime={playTime} recordAppleCount={snakeGameRecord.appleCount} />}
          </div>
        ) : (
          <div>{died && <Result result={result} />}</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Snake;
