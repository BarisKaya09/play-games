import React from "react";

import Games from "../components/home/games";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full flex gap-5">
      <div className="w-[85%] h-full">
        <Games />
      </div>
    </div>
  );
};

export default HomePage;
