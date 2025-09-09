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
