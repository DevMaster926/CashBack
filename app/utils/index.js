import { Platform, UIManager, LayoutAnimation, Dimensions, I18nManager } from "react-native";
import memoize from "lodash.memoize";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import { store } from "@store";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const PASSPORT_VALIDATE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
export const EMAIL_VALIDATE = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export const GOOGLE_GEO_API_KEY = 'AIzaSyCRqkSP2ccSVrYQmATHc5VDTxQU-YdusYg';
export const GOOGLE_OAUTH_WEB_CLIENT_ID = '639984185156-li9qfe33p9m18ud3hpmdkr90bbsnak63.apps.googleusercontent.com';
export const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api/';

export const isObjEmpty = (obj) => {
  if (obj == null) return true;
  if (obj === null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

export const enableExperimental = () => {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const heightHeader = () => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const landscape = width > height;

  if (Platform.OS === "android") return 40;
  if (Platform.isPad) return 40;
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      return landscape ? 30 : 40;
    default:
      return landscape ? 30 : 40;
  }
};

const translationGetters = {
  en: () => require("../lang/en.json"),
  om: () => require("../lang/om.json")
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export function setI18nConfig() {
  const fallback = { languageTag: "en", isRTL: false };
  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();
  I18nManager.forceRTL(isRTL);
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

export const SCREEN = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT
};

export function checkLogin() {
  const success = store?.getState()?.auth?.login?.success;
  if (success == true) {
    return true;
  }else {
    return false;
  }
}