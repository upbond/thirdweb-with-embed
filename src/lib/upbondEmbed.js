import Upbond from "@upbond/upbond-embed";
import {
  googleLoginConfig,
  lineLoginConfig,
  networkConfig,
  walletThemeConfig,
} from "../config/loginConfig";
import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

export const EmbedContext = createContext({
  upbondProviders: null,
  isLoading: false,
  account: null,
  loadingText: "",
  login: async () => {},
  lineLogin: async () => {},
  logout: async () => {},
  init: async () => {},
  checkClaimData: async () => {},
  claimNft: async () => {},
  verifClaim: false,
  eventTimeExpired: false,
  supplyHasLimit: false,
  handleErrorMint: () => {},
  errorMessage: "ネットワーク エラーです。もう一度お試しください。",
  errMint: false,
});

export function useUpbondEmbedContext() {
  return useContext(EmbedContext);
}

export const UpbondEmbedContext = ({ children }) => {
  const initUpbond = new Upbond({
    buttonPosition: "bottom-left",
    buttonSize: 80,
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
  }); //Init state upbond provider
  const [upbondProviders, setUpbondProviders] = useState(new Upbond());
  const [web3, setWeb3] = useState(new Web3());
  const [account, setAccount] = useState(null);
  const [verifClaim, setVerifClaim] = useState(false);
  const [loadingText, setLoadingText] = useState(
    "署名リクエストの準備中...ネットワークの状況により処理に1~2分程度かかる可能性があります。"
  );
  const [eventTimeExpired, setTimeExpired] = useState(false);
  const [supplyHasLimit, setSupplyHasLimit] = useState(false);
  const [errMint, setErrMint] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "ネットワーク エラーです。もう一度お試しください。"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleErrorMint = () => {
    setErrMint(!errMint);
  };

  useEffect(() => {
    /**
     * Initialize first after open site
     */
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch();
  }, [upbondProviders]);

  /**
   * Fetch()
   * fetch user info from auth after upbond provider status is loggedin
   * fetch user address from upbond provider
   */
  const fetch = async () => {
    setIsLoading(true);
    if (upbondProviders && upbondProviders?.isLoggedIn) {
      const user = await upbondProviders.getUserInfo(); //get user info from auth
      if (user) {
        const web3 = new Web3(upbondProviders); // set upbond provider to web3 provider
        web3.setProvider(upbondProviders.provider);
        setWeb3(web3);
        const account = await web3.eth.getAccounts(); //get wallet address from upbond provider
        setAccount(account[0]);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  /**
   * init()
   * Initialize upbond embed before using it
   */
  const init = async () => {
    setIsLoading(true);
    console.log(networkConfig, "@100");
    await initUpbond.init({
      buildEnv: process.env.NEXT_PUBLIC_EMBED_BUILD_ENV,
      isUsingDirect: true,
      isIframeFullScreen: true,
      skipDialog: false,
      dappRedirectUri: `${window.location.origin}`,
      enableLogging: false,
      network: networkConfig,
      loginConfig: {
        "upbond-line": lineLoginConfig,
        "upbond-google": googleLoginConfig,
      },
      whiteLabel: {
        walletTheme: walletThemeConfig,
      },
    });
    setUpbondProviders(initUpbond); // set new provider after initialize to state upbond provider
    // await initClaim(initUpbond);
    setIsLoading(false);
  };

  const login = async () => {
    try {
      if (!upbondProviders.isInitialized) {
        await init();
      }
      // wait until upbondProvider finished initialization
      if (!upbondProviders.isLoggedIn) {
        const data = await upbondProviders.login();
        web3.setProvider(upbondProviders.provider);
        const accounts = await this.web3.eth.getAccounts();
        setAccount(accounts);
        return data;
      } else {
        fetch();
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  const contextProvider = {
    upbondProviders,
    isLoading,
    account,
    login,
    init,
    loadingText,
    verifClaim,
    eventTimeExpired,
    supplyHasLimit,
    handleErrorMint,
    errorMessage,
    errMint,
  };

  return (
    <EmbedContext.Provider value={contextProvider}>
      {children}
    </EmbedContext.Provider>
  );
};
