import React, { useState } from "react";
import { MenuButton } from "./ui";
import Play from "./Play";
import Market from "./Market";
import DailyMarket from "./DailyMarket";
import InventoryC from "./Inventory";
import Settings from "./Settings";
import EndOfTheWorldBanner from "../../../assets/end-of-the-world.png";

type MenuProps = {
  activeScreen: ActiveScreen;
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen>>;
};
const Menu: React.FC<MenuProps> = ({ setActiveScreen }) => {
  return (
    <div className="w-[300px] min-h-20 flex flex-wrap m-auto items-center gap-5">
      <div className="w-full h-10">
        <MenuButton onClick={() => setActiveScreen("play")}>Oyna</MenuButton>
      </div>
      <div className="w-full h-10">
        <MenuButton onClick={() => setActiveScreen("market")}>Market</MenuButton>
      </div>
      <div className="w-full h-10">
        <MenuButton onClick={() => setActiveScreen("daily-market")}>Günlük Market</MenuButton>
      </div>
      <div className="w-full h-10">
        <MenuButton onClick={() => setActiveScreen("inventory")}>Envanter</MenuButton>
      </div>
      <div className="w-full h-10">
        <MenuButton onClick={() => setActiveScreen("settings")}>Ayarlar</MenuButton>
      </div>
    </div>
  );
};

export type ActiveScreen = "menu" | "play" | "market" | "daily-market" | "inventory" | "settings";

const EndOfTheWorld: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("menu");

  return (
    <div className={`relative w-[99%] h-[850px] border-2 border-orange-900 rounded-md ${activeScreen != "menu" && "bg-zinc-900"}`}>
      {activeScreen == "menu" && <img src={EndOfTheWorldBanner} className="absolute left-0 top-0 w-full h-full -z-10 mask-b-from-10%" />}

      {activeScreen == "menu" && (
        <div className="h-full flex items-center">
          <Menu activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
      )}

      {activeScreen == "play" && <Play />}
      {activeScreen == "market" && <Market />}
      {activeScreen == "daily-market" && <DailyMarket />}
      {activeScreen == "inventory" && <InventoryC setActiveScreen={setActiveScreen} />}
      {activeScreen == "settings" && <Settings />}
    </div>
  );
};

export default EndOfTheWorld;
