import { Modal, useMantineTheme, Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../../store/store";
import { getBookingsList } from "../../../store/merchants/bookings/bookings-slice";
import { useRouter } from "next/router";
import { getAllInvoices } from "../../../store/merchants/accounts/acounts-slice";
import { IconCurrencyDollar } from "@tabler/icons";
import { useSelector } from "react-redux";

function ConvertInvoiceModal({ item }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const itemId = item?.id;

  const branch_id = useSelector((state) => state.branches.branch_id);

  const convertItem = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const endpoint = `${API_URL}/accounts/quotations/convert-to-invoice/${itemId}`;
    const accessToken = session.user.accessToken;
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Quotation successfully converted to Invoice!",
        color: "green",
      });
      setOpened(false);
      //getAllInvoices
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
      store.dispatch(getAllInvoices(params));
      //
      // router.push(`/merchants/accounts/invoices/edit/${result[0]?.id}`);
      setTimeout(() => {
        router.push(`/merchants/accounts/invoices/edit/${result[0]?.id}`);
      }, 1000); // wait for 1 second (1,000 milliseconds) before redirecting
      showNotification({
        title: "Redirecting...",
        message:
          "We are now redirecting you to the invoice page...please wait...!",
        color: "cyan",
      });
    } else {
      showNotification({
        title: "Error",
        message:
          "An API Error Occured: Error Code: " +
          response.status +
          " Error Message: " +
          response.statusText,
        color: "red",
      });
    }
  };

  return (
    <>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        title={`Confirm Convertion of ${item?.name + " to an Invoice"}`}
        onClose={() => setOpened(false)}
        padding="xs"
      >
        {/* Modal content */}

        <section className="flex flex-col">
          <h4>Are you sure you want to convert the quotation to an invoice?</h4>
        </section>

        <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right">
          <Button
            onClick={() => setOpened(false)}
            variant="outline"
            size="xs"
            className="mr-2"
            color="red"
          >
            No Go Back
          </Button>

          <Button onClick={convertItem} variant="outline" size="xs">
            Yes Convert
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconCurrencyDollar size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
      >
        Convert Invoice
      </Button>
    </>
  );
}

export default ConvertInvoiceModal;
