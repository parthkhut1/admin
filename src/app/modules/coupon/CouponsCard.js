import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { CouponsFilter } from "./coupons-filter/CouponsFilter";
import { CouponsTable } from "./coupons-table/CouponsTable";
import { CouponsGrouping } from "./coupons-grouping/CouponsGrouping";
import { useCouponsUIContext } from "./CouponsUIContext";

export function CouponsCard() {
  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      ids: couponsUIContext.ids,
      newCouponButtonClick: couponsUIContext.newCouponButtonClick,
    };
  }, [couponsUIContext]);

  return (
    <Card>
      <CardHeader title="Coupons list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={couponsUIProps.newCouponButtonClick}
          >
            New Coupon
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* <CouponsFilter /> */}
        {couponsUIProps.ids.length > 0 && <CouponsGrouping />}
        <CouponsTable />
      </CardBody>
    </Card>
  );
}
