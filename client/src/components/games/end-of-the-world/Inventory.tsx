import { useEffect, useState } from "react";
import type { Inventory, InventoryItem } from "../../../services/EndOfTheWorldService";
import EndOfTheWorldService from "../../../services/EndOfTheWorldService";
import { LoadIcon } from "../../ui";
import { CommonColor, EpicColor, LegendaryColor, RareColor, Rarity, UncommonColor, type RarityColor } from "./types";
import LoadAnimate from "../../LoadAnimate";

const MAX_INVENTORY_SLOT = 50;

type InventorySlotProps = {
  item: InventoryItem;
  itemIndex: number;
};
const InventorySlot: React.FC<InventorySlotProps> = ({ item, itemIndex }) => {
  const rareColor: RarityColor =
    item.item.rarity == Rarity.Common
      ? CommonColor
      : item.item.rarity == Rarity.Uncommon
      ? UncommonColor
      : item.item.rarity == Rarity.Rare
      ? RareColor
      : item.item.rarity == Rarity.Epic
      ? EpicColor
      : LegendaryColor;

  return (
    <LoadAnimate atype="expansion" duration={itemIndex * 10 * 5}>
      <div
        className={`relative w-[100px] h-[100px] bg-zinc-900 border-2 border-zinc-700 ${rareColor} rounded-lg text-sm text-center flex flex-col justify-center select-none`}
      >
        <span>{item.item.name}</span>
      </div>
    </LoadAnimate>
  );
};

const InventoryC: React.FC = () => {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isLoadedInventory, setIsLoadedInventory] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await EndOfTheWorldService.getUserInventory();
      if (data.success) {
        setInventory(data.data);
        setIsLoadedInventory(true);
      } else {
        throw data;
      }
    })();
  });

  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-3">
      {!isLoadedInventory && (
        <div className="w-full h-full flex flex-col justify-center">
          <LoadIcon />
        </div>
      )}

      {isLoadedInventory &&
        inventory?.items.map((item, index) => (
          <div className="w-[100px] h-[100px]">
            <InventorySlot item={item} itemIndex={index} />
          </div>
        ))}
    </div>
  );
};

export default InventoryC;
