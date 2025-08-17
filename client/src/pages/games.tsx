import React from "react";
import { Route, Routes } from "react-router";
import FastTypingPage from "./fast-typing";
import SnakePage from "./snake";
import EndOfTheWorldPage from "./end-of-the-world";

const GamesPage: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<div>Games Page</div>}></Route>
        <Route path="fast-typing" element={<FastTypingPage />}></Route>
        <Route path="snake-game" element={<SnakePage />}></Route>
        <Route path="end-of-the-world" element={<EndOfTheWorldPage />}></Route>
      </Routes>
    </div>
  );
};

export default GamesPage;
