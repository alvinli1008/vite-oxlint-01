import { Button } from "@arco-design/mobile-react";

import "./App.css";
import setRootPixel from "@arco-design/mobile-react/tools/flexible";

setRootPixel(16);
function App() {
  return (
    <>
      <div>
        <Button needActive>Primary</Button>
      </div>
      <p className="text-base">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
