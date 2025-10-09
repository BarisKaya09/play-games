import { useEffect, useState } from "react";
import type { DailyMarket } from "../../../services/EndOfTheWorldService";
import { BackMenu, CustomSelect, getItemImg, Grid, Icon, Input } from "../../ui";
import type { ActiveScreen } from "./EndOfTheWorld";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { toast, ToastContainer } from "react-toastify";
import { faCircleXmark, faCoins } from "@fortawesome/free-solid-svg-icons";
import { ItemType, Rarity, ValueType } from "./types";

type DailMarketProps = {
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen>>;
};
const DailyMarketC: React.FC<DailMarketProps> = ({ setActiveScreen }) => {
  const [dailyMarket, setDailyMarket] = useState<DailyMarket>({} as DailyMarket);
  const [cachedDailyMarket, setCachedDailyMarket] = useState<DailyMarket>({} as DailyMarket);
  const [filtered, setFiltered] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await EndOfTheWorldService.getDailyMarket();
      if (data.success) {
        setDailyMarket(data.data);
        setCachedDailyMarket(data.data);
      } else {
        toast.error(data.error.message);
      }
    })();
  }, []);

  const searchItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length == 0) {
      setDailyMarket(cachedDailyMarket);
      setFiltered(false);
      return;
    }
    const items = cachedDailyMarket.items.filter((item) => item.item.name.slice(0, text.length).toLowerCase() == text.toLowerCase());
    setDailyMarket((prev) => ({ id: prev.id, items: items } as DailyMarket));
    setFiltered(true);
  };

  const filterByRarity = (option: string) => {
    const opt = option as Rarity;
    setDailyMarket((prev) => ({ id: prev.id, items: cachedDailyMarket.items.filter((item) => item.item.rarity == opt) } as DailyMarket));
    setFiltered(true);
  };

  const filterByItemType = (option: string) => {
    const opt = option as ItemType;
    setDailyMarket((prev) => ({ id: prev.id, items: cachedDailyMarket.items.filter((item) => item.item.itemType == opt) } as DailyMarket));
    setFiltered(true);
  };

  const filterByValue = (option: string) => {
    const opt = option as ValueType;
    setDailyMarket(
      (prev) =>
        ({
          id: prev.id,
          items: [...cachedDailyMarket.items].sort((a, b) => (opt == ValueType.Up ? b.value - a.value : a.value - b.value)), //! burada cachedDailyMarket'i başka bir arraye kopyalanmasının sebebi sort fonksiyonu referansı değiştirdiği için, filtreleri kaldır düzgün çalışmıyor
        } as DailyMarket)
    );
    setFiltered(true);
  };

  return (
    <div className="w-full h-full p-5">
      <BackMenu setActiveScreen={setActiveScreen} />

      <div className="w-full h-[10%] flex justify-between">
        <div className="w-[20%] h-12">
          <input
            type="text"
            placeholder="Öge İsmi"
            className="w-full h-full border-2 border-zinc-700 px-2 rounded-md focus:border-zinc-800 outline-none text-rose-300"
            onChange={searchItem}
          />
        </div>

        <div className="w-[80%] h-12 flex justify-end gap-3">
          {filtered && (
            <div
              className="w-[200px] h-full flex flex-col justify-center text-lg cursor-pointer hover:text-rose-300 duration-300"
              onClick={() => {
                setDailyMarket(cachedDailyMarket);
                setFiltered(false);
              }}
            >
              <div>
                <Icon _icon={faCircleXmark} className="text-rose-300 mr-2 text-xl" />
                Tüm filtreleri kaldır
              </div>
            </div>
          )}

          <CustomSelect
            width="170px"
            height="100%"
            options={[Rarity.Common, Rarity.Uncommon, Rarity.Rare, Rarity.Epic, Rarity.Legendary]}
            text="Nadirlik"
            selectOption={filterByRarity}
          />

          <CustomSelect
            width="170px"
            height="100%"
            options={[ItemType.Food, ItemType.Clothes, ItemType.Weapon, ItemType.Bullet, ItemType.Medical, ItemType.Container, ItemType.Valuable]}
            text="Öge Türü"
            selectOption={filterByItemType}
          />

          <CustomSelect width="170px" height="100%" options={[ValueType.Up, ValueType.Down]} text="Fiyat" selectOption={filterByValue} />
        </div>
      </div>

      <div className="relative w-full max-h-[90%] grid grid-cols-10 auto-rows-max gap-3 overflow-y-auto pb-22">
        {dailyMarket.items?.map((item) => (
          <Grid rarity={item.item.rarity}>
            <div className="w-full h-full text-center flex flex-col justify-center">
              <span>{item.item.name}</span>
              <img src={getItemImg(item.item.name || "")} className="w-[160px] h-[110px] select-none m-auto -z-10" />
            </div>

            <div className="absolute w-full h-8 flex justify-between -bottom-3 px-1">
              <div className="text-md font-bold">
                <Icon _icon={faCoins} className="mr-2 text-amber-300" />
                {item.value}
              </div>
              <div className="w-5 h-8 text-slate-400 text-md font-bold right-2 -bottom-2">x{item.stock}</div>
            </div>
          </Grid>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default DailyMarketC;
