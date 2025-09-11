import { useEffect, useRef, useState } from "react";
import type { InventoryItem } from "../../../services/EndOfTheWorldService";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { LoadIcon } from "../../ui";
import { CommonColor, EpicColor, LegendaryColor, RareColor, Rarity, UncommonColor, type RarityColor } from "./types";
import LoadAnimate from "../../LoadAnimate";
import { InventorySystem } from "./lib/inventory-system";

type InventoryGridProps = {
  item?: InventoryItem;
  itemIndex: number;
};
const InventoryGrid: React.FC<InventoryGridProps> = ({ item, itemIndex }) => {
  const rareColor: RarityColor =
    item?.item.rarity == Rarity.Common
      ? CommonColor
      : item?.item.rarity == Rarity.Uncommon
      ? UncommonColor
      : item?.item.rarity == Rarity.Rare
      ? RareColor
      : item?.item.rarity == Rarity.Epic
      ? EpicColor
      : item?.item.rarity == Rarity.Legendary
      ? LegendaryColor
      : CommonColor;

  return (
    <LoadAnimate atype="expansion" duration={itemIndex * 10 * 5}>
      <div
        className={`relative w-[100px] h-[100px] bg-zinc-900 border-2 border-zinc-700 ${rareColor} rounded-lg text-sm text-center flex flex-col justify-center select-none`}
      >
        <span>{item?.item.name}</span>
      </div>
    </LoadAnimate>
  );
};

const InventoryC: React.FC = () => {
  const inventorySystemRef = useRef(new InventorySystem());

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
        throw data;
      }
    })();
  }, []);

  return (
    <div className="relative w-full h-full p-5 grid grid-cols-10">
      {!isLoadedInventory && (
        <div className="absolute w-full h-full flex flex-col justify-center">
          <LoadIcon />
        </div>
      )}

      {isLoadedInventory &&
        inventorySystemRef.current.getInvGrids().map((item, index) => (
          <div className="w-[100px] h-[100px]">
            <InventoryGrid item={item.inventoryItem} itemIndex={index} />
          </div>
        ))}
    </div>
  );
};

export default InventoryC;
