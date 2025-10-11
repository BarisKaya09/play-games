import React, { useEffect, useRef, useState } from "react";
import { MenuButton } from "./ui";
import Play from "./Play";
import Market from "./Market";
import DailyMarketC from "./DailyMarket";
import InventoryC from "./Inventory";
import Settings from "./Settings";
import EndOfTheWorldBanner from "../../../assets/end-of-the-world.png";
import { InventorySystem, type Personal } from "./lib/inventory-system";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { toast, ToastContainer } from "react-toastify";

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
      <div className="w-full h-10">
        <MenuButton onClick={() => (window.location.href = "/")}>Çıkış</MenuButton>
      </div>
    </div>
  );
};

export type ActiveScreen = "menu" | "play" | "market" | "daily-market" | "inventory" | "settings";

const EndOfTheWorld: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("menu");
  const [inventoryUpdated, setInventoryUpdated] = useState<boolean>(false);
  const inventorySystemRef = useRef(new InventorySystem());

  useEffect(() => {
    (async () => {
      const data = await EndOfTheWorldService.getUserInventory();
      if (data.success) {
        inventorySystemRef.current.setUserID(data.data.user_id);
        inventorySystemRef.current.setPersonal({
          money: data.data.money,
          hp: data.data.hp,
          hunger: data.data.hunger,
          thirst: data.data.thirst,
          energy: data.data.energy,
        } as Personal);

        for (const [i, item] of data.data.items.entries()) {
          inventorySystemRef.current.placeItem(i, item);
        }
      } else {
        toast.error(data.error.message);
        throw data;
      }
    })();
  }, []);

  return (
    <div className={`relative w-[99%] h-[850px] border-2 border-orange-900 rounded-md ${activeScreen != "menu" && "bg-zinc-900"} overflow-hidden`}>
      {activeScreen == "menu" && <img src={EndOfTheWorldBanner} className="absolute left-0 top-0 w-full h-full -z-10 mask-b-from-10%" />}

      {activeScreen == "menu" && (
        <div className="h-full flex items-center">
          <Menu activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
      )}

      {activeScreen == "play" && <Play />}
      {activeScreen == "market" && <Market />}
      {activeScreen == "daily-market" && (
        <DailyMarketC setActiveScreen={setActiveScreen} inventorySystem={inventorySystemRef.current} setInventoryUpdated={setInventoryUpdated} />
      )}
      {activeScreen == "inventory" && (
        <InventoryC setActiveScreen={setActiveScreen} inventorySystem={inventorySystemRef.current} inventoryUpdated={inventoryUpdated} />
      )}
      {activeScreen == "settings" && <Settings />}

      <ToastContainer />
    </div>
  );
};

export default EndOfTheWorld;
