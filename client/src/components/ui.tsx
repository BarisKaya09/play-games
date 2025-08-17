import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type InputProps = {
  type: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  ref?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  disabled?: boolean;
};
export const Input: React.FC<InputProps> = forwardRef(({ type, placeholder, onChange, onFocus, onBlur, onKeyDown, disabled, value }, ref: any) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      ref={ref}
      onChange={onChange}
      className="w-[400px] h-12 p-4 outline-none border-2 border-[#111111] rounded-2xl"
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
});

type IconProps = {
  _icon: IconDefinition;
  className?: string;
};
export const Icon: React.FC<IconProps> = ({ _icon, className }) => {
  return <FontAwesomeIcon icon={_icon} className={className} />;
};

// expansion animayasyon tipi elementin scale'i 0 ken 1'e gelen animasyon
export type AnimType = "top-to-bottom" | "bottom-to-top" | "left-to-right" | "right-to-left" | "expansion";
export const loadWithAnim = (element: HTMLElement, atype: AnimType, duration: number) => {
  const observer = new IntersectionObserver((entries, observe) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add(atype);
          entry.target.classList.remove("opacity-0");
        }, duration);
      } else {
        entry.target.classList.remove(atype);
        entry.target.classList.add("opacity-0");
      }
      {
        /* observe.unobserve(entry.target); */
      }
    });
  });

  observer.observe(element);
};

type ButtonProps = {
  children: any;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  bg: "rose" | "indigo" | "emerald";
  disabled?: boolean;
};
export const Button: React.FC<ButtonProps> = ({ children, style, bg, disabled, onClick }) => {
  const _bg = {
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
  }[bg];

  return (
    <button
      className={`w-[200px] h-10 rounded-lg cursor-pointer hover:opacity-90 duration-300 text-lg ${_bg}`}
      style={{ ...style, opacity: disabled ? "0.5" : "1" }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const LoadIcon: React.FC = () => {
  return (
    <div className="w-full text-7xl flex justify-center">
      <Icon _icon={faSpinner} className="animate-spin text-rose-500" />
    </div>
  );
};

type StatisticBox = {
  title: string;
  statistic: any;
  color: "emerald" | "rose" | "yellow" | "violet";
  brackets?: any;
};
export const StatisticBox: React.FC<StatisticBox> = ({ title, statistic, brackets, color }) => {
  const _color = {
    emerald: "text-emerald-500",
    rose: "text-rose-500",
    yellow: "text-yellow-500",
    violet: "text-violet-500",
  }[color];

  return (
    <div className="w-[300px] h-[170px] bg-[#1a1919] border-x border-gray-500 rounded-lg shadow-lg p-5 select-none cursor-pointer hover:bg-[#181616] duration-300">
      <h3 className={`w-full ${_color}`}>{title}</h3>
      <div className="w-full text-center mt-4">
        <span className={`text-6xl mt-5 ${_color}`}>{statistic}</span>
        {brackets && <span className={`text-lg ${_color}`}>{"(" + brackets + ")"}</span>}
      </div>
    </div>
  );
};

type InfoBoxProps = {
  children: any;
  width: string;
  height: string;
};
export const InfoBox: React.FC<InfoBoxProps> = ({ children, width, height }) => {
  return (
    <div className="rounded-lg border-l-6 border-l-cyan-700 px-5 bg-gray-900 flex items-center select-none" style={{ width: width, height: height }}>
      {children}
    </div>
  );
};
