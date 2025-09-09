import React from "react";
import SideBar from "./components/app/sidebar";
import TopBar from "./components/app/topbar";

type AppProps = {
  children: any;
};
const App: React.FC<AppProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex gap-5">
      <div className="w-[15%] h-full">
        <div className="fixed top-0 left-0 w-[15%] h-[917px] bg-[#111111]">
          <SideBar />
        </div>
      </div>

      <div className="w-[85%] h-full mt-12">
        {/* <TopBar /> */}
        {children}
      </div>
    </div>
  );
};

export default App;
