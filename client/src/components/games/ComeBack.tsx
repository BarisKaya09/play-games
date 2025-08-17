import React from "react";
import { NavLink } from "react-router";
import { Icon } from "../ui";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ComeBack: React.FC = () => {
  return (
    <div className="w-[100px] h-10">
      <NavLink to={"/"}>
        <div className="w-20 h-full border-2 border-gray-800 rounded-xl leading-10">
          <Icon _icon={faArrowLeft} className="w-full h-full text-2xl" />
        </div>
      </NavLink>
    </div>
  );
};

export default ComeBack;
