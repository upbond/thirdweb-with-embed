/* eslint-disable no-unused-vars */

/**
 *
 *  Login config
 *  please refer to = "https://github.com/upbond/embed-sample/blob/main/src/lib/UpbondEmbed.js#:~:text=wallet%2Dtesnet%2Dline%27%2C-,         loginConfig,-%3A%20%7B"
 *
 *
 */
const {
  REACT_APP_API_KEY,
  REACT_APP_EMBED_BUILD_ENV,
  REACT_APP_LOGIN_DOMAIN,
  REACT_APP_LINE_CLIENTID,
  REACT_APP_POLYGON_PROVIDER,
  REACT_APP_NETWORK_NAME,
  REACT_APP_CLIENT_ID,
  REACT_APP_CHAIN_ID,
  REACT_APP_GOOGLE_CLIENT_ID,
} = process.env;

export const lineLoginConfig = {
  name: "LINE アカウント", //button login title
  description: "LINE with UPBOND Identity",
  typeOfLogin: "line",
  loginProvider: "upbond-line",
  jwtParameters: {
    domain: REACT_APP_LOGIN_DOMAIN,
    connection: "line",
    clientId: REACT_APP_LINE_CLIENTID,
    client_id: REACT_APP_LINE_CLIENTID,
    scope: "openid email profile offline_access",
  },
  showOnModal: true,
  showOnDesktop: true,
  showOnMobile: true,
  mainOption: true,
  priority: 1, // are in the first pile in login modal
  logo: "https://elvira.co.th/wp-content/uploads/2016/02/line-icon.png",
  buttonBgColor: "#289B2A",
  buttonTextColor: "#f3f3f3",
  clientId: REACT_APP_LINE_CLIENTID,
};

export const googleLoginConfig = {
  name: "Google アカウント",
  description: "Google",
  typeOfLogin: "jwt",
  loginProvider: "upbond-google",
  jwtParameters: {
    domain: REACT_APP_LOGIN_DOMAIN,
    connection: "line",
    client_id: REACT_APP_GOOGLE_CLIENT_ID,
    clientId: REACT_APP_GOOGLE_CLIENT_ID,
    scope: "openid email profile offline_access",
  },
  clientId: REACT_APP_CLIENT_ID,
  showOnModal: true,
  showOnDesktop: true,
  showOnMobile: true,
  mainOption: true,
  priority: 2,
  logo: "https://www.seekpng.com/png/full/788-7887426_google-g-png-google-logo-white-png.png",
  buttonBgColor: "#4B68AE",
  buttonTextColor: "#FFF",
};

export const walletThemeConfig = {
  logo: "https://nftasset.s3.ap-northeast-1.amazonaws.com/UPBONDbondcustomer.png",
  buttonLogo:
    "https://nftasset.s3.ap-northeast-1.amazonaws.com/webinar/Round+Logo.png",
  isActive: true,
  lang: "ja", //make your wallet language to japanese or english, default "en"
  modalColor: "#fffff",
  bgColor: "#4B68AE",
  bgColorHover: "#214999",
  textColor: "#f3f3f3",
  textColorHover: "#214999",
  upbondLogin: {
    globalBgColor: "#ffffff",
    globalTextColor: "#4B68AE",
  },
};

export const networkConfig = {
  /**
   * If you need the embed give your different network for daaps
   * Default "mumbai network"
   *
   */
  host: REACT_APP_NETWORK_NAME,
  chainId: REACT_APP_CHAIN_ID,
  networkName:
    REACT_APP_EMBED_BUILD_ENV === "production"
      ? "Polygon"
      : REACT_APP_NETWORK_NAME,
  blockExplorer: "",
  ticker:
    REACT_APP_EMBED_BUILD_ENV === "production"
      ? "MATIC"
      : REACT_APP_NETWORK_NAME,
  tickerName:
    REACT_APP_EMBED_BUILD_ENV === "production"
      ? "MATIC"
      : REACT_APP_NETWORK_NAME,
  rpcUrl: REACT_APP_POLYGON_PROVIDER,
};
