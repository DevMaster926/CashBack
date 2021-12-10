import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Auth from "./auth";
import Main from "./main";
import Loading from "@screens/Loading";
import Intro from "@screens/Intro";

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    // Auth: Auth,
    Main: Main,
    Intro: Intro,
  },
  {
    initialRouteName: "Loading"
  }
);
module.exports = createAppContainer(AppNavigator);
