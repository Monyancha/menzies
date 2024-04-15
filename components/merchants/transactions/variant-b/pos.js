import OrderDetails from "./order-details";
import { useContext } from "react";
import { useSelector } from "react-redux";
import PaymentsView from "./payments-view";
import ReceiptsView from "./receipts-view";
import MerchantUiContext from "../../../../store/shared/merchant-ui";
import {
  isViewPos,
  isViewPayments,
  isViewReceipts,
  isViewTables,
} from "../../../../store/merchants/transactions/transaction-slice";
import CategorizedSellableCards from "../categorized-sellable-cards";
import TablesView from "./tables-view";
import ScrollerFabs from "../../../ui/actions/scroller-fabs";
import { useRouter } from "next/router";
import store from "../../../../store/store";
import { fetchOrderRedirect } from "../../../../store/merchants/transactions/redirects-slice";
import { addTransactionItem } from "../../../../store/merchants/transactions/transaction-slice";
import FullTransactionDonePusher from "./full-transaction-done-pusher";

function Pos() {
  const uiCtx = useContext(MerchantUiContext);
  const isMobile = uiCtx.layout.actions.isMobile();

  const router = useRouter();

  const orderDetailsVisible = uiCtx.pos.actions.areOrderDetailsVisible();
  const itemCardsVisible = uiCtx.pos.actions.areItemCardsVisible();

  const showOrders = (isMobile && orderDetailsVisible) || !isMobile;
  const showItems = (isMobile && itemCardsVisible) || !isMobile;

  const isPosView = useSelector(isViewPos);
  const isReceiptsView = useSelector(isViewReceipts);
  const isPaymentsView = useSelector(isViewPayments);
  const isTablesView = useSelector(isViewTables);

  const posView = (
    <div className="w-full">
      <div className="flex justify-between gap-4 min-h-[85vh] overflow-x-hidden px-2 pt-36 md:pt-20">
        <div
          className={`${
            showOrders ? "inline-block" : "hidden"
          } w-full lg:w-7/12 2xl:w-6/12 h-fit`}
        >
          <OrderDetails />
        </div>

        <div
          className={`${
            showItems ? "inline-block" : "hidden"
          }  w-full lg:w-5/12 2xl:w-6/12`}
        >
          {/*!isRestaurantAc && <SellableCards />*/}
          <CategorizedSellableCards />
        </div>
      </div>
    </div>
  );

  let currentView;
  if (isPosView) {
    currentView = posView;
  }
  if (isPaymentsView) {
    currentView = <PaymentsView />;
  }

  if (isReceiptsView) {
    currentView = <ReceiptsView />;
  }

  if (isTablesView) {
    currentView = <TablesView />;
  }

  return (
    <section className="w-full relative">
      <div className="w-full">{currentView}</div>

      <ScrollerFabs />
      <FullTransactionDonePusher />
    </section>
  );
}

export default Pos;
