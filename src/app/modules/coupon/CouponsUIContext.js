import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./CouponsUIHelpers";
import { format } from "date-fns";

const generateRandomString = (length=6)=>Math.random().toString(20).substr(2, length)

const CouponsUIContext = createContext();

export function useCouponsUIContext() {
  return useContext(CouponsUIContext);
}

export const CouponsUIConsumer = CouponsUIContext.Consumer;

export function CouponsUIProvider({ couponsUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initCoupon = {
    id: undefined,
    name: "",
    token: `eb-${generateRandomString()}`,
    algorithm_type: "Percentage",
    algorithm_data: {
      percent: 0,
      amount: 0,
    },
    is_public: false,
    is_all: false,
    is_unlimited: false,
    has_limited_time: false,
    minimum_price: 0,
    users: [],
    users_tags: [],
    usable_from: format(new Date(), "yyyy-MM-dd HH:mm"),
    usable_till: format(new Date(), "yyyy-MM-dd HH:mm"),
    scope_id: null,
    scope: null,
    billable_type:"packages",
    capacity: 0,
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initCoupon,
    newCouponButtonClick: couponsUIEvents.newCouponButtonClick,
    openEditCouponDialog: couponsUIEvents.openEditCouponDialog,
    openDeleteCouponDialog: couponsUIEvents.openDeleteCouponDialog,
    openDeleteCouponsDialog: couponsUIEvents.openDeleteCouponsDialog,
    openFetchCouponsDialog: couponsUIEvents.openFetchCouponsDialog,
    openUpdateCouponsStatusDialog:
      couponsUIEvents.openUpdateCouponsStatusDialog,
  };

  return (
    <CouponsUIContext.Provider value={value}>
      {children}
    </CouponsUIContext.Provider>
  );
}
