import { useEffect, useRef, useState } from "react";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { getItemImg, Icon, LoadIcon } from "../../ui";
import { CommonColor, EpicColor, LegendaryColor, RareColor, Rarity, UncommonColor, type Effect, type Item, type RarityColor } from "./types";
import { InventorySystem, type InvGrid } from "./lib/inventory-system";
import { toast, ToastContainer } from "react-toastify";
import { faCaretLeft, faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import LoadAnimate from "../../LoadAnimate";

type InventoryGridProps = {
  item: InvGrid;
  inventorySystem: InventorySystem;
  setInvGrids: React.Dispatch<React.SetStateAction<Array<InvGrid>>>;
};
const InventoryGrid: React.FC<InventoryGridProps> = ({ item, inventorySystem, setInvGrids }) => {
  const rareColor: RarityColor =
    item.inventoryItem?.item.rarity == Rarity.Common
      ? CommonColor
      : item.inventoryItem?.item.rarity == Rarity.Uncommon
      ? UncommonColor
      : item.inventoryItem?.item.rarity == Rarity.Rare
      ? RareColor
      : item.inventoryItem?.item.rarity == Rarity.Epic
      ? EpicColor
      : item.inventoryItem?.item.rarity == Rarity.Legendary
      ? LegendaryColor
      : CommonColor;

  const [isVisibleItemMenu, setIsVisibleItemMenu] = useState<boolean>(false);

  const dragItem = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const dropItem = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.preventDefault();

    const raw = e.dataTransfer.getData("item");
    if (!raw) return;

    const data = JSON.parse(raw) as InvGrid;
    inventorySystem.chnageItemPlace(data, item);
    setInvGrids([...inventorySystem.getInvGrids()]);
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.preventDefault();
  };

  const getItemStack = (): number => {
    if (item.inventoryItem?.item && "stackable" in item.inventoryItem?.item) return item.inventoryItem?.item.stack;
    return 1;
  };

  return (
    <div className="relative w-[140px] h-[120px]">
      {isVisibleItemMenu && !item.empty && item.inventoryItem && (
        <ItemMenu setIsVisibleItemMenu={setIsVisibleItemMenu} item={item.inventoryItem?.item} />
      )}

      <div
        className={`relative w-[140px] h-[120px] bg-zinc-900 border-2 border-zinc-700 ${rareColor} rounded-lg text-sm select-none z-10 border-dashed hover:border-5 duration-100`}
        draggable={!item.empty && true}
        onDragStart={dragItem}
        onDrop={dropItem}
        onDragOver={allowDrop}
        onDoubleClick={() => setIsVisibleItemMenu(true)}
      >
        {!item.empty && <div className="absolute w-5 h-8 text-slate-400 text-lg font-bold -right-4 -top-3">x{getItemStack()}</div>}
        <div className="w-full h-full text-center flex flex-col justify-center">
          <span>{item.inventoryItem?.item.name}</span>
          {!item.empty && <img src={getItemImg(item.inventoryItem?.item.name || "")} className="w-[160px] h-[110px] select-none m-auto -z-10" />}
        </div>
      </div>
    </div>
  );
};

type ItemMenuProps = {
  setIsVisibleItemMenu: React.Dispatch<React.SetStateAction<boolean>>;
  item: Item;
};
const ItemMenu: React.FC<ItemMenuProps> = ({ setIsVisibleItemMenu, item }) => {
  const [isVisibleEffects, setIsVisibleEffects] = useState<boolean>(false);

  return (
    <div className="absolute w-[180px] h-[250px] bg-zinc-700 z-50 rounded-lg shadow-2xl select-none opacity-95">
      <LoadAnimate atype="expansion" duration={1}>
        <div className="w-full h-[40px] flex justify-between p-3 border-b border-zinc-600">
          <span className="text-lg text-yellow-600">{item.name.length > 13 ? item.name.slice(0, 13) + "..." : item.name}</span>
          <div className="w-5 h-full hover:text-rose-500 cursor-pointer" onClick={() => setIsVisibleItemMenu(false)}>
            <Icon _icon={faCrosshairs} />
          </div>
        </div>

        <ul className="w-full h-full mt-4">
          <li className="w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center">Kullan</li>

          <li className="w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center">Sat</li>

          <li
            className="relative w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center"
            onClick={() => setIsVisibleEffects(!isVisibleEffects)}
          >
            <div className="flex justify-between">
              Efektler
              {isVisibleEffects && <Icon _icon={faCaretLeft} className="text-rose-300" />}
            </div>
            {isVisibleEffects && <ItemEffectsFC item={item} />}
          </li>

          <li className="w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center">Ayır</li>
        </ul>
      </LoadAnimate>
    </div>
  );
};

type ItemEffectsProps = {
  item: Item;
};
const ItemEffectsFC: React.FC<ItemEffectsProps> = ({ item }) => {
  const getEffectLevel = (effect: Effect): string => {
    switch (effect) {
      case "very-low":
        return "Çok düşük";
      case "low":
        return "Düşük";
      case "medium":
        return "Orta";
      case "high":
        return "Yüksek";
      case "very-high":
        return "Çok yüksek";
    }
  };

  return (
    <ul className="absolute left-48 w-full min-h-[50px] bg-zinc-700 z-50 rounded-lg shadow-2xl select-non">
      {"effects" in item ? (
        item.effects.map((effect) => (
          <li className="w-full min-h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center mb-2">
            <div>{effect.description}</div>
            <div className="text-rose-300">{getEffectLevel(effect.effect)}</div>
          </li>
        ))
      ) : (
        <li className="w-full min-h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center mb-2">
          İtemin Efekti yok
        </li>
      )}
    </ul>
  );
};

const InventoryC: React.FC = () => {
  const inventorySystemRef = useRef(new InventorySystem());
  const [invGrids, setInvGrids] = useState<Array<InvGrid>>(inventorySystemRef.current.getInvGrids());

  const [isLoadedInventory, setIsLoadedInventory] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await EndOfTheWorldService.getUserInventory();
      if (data.success) {
        inventorySystemRef.current.setUserID(data.data.user_id);
        inventorySystemRef.current.setMoney(data.data.money);

        for (const [i, item] of data.data.items.entries()) {
          inventorySystemRef.current.placeItem(i, item);
        }

        setIsLoadedInventory(true);
      } else {
        toast.error(data.error.message);
        throw data;
      }
    })();
  }, []);

  return (
    <div className="relative w-full h-full p-10 grid grid-cols-10 gap-7 overflow-y-auto">
      {!isLoadedInventory && (
        <div className="absolute w-full h-full flex flex-col justify-center">
          <LoadIcon />
        </div>
      )}

      {isLoadedInventory &&
        invGrids.map((item) => (
          <div className="w-[100px] h-[100px]">
            <InventoryGrid key={item.index} item={item} inventorySystem={inventorySystemRef.current} setInvGrids={setInvGrids} />
          </div>
        ))}

      <ToastContainer />
    </div>
  );
};

export default InventoryC;
