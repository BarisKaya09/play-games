import React, { useRef, useState } from "react";
import { Icon, Input } from "../ui";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";
import LoadAnimate from "../LoadAnimate";

const SearchGame: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | any>(null);

  return (
    <div className="w-full h-10 flex justify-center">
      <div className="flex relative cursor-pointer">
        <div className="absolute -left-10 w-12 h-12 border-l-2 border-y-2 border-[#111111] rounded-l-2xl leading-10">
          <Icon _icon={faMagnifyingGlass} className={"w-full h-full m-auto"} />
        </div>
        <Input type="text" placeholder="Oyun Ara..." ref={inputRef} />
      </div>
    </div>
  );
};

const games = [
  {
    id: 1,
    gameName: "Hızlı Yazma",
    path: "/fast-typing",
    gameImage: "https://www.reedukkan.com/blog/wp-content/uploads/2024/08/d94e1038ced5a35bcd8c0775c45f87c1fc4e72c0.jpeg",
    description: "Klavye becerilerini kullanarak 1 dakika da ne kadar kelime yazacağını test et.",
  },
  {
    id: 2,
    gameName: "Yılan Oyunu",
    path: "/snake-game",
    gameImage: "https://wallpapers.com/images/hd/snake-game-loading-screen-9po4zuz368r8u1cg.jpg",
    description: "Klasik yılan oyunu.",
  },
  {
    id: 3,
    gameName: "Dünyanın Sonu",
    path: "/end-of-the-world",
    gameImage:
      "https://static.vecteezy.com/system/resources/previews/024/791/026/non_2x/nuclear-explosion-in-city-atomic-bombing-bomb-explosion-fiery-mushroom-cloud-and-war-destruction-cartoon-illustration-vector.jpg",
    description:
      "Dünyanın sonunu getiren savaş sonrasında çok az insan hayatta kaldı. Devletlerin ve Kanunların olmadığı yerde hayatta kalmak çok zor!",
  },
];

const Games: React.FC = () => {
  type Details = { id: number; visible: boolean };
  const [details, setDetails] = useState<Details | null>(null);

  return (
    <div className="px-20 mt-32">
      <SearchGame />

      <div className="w-full h-full flex flex-wrap gap-5 mt-20">
        {games.map((game) => (
          <NavLink to={`games${game.path}`}>
            <LoadAnimate atype="right-to-left" duration={0}>
              <div
                className="relative w-[300px] h-[200px] rounded-2xl border-2 border-[#111111] p-1 cursor-pointer"
                onMouseEnter={() => setDetails({ id: game.id, visible: true })}
                onMouseLeave={() => setDetails({ id: game.id, visible: false })}
              >
                <img className="w-full h-full rounded-2xl" src={game.gameImage} />

                {details?.id == game.id && details.visible && (
                  <div className="absolute left-0 bottom-0 w-full h-full bg-black opacity-90 p-3" id="game-details">
                    <h3 className="w-full text-2xl text-rose-500 text-center mt-5">{game.gameName}</h3>
                    <div className="w-[80%] min-h-10 text-md text-gray-300 m-auto flex justify-center">{game.description}</div>
                  </div>
                )}
              </div>
            </LoadAnimate>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Games;
