import logo from "./logo.svg";
import "./App.css";
import { UpbondEmbedContext } from "./lib/upbondEmbed";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import Embed from "./pages/embed";

function App() {
  return (
    <UpbondEmbedContext>
      <ThirdwebProvider network={ChainId.Mumbai}>
        <Embed/>
      </ThirdwebProvider>
    </UpbondEmbedContext>
  );
}

export default App;
