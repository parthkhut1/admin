import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./PaymentLogsUIHelpers";

const PaymentsUIContext = createContext();

export function usePaymentsUIContext() {
  return useContext(PaymentsUIContext);
}

export const PaymentsUIConsumer = PaymentsUIContext.Consumer;

export function PaymentsUIProvider({paymentsUIEvents, children}) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback(nextQueryParams => {
    setQueryParamsBase(prevQueryParams => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initPayment = {
    id: undefined,
    payable_id: 0,
    coupon_id: 0,
    price: 0,
    discounted_price: 0,
    gateway: "nil",
    status: "pending",
    user:null,
    created_at: "",
    update_at: ""
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initPayment,
    newPaymentButtonClick: paymentsUIEvents.newPaymentButtonClick,
    openEditPaymentDialog: paymentsUIEvents.openEditPaymentDialog,
    openDeletePaymentDialog: paymentsUIEvents.openDeletePaymentDialog,
    openDeletePaymentsDialog: paymentsUIEvents.openDeletePaymentsDialog,
    openFetchPaymentsDialog: paymentsUIEvents.openFetchPaymentsDialog,
    openUpdatePaymentsStatusDialog: paymentsUIEvents.openUpdatePaymentsStatusDialog
  };

  return <PaymentsUIContext.Provider value={value}>{children}</PaymentsUIContext.Provider>;
}