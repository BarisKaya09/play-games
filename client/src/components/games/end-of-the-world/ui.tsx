import type { ItemType } from "./types";

type MenuButtonProps = {
  children: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};
export const MenuButton: React.FC<MenuButtonProps> = ({ children, onClick }) => {
  return (
    <button className="w-[70%] h-full cursor-pointer duration-300 bg-amber-600 rounded-sm hover:bg-amber-700 select-none" onClick={onClick}>
      {children}
    </button>
  );
};

type ItemTypeTag = {
  itemType: ItemType;
};
export const ItemTypeTag: React.FC<ItemTypeTag> = ({ itemType }) => {
  return <div className="w-20 h-5 rounded-xl text-sm px-1 bg-zinc-800 text-center">{itemType.length > 7 ? itemType.slice(0, 7) + "..." : itemType}</div>;
};
