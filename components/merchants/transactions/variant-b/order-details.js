import { Button, TextInput, Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isRestaurant } from "../../../../lib/shared/roles_and_permissions";
import { StaffContextProvider } from "../../../../store/merchants/partners/staff-context";
import {
  clearSubmittedTransaction,
  resetTransactionState,
  setClient,
  setSelectedClient,
  setTransactionDate,
  showViewTables,
} from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import NewClientModal from "../../partners/new-client-modal";
import TitemList from "../variant-a/titem-list";
import { IconX, IconLayoutGridAdd } from "@tabler/icons";
import TransactionMetadataModal from "./transaction-metadata-modal";
import { hasBeenGranted } from "../../../../store/merchants/settings/access-control-slice";
import { addTransactionItem } from "../../../../store/merchants/transactions/transaction-slice";
import { fetchBookingRedirect } from "../../../../store/merchants/transactions/redirects-slice";
import { fetchOrderRedirect } from "../../../../store/merchants/transactions/redirects-slice";
import OrderDetailsActions from "./order-details-actions";
import SelectedContactPreview from "./selected-contact-preview";

function OrderDetails() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();

  const isLoading = useSelector(
    (state) => state.posTransaction.existingTransactionStatus === "loading"
  );

  const isRestaurantAc = isRestaurant(session?.user);

  const selectedContact = useSelector(
    (state) => state.posTransaction.client_id
  );

  const selectedClient = useSelector(
    (state) => state.posTransaction.selectedClient
  );

  const initialDate = useSelector(
    (state) => state.posTransaction.transactionDate
  );

  const [transactionDate, setCurrentTransactionDate] = useState(
    initialDate ?? ""
  );

  const clientList = useSelector(
    (state) => state.clients.clientList?.data ?? []
  );

  const dispatch = useDispatch();

  function onTransactionDateUpdated(event) {
    setCurrentTransactionDate(event.target.value);
    dispatch(setTransactionDate({ transactionDate: event.target.value }));
  }

  function clearTransaction() {
    if (isLoading) {
      return;
    }

    dispatch(resetTransactionState());
    dispatch(clearSubmittedTransaction());
    setCurrentTransactionDate("");

    router.replace("/merchants/transactions/v3/new", undefined, {
      shallow: true,
    });
  }

  function contactSelected(value) {
    if (value.value) {
      let params = {
        client_id: value.value,
      };
      store.dispatch(setClient(params));

      let client = parseInt(value?.value);
      client = clientList.find((item) => item.id == client);
      params = {
        client: client,
      };
      store.dispatch(setSelectedClient(params));
    }
  }

  const transactionItems = useSelector(
    (state) => state.posTransaction.transactionItems
  );
  const discount = useSelector((state) => state.posTransaction.discount);

  let grand_total = transactionItems.reduce(
    (partialSum, item) => partialSum + item.sub_total,
    0
  );

  if (discount) {
    grand_total -= discount;
  }

  //Get Query Parameter for Closing Booking

  const { bookingId } = router.query;

  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !bookingId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["bookingId"] = bookingId;

    store.dispatch(fetchBookingRedirect(params));
  }, [accessToken, status, bookingId]);

  useEffect(() => {
    //TODO:: Get Sellable ID

    store.dispatch(addTransactionItem(bookingId));
  }, [bookingId]);

  //Get Query Parameter for Closing Online Orders

  const { orderId } = router.query;

  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !orderId) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["orderId"] = orderId;

    store.dispatch(fetchOrderRedirect(params));
  }, [accessToken, status, orderId]);

  useEffect(() => {
    //TODO:: Get Sellable ID

    store.dispatch(addTransactionItem(orderId));
  }, [orderId]);

  return (
    <div className="bg-white rounded-xl py-4 space-x-1 h-full">
      <div className="flex px-5 justify-between flex-col md:flex-row">
        {!isLoading && <h1 className="text-2xl font-bold">New Order</h1>}
        {isLoading && <StatelessLoadingSpinner />}
        <div className="flex flex-wrap gap-1 items-center">
          <TransactionMetadataModal
            canBackDate={useSelector(
              hasBeenGranted("can_backdate_transaction")
            )}
            onTransactionDateUpdated={onTransactionDateUpdated}
            transactionDate={transactionDate}
            contactSelected={contactSelected}
            selectedContact={selectedContact}
          />

          <NewClientModal />

          {isRestaurantAc && (
            <Button
              variant="outline"
              color="blue"
              leftIcon={<IconLayoutGridAdd size={15} />}
              onClick={() => store.dispatch(showViewTables())}
            >
              Tables
            </Button>
          )}

          <Button
            variant="outline"
            color="red"
            leftIcon={<IconX size={15} />}
            loading={isLoading}
            onClick={clearTransaction}
          >
            Clear
          </Button>
        </div>
      </div>

      <section className="mt-4 mb-2 px-2">
        <SelectedContactPreview selectedClient={selectedClient} />
      </section>

      <section className="flex flex-col w-full bg-lighter h-[30vh] max-h-[35vh] lg:h-[40vh] lg:max-h-[45vh] rounded-xl overflow-y-scroll pr-5">
        <StaffContextProvider>
          {/* <div>{data}</div> */}
          <TitemList />
        </StaffContextProvider>
      </section>

      <section className="flex flex-wrap space-y-1 w-full">
        <div className="w-full">
          <TextInput
            onChange={() => {}}
            type="text"
            label="Total"
            placeholder="Total"
            value={new Intl.NumberFormat().format(grand_total)}
          />
        </div>
      </section>

      <div className="mt-3">
        <OrderDetailsActions />
      </div>
    </div>
  );
}

export default OrderDetails;
