import SmallContainerPng from "../assets/small-container.png";
import Machete from "../assets/machete.png";
import Sweater from "../assets/sweater.png";
import Shorts from "../assets/shorts.png";
import SurvivalBiscuits from "../assets/survival-biscuits.png";
import CannedBeans from "../assets/canned-beans.png";
import AncientChocolateBar from "../assets/ancient-chocolate-bar.png";
import Somon from "../assets/somon.png";
import Water from "../assets/water.png";
import Meat from "../assets/meat.png";
import RottenMeat from "../assets/rotten-meat.png";
import SmallTrout from "../assets/small-trout.png";
import Perch from "../assets/perch.png";
import ArcticChar from "../assets/arctic-char.png";
import NorthernPike from "../assets/northern-pike.png";
import IceSalmon from "../assets/ice-salmon.png";
import CrystalCarp from "../assets/crystal-carp.png";
import AncientIcefish from "../assets/ancient-ice-fish.png";
import TShirt from "../assets/tShirt.png";
import Painkiller from "../assets/painkiller.png";
import Jacket from "../assets/jacket.png";
import MilitaryJacket from "../assets/military-jacket.png";
import Pants from "../assets/pants.png";
import CargoPants from "../assets/cargo-pants.png";
import Sneakers from "../assets/sneakers.png";
import MilitaryBoots from "../assets/military-boots.png";
import MotorcycleHelmet from "../assets/motorcycle-helmet.png";
import HeavyMilitaryHelmet from "../assets/heavy-military-helmet.png";
import LightMilitaryHelmet from "../assets/light-military-helmet.png";
import Glock18 from "../assets/glock-18.png";
import Colt1911 from "../assets/colt1911.png";
import AK47 from "../assets/ak-47.png";
import M4A1 from "../assets/m4a1.png";
import Remington870 from "../assets/remington-870.png";
import BarrettM82 from "../assets/barrett-M82.png";
import LouisvilleSlugger from "../assets/louisville-slugger.png";
import StanleyCrowbar from "../assets/stanley-crowbar.png";
import Backpack from "../assets/backpack.png";

export const getItemImg = (itemName: string): string => {
  switch (itemName) {
    case ItemNames.CannedBeans:
      return CannedBeans;
    case ItemNames.SurvivalBiscuits:
      return SurvivalBiscuits;
    case ItemNames.AncientChocolateBar:
      return AncientChocolateBar;
    case ItemNames.Somon:
      return Somon;
    case ItemNames.Water:
      return Water;
    case ItemNames.Meat:
      return Meat;
    case ItemNames.RottenMeat:
      return RottenMeat;
    case ItemNames.SmallTrout:
      return SmallTrout;
    case ItemNames.Perch:
      return Perch;
    case ItemNames.ArcticChar:
      return ArcticChar;
    case ItemNames.NorthernPike:
      return NorthernPike;
    case ItemNames.Whitefish:
    case ItemNames.IceSalmon:
      return IceSalmon;
    case ItemNames.CrystalCarp:
      return CrystalCarp;
    case ItemNames.AncientIcefish:
      return AncientIcefish;
    case ItemNames.TShirt:
      return TShirt;
    case ItemNames.Shorts:
      return Shorts;
    case ItemNames.Sweater:
      return Sweater;
    case ItemNames.Jacket:
      return Jacket;
    case ItemNames.MilitaryJacket:
      return MilitaryJacket;
    case ItemNames.Pants:
      return Pants;
    case ItemNames.CargoPants:
      return CargoPants;
    case ItemNames.Sneakers:
      return Sneakers;
    case ItemNames.MilitaryBoots:
      return MilitaryBoots;
    case ItemNames.MotorcycleHelmet:
      return MotorcycleHelmet;
    case ItemNames.LightMilitaryHelmet:
      return LightMilitaryHelmet;
    case ItemNames.HeavyMilitaryHelmet:
      return HeavyMilitaryHelmet;
    case ItemNames.Glock18: // *
      return Glock18;
    case ItemNames.Colt1911:
      return Colt1911;
    case ItemNames.AK47:
      return AK47;
    case ItemNames.M4A1:
      return M4A1;
    case ItemNames.Remington870:
      return Remington870;
    case ItemNames.BarrettM82:
      return BarrettM82;
    case ItemNames.KaBarKnife:
    case ItemNames.Machete:
      return Machete;

    case ItemNames.LouisvilleSlugger:
      return LouisvilleSlugger;
    case ItemNames.StanleyCrowbar:
      return StanleyCrowbar;
    case ItemNames.Backpack:
      return Backpack;
    case ItemNames.SmallContainer:
      return SmallContainerPng;
    case ItemNames.BigContainer:
    case ItemNames.PistolBullet:
    case ItemNames.RifleBullet:
    case ItemNames.SniperBullet:
    case ItemNames.PumpgunBullet:
    case ItemNames.GoldRing:
    case ItemNames.SilverNecklace:
    case ItemNames.DiamondEarring:
    case ItemNames.LuxuryWatch:
    case ItemNames.OldPainting:
    case ItemNames.Bandage:
    case ItemNames.Medkit:
    case ItemNames.Painkiller:
      return Painkiller;
    case ItemNames.AntibioticPills:
    default:
      return "";
  }
};

import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ItemNames } from "./games/end-of-the-world/types";

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
    <div className="text-7xl flex justify-center">
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

type StatusBarProps = {
  width: string;
  height: string;
  color: "emerald" | "blue" | "rose" | "orange" | "lime";
  status: string;
  children: any;
  orientation: "horizontal" | "vertical";
};
export const StatusBar: React.FC<StatusBarProps> = ({ width, height, color, status, children, orientation }) => {
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
      ? "bg-emerald-500"
      : color == "blue"
      ? "bg-blue-500"
      : color == "rose"
      ? "bg-rose-500"
      : color == "orange"
      ? "bg-orange-500"
      : color == "lime"
      ? "bg-lime-500"
      : "";

  return (
    <div className={`relative rounded-md ${border}`} style={{ width: width, height: height }}>
      <div
        className={`absolute w-full h-full ${bg} left-[1px] top-[1px] rounded-sm`}
        style={orientation == "horizontal" ? { width: status } : { height: status }}
      ></div>
      <div
        className={`absolute ${orientation == "horizontal" && "left-1/2 top-1/5 "} ${
          orientation == "vertical" && "left-1/3 top-1/3"
        } w-5 h-5 text-cyan-200`}
      >
        {children}
      </div>
    </div>
  );
};
