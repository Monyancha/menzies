import { Button, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons";
import { useState, useEffect, useMemo } from "react";
import { ClientContextProvider } from "../../../../store/merchants/partners/client-context";
import ContactSelect from "../../utils/contact-select";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import store from "@/store/store";
import {
  checkClientPoints,
  clearPoints,
  redeemPoints,
  resetRedeemPoints,
  checkUnRedeemedPoints,
} from "@/store/merchants/transactions/transaction-slice";

function TransactionMetadataModal({
  canBackDate,
  transactionDate,
  selectedContact,
  contactSelected,
  onTransactionDateUpdated,
}) {
  const [opened, setOpened] = useState(false);
  const [opened_two, setOpenedTwo] = useState(false);
  // const [opened_three, setOpenedThree] = useState(false);
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [c_id, setId] = useState("");

  function contactSelectedHandler(value) {
    contactSelected(value);
    setOpened(false);
    
    store.dispatch(clearPoints());
    // alert(value)
    const params = {};
    params["accessToken"] = accessToken;
    params["client_id"] = value?.value;
    setId(value?.value);

    store.dispatch(checkClientPoints(params));
    store.dispatch(checkUnRedeemedPoints(params));

    showNotification({
      title: "Success",
      message: `Selected ${value?.label}`,
      color: "green",
    });
  }

  const award_data = useSelector(
    (state) => state.posTransaction.clientAwardPoints
  );

  const clientUnredeemedPoints = useSelector(
    (state) => state.posTransaction.clientUnredeemedPoints
  );

  useEffect(() => {
    if (award_data != null && selectedContact) {
      setOpenedTwo(true);
      // store.dispatch(redeemPoints());
      // } else {
      //   store.dispatch(clearPoints());
      // }
    }

    // else
    // {
    //   alert("Points Not Yet Reached");
    // }
  }, [award_data, selectedContact, setOpened]);

  const acceptPoints = () => {
    store.dispatch(redeemPoints());
    setOpenedTwo(false);
  };

  const acceptPointsR = () => {
    setOpenedThree(false);
  };

  const removePoints = () => {
    store.dispatch(clearPoints());
    setOpenedTwo(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Metadata"
        onClose={() => setOpened(false)}
        overflow="inside"
      >
        {canBackDate && (
          <section className="mt-1">
            <TextInput
              label="Transaction Date"
              description="For backdated transactions only"
              type="date"
              onChange={onTransactionDateUpdated}
              value={transactionDate}
            />
          </section>
        )}

        <section className="mt-3">
          <ClientContextProvider>
            <ContactSelect
              onContactChanged={contactSelectedHandler}
              selectedContactId={selectedContact}
            />
          </ClientContextProvider>
        </section>
      </Modal>

      {/* <Modal
        opened={opened_two}
        onClose={() => removePoints()}
        padding="xs"
        overflow="inside"
      >
        <span className="px-2">
          After This Transaction Client Will Be Awarded
          {" " + award_data + " "}
          Points.Do You Want To Redeem Them?
        </span>
        <section className="flex justify-end p-2 rounded-lg my-3 gap-2">
          <Button variant="default" onClick={removePoints}>
            NO
          </Button>

          <Button color="green" onClick={acceptPoints}>
            YES
          </Button>
        </section>
      </Modal> */}

      {/* <Modal
        opened={opened_three}
        onClose={() => removePoints()}
        padding="xs"
        overflow="inside"
      >
        <span className="px-2">
          The Client Still Has
          {" " + clientUnredeemedPoints + " "}
         UnRedeemed Points.Do You Want To Redeem Them?
        </span>
        <section className="flex justify-end p-2 rounded-lg my-3 gap-2">
          <Button variant="default" onClick={removePoints}>
            NO
          </Button>

          <Button color="green" onClick={acceptPointsR}>
            YES
          </Button>
        </section>
      </Modal> */}

      <Button
        leftIcon={<IconPencil size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        Customers
      </Button>
    </>
  );
}

export default TransactionMetadataModal;
