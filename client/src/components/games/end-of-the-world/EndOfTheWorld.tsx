import React, { useState } from "react";
import { MenuButton } from "./ui";
import Play from "./Play";
import Market from "./Market";
import DailyMarket from "./DailyMarket";
import InventoryC from "./Inventory";
import Settings from "./Settings";

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

type ActiveScreen = "menu" | "play" | "market" | "daily-market" | "inventory" | "settings";

const EndOfTheWorld: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("menu");

  return (
    <div className="w-[99%] h-[850px] border-2 border-orange-900 rounded-md bg-zinc-900">
      {activeScreen == "menu" && (
        <div className="h-full flex items-center">
          <Menu activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
      )}

      {activeScreen == "play" && <Play />}
      {activeScreen == "market" && <Market />}
      {activeScreen == "daily-market" && <DailyMarket />}
      {activeScreen == "inventory" && <InventoryC />}
      {activeScreen == "settings" && <Settings />}
    </div>
  );
};

export default EndOfTheWorld;
