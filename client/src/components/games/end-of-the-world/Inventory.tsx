import { useState } from "react";
import EndOfTheWorldService, { type InventoryItem } from "../../../services/EndOfTheWorldService";
import { BackMenu, Button, getItemImg, Grid, Icon } from "../../ui";
import { type Effect, type Item } from "./types";
import { InventorySystem, type InvGrid, type Personal } from "./lib/inventory-system";
import { toast, ToastContainer } from "react-toastify";
import { faBolt, faCaretLeft, faCoins, faCrosshairs, faDroplet, faHeart, faUtensils } from "@fortawesome/free-solid-svg-icons";
import LoadAnimate from "../../LoadAnimate";
import type { ActiveScreen } from "./EndOfTheWorld";
import { ItemTypeTag } from "./ui";

type InventoryGridProps = {
  item: InvGrid;
  inventorySystem: InventorySystem;
  setInvGrids: React.Dispatch<React.SetStateAction<Array<InvGrid>>>;
};
const InventoryGrid: React.FC<InventoryGridProps> = ({ item, inventorySystem, setInvGrids }) => {
  const [isVisibleItemMenu, setIsVisibleItemMenu] = useState<boolean>(false);

  const dragItem = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const dropItem = async (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.preventDefault();

    const raw = e.dataTransfer.getData("item");
    if (!raw) return;

    const data = JSON.parse(raw) as InvGrid;
    if (!data.empty && data.inventoryItem?.item.name == item.inventoryItem?.item.name) {
      const ciData = await EndOfTheWorldService.concatItems(item.inventoryItem as InventoryItem, data.inventoryItem as InventoryItem);
      if (ciData.success) {
        toast.success(ciData.data);

        const userInventory = await EndOfTheWorldService.getUserInventory();
        if (userInventory.success) {
          inventorySystem.clearInvGrids();

          for (const [i, item] of userInventory.data.items.entries()) {
            inventorySystem.placeItem(i, item);
          }
        } else {
          toast.error(userInventory.error.message);
          throw userInventory;
        }
      } else {
        inventorySystem.chnageItemPlace(data, item);
      }
    } else {
      inventorySystem.chnageItemPlace(data, item);
    }
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
        <ItemMenu setIsVisibleItemMenu={setIsVisibleItemMenu} item={item.inventoryItem} inventorySystem={inventorySystem} setInvGrids={setInvGrids} />
      )}

      <Grid
        rarity={item.inventoryItem?.item.rarity}
        draggable={!item.empty && true}
        onDragStart={dragItem}
        onDrop={dropItem}
        onDragOver={allowDrop}
        onDoubleClick={() => setIsVisibleItemMenu(true)}
      >
        {!item.empty && item.inventoryItem && "stackable" in item.inventoryItem.item && item.inventoryItem.item.stackable && (
          <div className="absolute w-5 h-8 text-slate-400 text-md font-bold right-2 -bottom-2">x{getItemStack()}</div>
        )}

        {!item.empty && item.inventoryItem && (
          <div className="absolute -left-10 top-13 -rotate-90">
            <ItemTypeTag itemType={item.inventoryItem.item.itemType} />
          </div>
        )}

        <div className="w-full h-full text-center flex flex-col justify-center">
          <span>{item.inventoryItem?.item.name}</span>
          {!item.empty && <img src={getItemImg(item.inventoryItem?.item.name || "")} className="w-[160px] h-[110px] select-none m-auto -z-10" />}
        </div>
      </Grid>
    </div>
  );
};

