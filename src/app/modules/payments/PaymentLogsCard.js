import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { PaymentsFilter } from "./payments-filter/PaymentsFilter";
import { PaymentsTable } from "./payments-table/PaymentsTable";
import { PaymentsGrouping } from "./payments-grouping/PaymentsGrouping";
import { usePaymentsUIContext } from "./PaymentLogsUIContext";

export function PaymentsCard() {
  const paymentsUIContext = usePaymentsUIContext();
  const paymentsUIProps = useMemo(() => {
    return {
      ids: paymentsUIContext.ids,
      newPaymentButtonClick: paymentsUIContext.newPaymentButtonClick,
    };
  }, [paymentsUIContext]);

  return (
    <Card>
      <CardHeader title="Payment Logs list">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={paymentsUIProps.newPaymentButtonClick}
          >
            New Payment
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* <PaymentsFilter /> */}
        {paymentsUIProps.ids.length > 0 && <PaymentsGrouping />}
        <PaymentsTable />
      </CardBody>
    </Card>
  );
}
