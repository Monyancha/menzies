import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import {
  fetchMarketplaceCategories,
  submitMarketplaceCategory,
} from "../../../../store/merchants/inventory/categories-slice";

function PrintSingleStaffTransaction({ item }) {
  const { data: session, status } = useSession();

  const transactionId = item?.id;

  const printTransaction = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/staff/transaction/${transactionId}/export`;

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
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = `Print.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Print Successfull",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <button
        onClick={printTransaction}
        className="btn btn-sm btn-primary btn-outline gap-2 w-20"
      >
        <i className="fa-solid fa-print" />
        Print
      </button>
    </>
  );
}

export default PrintSingleStaffTransaction;
