import { createContext, useContext, useRef, useState, memo } from "react";
import { createStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { useRequest } from "ahooks";

const StoreContext = createContext(null);

const StoreProvider = ({ children }) => {
  const storeRef = useRef();

  const {
    loading: getPaymentsLoading,
    run: getPayments,
    data: payments,
  } = useRequest(
    () => {
      return new Promise((resolve, reject) => {
        console.log("Promise");
        setTimeout(() => {
          resolve({
            payments: [
              { id: 1, name: "支付宝" },
              { id: 2, name: "微信" },
            ],
          });
        }, 1000);
      });
    },
    { manual: true },
  );

  if (!storeRef.current) {
    storeRef.current = createStore((set) => ({
      count: 1,
      number: 0,
      payments: payments || [],
      getPaymentsLoading,
      getPayments,
      setState: (newValues) => set((state) => ({ ...state, ...newValues })),
      requestNumber: useRequest(
        () => {
          return new Promise((resolve, reject) => {
            console.log("getP");
            setTimeout(() => {
              resolve({ number: 1 });
            }, 1000);
          });
        },
        { manual: true },
      ),
    }));
  }

  console.log("StoreProvider", payments, getPaymentsLoading, storeRef.current);

  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
};

const useStoreInContext = (selector, equalityFn) => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStoreWithEqualityFn(store, selector, equalityFn);
};

const Demo01 = memo(() => {
  const [count, setState] = useStoreInContext((s) => [s.count, s.setState], shallow);

  console.log("Demo01");
  return (
    <div>
      <div>Demo01: {count}</div>
      <button
        onClick={() => {
          setState({ count: count + 1 });
        }}
      >
        setCount
      </button>
    </div>
  );
});

const Demo02 = memo(() => {
  const { number, setState } = useStoreInContext();
  console.log("Demo02");
  return (
    <div>
      <div>Demo02: {number}</div>
      <button
        onClick={() => {
          setState({ number: number + 1 });
        }}
      >
        setNumber
      </button>
    </div>
  );
});

const Demo03 = memo(() => {
  const [payments, requestNumber] = useStoreInContext((s) => [s.payments, s.requestNumber], shallow);

  console.log("Demo03", payments, requestNumber);
  return (
    <div>
      <div>
        {(payments || []).map((p) => (
          <p key={p.id}>{p.name}</p>
        ))}
      </div>
      <button
        onClick={() => {
          requestNumber.run();
        }}
      >
        getPayments
      </button>
    </div>
  );
});

const Parent = () => {
  const [n, setN] = useState(0);
  return (
    <StoreProvider>
      <button onClick={() => setN((prev) => prev + 1)}>{n}</button>
      <Demo01></Demo01>
      <Demo02></Demo02>
      <Demo03></Demo03>
    </StoreProvider>
  );
};

export default Parent;
