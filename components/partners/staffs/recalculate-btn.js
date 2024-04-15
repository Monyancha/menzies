import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { getStaffTransactions } from "../../../../store/merchants/partners/staff-slice";

function RecalculateBtn({ item, staffId }) {
  const { data: session, status } = useSession();

  const transactionId = item?.id;

  const doRecalculation = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/staff/${staffId}/recalculate/${transactionId}`;

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
        message: "Recalculation Successfull",
        color: "green",
      });
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["staffId"] = staffId;
      store.dispatch(getStaffTransactions(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.error,
        color: "red",
      });
    }
  };

  return (
    <>
      <button
        onClick={doRecalculation}
        className="btn btn-sm btn-primary btn-outline gap-2 mr-2"
      >
        <i className="fa-solid fa-redo" />
        Recalculate
      </button>
    </>
  );
}

export default RecalculateBtn;
