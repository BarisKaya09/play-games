import { createBrowserRouter } from "react-router";
import HomePage from "../pages/home";
import GamesPage from "../pages/games";
import SignupPage from "../pages/signup";
import SigninPage from "../pages/signin";
import ProfilePage from "../pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/games",
    element: <GamesPage />,
    children: [
      {
        path: "fast-typing",
      },
      {
        path: "snake-game",
      },

      {
        path: "end-of-the-world",
      },
    ],
  },

  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/signin",
    element: <SigninPage />,
  },

  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

export default router;
