import { useEffect, useRef, useState } from "react";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { getItemImg, LoadIcon } from "../../ui";
import { CommonColor, EpicColor, LegendaryColor, RareColor, Rarity, UncommonColor, type RarityColor } from "./types";
import { InventorySystem, type InvGrid } from "./lib/inventory-system";
import { toast, ToastContainer } from "react-toastify";

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

  return (
    <div
      className={`relative w-[140px] h-[120px] bg-zinc-900 border-2 border-zinc-700 ${rareColor} rounded-lg text-sm select-none z-10 border-dashed hover:border-5 duration-100`}
      draggable={!item.empty && true}
      onDragStart={dragItem}
      onDrop={dropItem}
      onDragOver={allowDrop}
    >
      <div className="w-full h-full text-center flex flex-col justify-center">
        <span>{item.inventoryItem?.item.name}</span>
        {!item.empty && <img src={getItemImg(item.inventoryItem?.item.name || "")} className="w-[160px] h-[110px] select-none m-auto -z-10" />}
      </div>
    </div>
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
