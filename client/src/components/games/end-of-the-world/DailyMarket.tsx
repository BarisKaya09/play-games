import { useEffect, useState } from "react";
import type { DailyMarket, DailyMarketItem } from "../../../services/EndOfTheWorldService";
import { BackMenu, CustomSelect, getItemImg, Grid, Icon, LoadIcon } from "../../ui";
import type { ActiveScreen } from "./EndOfTheWorld";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { toast, ToastContainer } from "react-toastify";
import { faCircleXmark, faCoins, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ItemType, Rarity, ValueType } from "./types";
import { InventorySystem, type Personal } from "./lib/inventory-system";

type BuyItemProps = {
  item: DailyMarketItem;
  setIsVisibleBuyItemMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setCachedDailyMarket: React.Dispatch<React.SetStateAction<DailyMarket>>;
  setDailyMarket: React.Dispatch<React.SetStateAction<DailyMarket>>;
  inventorySystem: InventorySystem;
};
const BuyItemMenu: React.FC<BuyItemProps> = ({ item, setIsVisibleBuyItemMenu, setCachedDailyMarket, setDailyMarket, inventorySystem }) => {
  const [amount, setAmount] = useState<number>(1);
  const [itemBuying, setItemBuying] = useState<boolean>(false);

  const buyItem = async () => {
    setItemBuying(true);
    const data = await EndOfTheWorldService.buyItemInDailyMarket(item.id, amount);
    if (data.success) {
      toast.success(data.data);
      const dailyMarket = await EndOfTheWorldService.getDailyMarket();
      if (dailyMarket.success) {
        setDailyMarket(dailyMarket.data);
        setCachedDailyMarket(dailyMarket.data);
      } else {
        toast.error(dailyMarket.error.message);
      }

      const userInv = await EndOfTheWorldService.getUserInventory();
      if (userInv.success) {
        inventorySystem.setPersonal({
          money: userInv.data.money,
          hp: userInv.data.hp,
          hunger: userInv.data.hunger,
          thirst: userInv.data.thirst,
          energy: userInv.data.energy,
        } as Personal);
      } else {
        toast.error(userInv.error.message);
      }
    } else {
      toast.error(data.error.message);
    }
    setItemBuying(false);
    setIsVisibleBuyItemMenu(false);
  };

  return (
    <div className="absolute min-h-10 top-16 -left-8 bg-zinc-700 z-50 opacity-90 p-1 rounded-lg">
      <div className="w-full text-rose-300">{item.item.name}</div>
      <div className="w-full">
        <input
          className="w-[200px] h-10 rounded-lg p-1 bg-zinc-800 border-zinc-700 outline-none"
          type="number"
          min={1}
          max={item.stock}
          onChange={(e) => {
            if (parseInt(e.target.value) > item.stock) e.target.value = item.stock.toString();
            else if (parseInt(e.target.value) <= 0) e.target.value = "1";
            setAmount(parseInt(e.target.value));
          }}
        />
      </div>
      <div className="w-full h-10 px-1 mt-2 flex gap-2">
        <button className="w-[90px] h-full bg-zinc-800 hover:bg-zinc-900 cursor-pointer duration-300 rounded-lg" onClick={buyItem}>
          {itemBuying && <Icon _icon={faSpinner} className="text-rose-300 w-5 h-5 mr-2 animate-spin" />}
          Satın Al
        </button>
        <button
          className="w-[90px] h-full bg-zinc-800 hover:bg-zinc-900 cursor-pointer duration-300 rounded-lg"
          onClick={() => setIsVisibleBuyItemMenu(false)}
        >
          İptal
        </button>
      </div>
    </div>
  );
};

type DailyMarketGridProps = {
  item: DailyMarketItem;
  setCachedDailyMarket: React.Dispatch<React.SetStateAction<DailyMarket>>;
  setDailyMarket: React.Dispatch<React.SetStateAction<DailyMarket>>;
  inventorySystem: InventorySystem;
};
const DailymarketGrid: React.FC<DailyMarketGridProps> = ({ item, setCachedDailyMarket, setDailyMarket, inventorySystem }) => {
  const [isVisibleBuyItemMenu, setIsVisibleBuyItemMenu] = useState<boolean>(false);

  return (
    <div className="relative w-[140px] h-[120px]">
      {isVisibleBuyItemMenu && (
        <BuyItemMenu
          inventorySystem={inventorySystem}
          item={item}
          setIsVisibleBuyItemMenu={setIsVisibleBuyItemMenu}
          setCachedDailyMarket={setCachedDailyMarket}
          setDailyMarket={setDailyMarket}
        />
      )}
      <Grid rarity={item.item.rarity} onDoubleClick={() => setIsVisibleBuyItemMenu(true)}>
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
    </div>
  );
};

type DailMarketProps = {
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen>>;
  inventorySystem: InventorySystem;
};
const DailyMarketC: React.FC<DailMarketProps> = ({ setActiveScreen, inventorySystem }) => {
  const [dailyMarket, setDailyMarket] = useState<DailyMarket>({} as DailyMarket);
  const [cachedDailyMarket, setCachedDailyMarket] = useState<DailyMarket>({} as DailyMarket);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [isLoadedDailyMarket, setIsLoadedDailyMarket] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setIsLoadedDailyMarket(false);
      const data = await EndOfTheWorldService.getDailyMarket();
      if (data.success) {
        setDailyMarket(data.data);
        setCachedDailyMarket(data.data);
        setIsLoadedDailyMarket(true);
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
      <div className="w-full flex justify-end mb-2">
        <div>
          <Icon _icon={faCoins} className="text-amber-300 mr-2" /> {inventorySystem.getPersonal().money}
        </div>
      </div>

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

      {!isLoadedDailyMarket ? (
        <div className="mt-40">
          <LoadIcon />
        </div>
      ) : (
        <div className="relative w-full max-h-[90%] grid grid-cols-10 auto-rows-max gap-3 overflow-y-auto pb-50">
          {dailyMarket.items?.map((item) => (
            <DailymarketGrid
              item={item}
              setCachedDailyMarket={setCachedDailyMarket}
              setDailyMarket={setDailyMarket}
              inventorySystem={inventorySystem}
            />
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DailyMarketC;