type ItemMenuProps = {
  item: InventoryItem;
  setIsVisibleItemMenu: React.Dispatch<React.SetStateAction<boolean>>;
  inventorySystem: InventorySystem;
  setInvGrids: React.Dispatch<React.SetStateAction<Array<InvGrid>>>;
};
const ItemMenu: React.FC<ItemMenuProps> = ({ setIsVisibleItemMenu, item, inventorySystem, setInvGrids }) => {
  const [isVisibleEffects, setIsVisibleEffects] = useState<boolean>(false);
  const [isVisibleSplitItemStackMenu, setIsVisibleSplitItemStackMenu] = useState<boolean>(false);

  const useItem = async () => {
    const data = await EndOfTheWorldService.useItem(item.itemID);
    if (data.success) {
      toast.success(data.data);
      const inv = await EndOfTheWorldService.getUserInventory();
      if (inv.success) {
        for (const [i, item] of inv.data.items.entries()) {
          inventorySystem.placeItem(i, item);
        }

        setInvGrids([...inventorySystem.getInvGrids()]);
        inventorySystem.setPersonal({
          money: inv.data.money,
          hp: inv.data.hp,
          hunger: inv.data.hunger,
          thirst: inv.data.thirst,
          energy: inv.data.energy,
        } as Personal);
        setIsVisibleItemMenu(false);
      }
    } else {
      toast.error(data.error.message);
    }
  };

  return (
    <div className="absolute w-[180px] h-[260px] bg-zinc-700 z-50 rounded-lg shadow-2xl select-none opacity-95 p-1">
      <LoadAnimate atype="expansion" duration={1}>
        <div className="w-full h-[40px] flex justify-between p-3 border-b border-zinc-600">
          <span className="text-lg text-yellow-600">{item.item.name.length > 13 ? item.item.name.slice(0, 13) + "..." : item.item.name}</span>
          <div className="w-5 h-full hover:text-rose-500 cursor-pointer" onClick={() => setIsVisibleItemMenu(false)}>
            <Icon _icon={faCrosshairs} />
          </div>
        </div>

        <ul className="w-full h-full mt-4">
          <li
            className="w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 rounded-lg duration-300 flex flex-col justify-center"
            onClick={useItem}
          >
            Kullan
          </li>

          <li className="w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 rounded-lg duration-300 flex flex-col justify-center">
            Sat
          </li>

          <li
            className="relative w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 rounded-lg duration-300 flex flex-col justify-center"
            onClick={() => setIsVisibleEffects(!isVisibleEffects)}
          >
            <div className="flex justify-between">
              Efektler
              {isVisibleEffects && <Icon _icon={faCaretLeft} className="text-rose-300 mt-1" />}
            </div>
            {isVisibleEffects && <ItemEffectsFC item={item.item} />}
          </li>

          <li
            className="w-full h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 rounded-lg duration-300 flex flex-col justify-center"
            onClick={() => setIsVisibleSplitItemStackMenu(true)}
          >
            <div className="flex justify-between">
              Ayır
              {isVisibleSplitItemStackMenu && "stackable" in item.item && item.item.stack > 1 && (
                <Icon _icon={faCaretLeft} className="text-rose-300" />
              )}
            </div>
          </li>
          {isVisibleSplitItemStackMenu && (
            <li className="w-full h-12 px-2 cursor-pointer hover:text-gray-400 duration-300 flex flex-col justify-center">
              {isVisibleSplitItemStackMenu && "stackable" in item.item && item.item.stack > 1 && (
                <SplitItemStackMenu
                  item={item}
                  setIsVisibleSplitItemStackMenu={setIsVisibleSplitItemStackMenu}
                  inventorySystem={inventorySystem}
                  setInvGrids={setInvGrids}
                  setIsVisibleItemMenu={setIsVisibleItemMenu}
                />
              )}
            </li>
          )}
        </ul>
      </LoadAnimate>
    </div>
  );
};

type DropDownMenuULProps = {
  children: any;
};
const DropDownMenuUL: React.FC<DropDownMenuULProps> = ({ children }) => {
  return <ul className="absolute left-48 w-full min-h-[50px] bg-zinc-700 z-50 rounded-lg shadow-2xl select-none p-1">{children}</ul>;
};

type DropDownMenuLIProps = {
  children: any;
};
const DropDownMenuLI: React.FC<DropDownMenuLIProps> = ({ children }) => {
  return (
    <li className="w-full min-h-12 px-2 cursor-pointer hover:bg-zinc-800 hover:text-gray-400 duration-300 flex flex-col justify-center rounded-lg">
      {children}
    </li>
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
    <DropDownMenuUL>
      {"effects" in item ? (
        item.effects.map((effect) => (
          <DropDownMenuLI>
            <div>{effect.description}</div>
            <div className="text-rose-300">{getEffectLevel(effect.effect)}</div>
          </DropDownMenuLI>
        ))
      ) : (
        <DropDownMenuLI>İtemin Efekti yok</DropDownMenuLI>
      )}
    </DropDownMenuUL>
  );
};

