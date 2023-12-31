import React, { useState, useContext, createContext, memo, useMemo, useCallback } from "react";

const DemoContext = createContext({});

const DemoProvider = ({ children }) => {
  const [n, setN] = useState(0);
  const [t, setT] = useState(0);

  const setNCal = useCallback(setN, []);

  const nMemo = useMemo(() => {
    return { n, setN: setNCal };
  }, [n, setNCal]);

  return <DemoContext.Provider value={{ ...nMemo, t, setT }}>{children}</DemoContext.Provider>;
};

const useDemo = () => {
  return useContext(DemoContext);
};

const Demo01 = memo(() => {
  const { n, setN } = useDemo();
  console.log("Demo01 render", n);
  return (
    <div>
      <div>n: {n}</div>
      <button
        onClick={() => {
          setN((prev) => prev + 1);
        }}
      >
        setN
      </button>
    </div>
  );
});

const Demo02 = () => {
  const { t, setT } = useDemo();
  console.log("Demo02 render", t);
  return (
    <div>
      <div>t: {t}</div>
      <button
        onClick={() => {
          setT((prev) => prev + 1);
        }}
      >
        setT
      </button>
    </div>
  );
};

const Demo03 = () => {
  console.log("Demo03 render");
  return <div>Demo03</div>;
};

const Parent = () => {
  const [count, setCount] = useState(0);

  console.log("Parent render");
  return (
    <DemoProvider>
      <button onClick={() => setCount((prev) => prev + 1)}>{count}</button>
      <Demo01></Demo01>
      <Demo02></Demo02>
      <Demo03></Demo03>
    </DemoProvider>
  );
};

export default Parent;
