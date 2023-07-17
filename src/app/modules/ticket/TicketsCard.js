import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { TicketsFilter } from "./tickets-filter/TicketsFilter";
import { TicketsTable } from "./tickets-table/TicketsTable";
import { TicketsGrouping } from "./tickets-grouping/TicketsGrouping";
import { useTicketsUIContext } from "./TicketsUIContext";

export function TicketsCard() {
  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      ids: ticketsUIContext.ids,
      newTicketButtonClick: ticketsUIContext.newTicketButtonClick,
    };
  }, [ticketsUIContext]);

  return (
    <Card>
      <CardHeader title="ticket list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={ticketsUIProps.newTicketButtonClick}
          >
            New Ticket
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <TicketsFilter />
        {ticketsUIProps.ids.length > 0 && <TicketsGrouping />}
        <TicketsTable />
      </CardBody>
    </Card>
  );
}
