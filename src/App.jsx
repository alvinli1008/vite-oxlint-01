import { Button } from "@arco-design/mobile-react";

import "./App.css";
import setRootPixel from "@arco-design/mobile-react/tools/flexible";
import Demo01 from "./pages/Demo01";
import Demo02 from "./pages/Demo02";

setRootPixel(16);
function App() {
  return (
    <>
      {/* <Demo01 /> */}
      <Demo02 />
    </>
  );
}

export default App;