type SplitItemStackMenuProps = {
  item: InventoryItem;
  setIsVisibleSplitItemStackMenu: React.Dispatch<React.SetStateAction<boolean>>;
  inventorySystem: InventorySystem;
  setInvGrids: React.Dispatch<React.SetStateAction<Array<InvGrid>>>;
  setIsVisibleItemMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
const SplitItemStackMenu: React.FC<SplitItemStackMenuProps> = ({
  item,
  setIsVisibleSplitItemStackMenu,
  inventorySystem,
  setInvGrids,
  setIsVisibleItemMenu,
}) => {
  const [splitSize, setSplitSize] = useState<number>(1);

  const split = async () => {
    const data = await EndOfTheWorldService.splitItemStack(item, splitSize);
    if (data.success) {
      toast.success(data.data);

      setIsVisibleSplitItemStackMenu(false);
      setSplitSize(1);
      setIsVisibleItemMenu(false);

      const userInventory = await EndOfTheWorldService.getUserInventory();
      if (userInventory.success) {
        for (const [i, item] of userInventory.data.items.entries()) {
          inventorySystem.placeItem(i, item);
        }

        setInvGrids([...inventorySystem.getInvGrids()]);
      } else {
        toast.error(userInventory.error.message);
        throw userInventory;
      }
    } else {
      toast.error(data.error.message);
    }
  };

  const cancel = () => {
    setSplitSize(1);
    setIsVisibleSplitItemStackMenu(false);
  };

  return (
    <DropDownMenuUL>
      <DropDownMenuLI>
        <input
          type="range"
          min={1}
          max={"stackable" in item.item ? item.item.stack - 1 : 0}
          onChange={(e) => setSplitSize(parseInt(e.target.value))}
          value={splitSize}
        />
      </DropDownMenuLI>

      <DropDownMenuLI>
        <div className="mb-3">{splitSize} adet öge bölünüyor</div>

        <div className="w-full flex justify-end gap-3 mb-2">
          <Button onClick={() => cancel()} bg="rose" style={{ width: "80px", height: "30px", fontSize: "14px" }}>
            İptal
          </Button>
          <Button onClick={split} bg="emerald" style={{ width: "80px", height: "30px", fontSize: "14px" }}>
            Ayır
          </Button>
        </div>
      </DropDownMenuLI>
    </DropDownMenuUL>
  );
};

type SoldierProps = {
  personal: Personal;
};
const Soldier: React.FC<SoldierProps> = ({ personal }) => {
  return (
    <div className="w-full h-full mt-10">
      <div className="w-full min-h-10 flex gap-2 border-2 border-zinc-700 rounded-md p-2 select-none">
        <div className="w-[100px] text-xl">
          <Icon _icon={faCoins} className="mr-2 text-amber-300" />
          <span className="text-zinc-400">{personal.money}</span>
        </div>
      </div>

      <div className="w-full h-[100px] flex gap-2 mt-5 justify-center">
        <Stat color="emerald" status={personal.hp}>
          <Icon _icon={faHeart} className="text-xl" />
        </Stat>

        <Stat color="orange" status={personal.hunger}>
          <Icon _icon={faUtensils} className="text-xl" />
        </Stat>

        <Stat color="blue" status={personal.thirst}>
          <Icon _icon={faDroplet} className="text-xl" />
        </Stat>

        <Stat color="rose" status={personal.energy}>
          <Icon _icon={faBolt} className="text-xl" />
        </Stat>
      </div>

      <div className="w-full h-[500px] mt-5 border-2 border-zinc-700 rounded-md shadow-xl p-3 flex flex-wrap"></div>
    </div>
  );
};

type StatProps = {
  children: any;
  color: "rose" | "emerald" | "orange" | "blue";
  status: number;
};
const Stat: React.FC<StatProps> = ({ children, color, status }) => {
  const border =
    color == "emerald"
      ? "border-2 border-emerald-600"
      : color == "blue"
      ? "border-2 border-blue-600"
      : color == "rose"
      ? "border-2 border-rose-600"
      : color == "orange"
      ? "border-2 border-amber-600"
      : color == "lime"
      ? "border-2 border-lime-600"
      : "";

  const bg =
    color == "emerald"
      ? "bg-emerald-600"
      : color == "blue"
      ? "bg-blue-600"
      : color == "rose"
      ? "bg-rose-600"
      : color == "orange"
      ? "bg-orange-600"
      : color == "lime"
      ? "bg-lime-600"
      : "";

  return (
    <div className={`relative w-[100px] h-[100px] rounded-2xl border-2 ${border} flex justify-center items-center z-20`}>
      {children}
      <div className={`absolute -bottom-[2px] w-full rounded-2xl ${bg} -z-10`} style={{ height: status }}></div>
    </div>
  );
};

type InventoryCProps = {
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen>>;
  inventorySystem: InventorySystem;
};
const InventoryC: React.FC<InventoryCProps> = ({ setActiveScreen, inventorySystem }) => {
  const [invGrids, setInvGrids] = useState<Array<InvGrid>>(inventorySystem.getInvGrids());

  return (
    <div className="w-full h-full">
      <BackMenu setActiveScreen={setActiveScreen} />

      <div className="w-full h-full flex gap-5 pl-5">
        <div className="w-1/3 h-full">
          <Soldier personal={inventorySystem.getPersonal()} />
        </div>

        <div className="w-2/3 h-full">
          <div className="relative w-full max-h-[90%] p-10 grid grid-cols-6 auto-rows-max gap-8 overflow-y-auto scroll-smooth">
            {invGrids.map((item) => (
              <div className="w-[100px] h-[100px]">
                <InventoryGrid key={item.index} item={item} inventorySystem={inventorySystem} setInvGrids={setInvGrids} />
              </div>
            ))}
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default InventoryC;
