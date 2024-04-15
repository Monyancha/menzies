import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchTransactionList } from "../../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../../store/store";
import TransactionsTable from "../../transactions/transactions-table";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { getClientMessages } from "../../../../store/merchants/partners/clients-slice";
import { formatDate } from "../../../../lib/shared/data-formatters";

function ClientMessagesView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const clientId = router?.query?.clientId;

  const messageStatus = useSelector(
    (state) => state.clients.getClientMessagesStatus
  );

  const messages = useSelector((state) => state.clients.getClientMessages);

  const isLoading = messageStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["clientId"] = clientId;

    store.dispatch(getClientMessages(params));
  }, [session, status, clientId]);

  console.log("Client Messages", messages);

  const submitMessage = async (event) => {
    event.preventDefault();

    if (!event.target.message.value) {
      showNotification({
        title: "Error",
        message: "Message is required!",
        color: "red",
      });

      return;
    }

    const data = {
      message: event.target.message.value,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/partners/clients/${clientId}/send-message`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!result.error) {
      showNotification({
        title: "Success",
        message: "Message has been sent successfully",
        color: "green",
      });
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["clientId"] = clientId;

      store.dispatch(getClientMessages(params));
      // router.push("/merchants/partners/clients");
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.error,
        color: "red",
      });
    }

    console.log(result);
  };

  return (
    <Fragment>
      <form onSubmit={submitMessage}>
        <div className="h-full w-full bg-white rounded-xl px-6 py-8 space-y-1">
          <div className="bg-lighter px-6 py-5 mb-4 rounded-xl max-h-72 overflow-y-scroll">
            {messages?.length === 0 && (
              <div className="text-sm px-2 py-2 italic text-grey-100">
                No messages yet
              </div>
            )}
            <ul className="space-y-3">
              {!isLoading &&
                messages &&
                messages?.map((item) => (
                  <>
                    <li className="flex justify-end items-end space-x-3">
                      <div
                        key={item?.id}
                        className="bg-white rounded-xl shadow-sm border border-grey-50 p-3 space-y-2  w-fit max-w-full flex flex-col items-end"
                      >
                        <div>{item?.message}</div>
                        <div className="text-sm text-grey-100">
                          {formatDate(item?.created_at)}
                        </div>
                      </div>
                    </li>
                  </>
                ))}
            </ul>
          </div>
          <div className="text-dark text-sm">
            <span>Message</span>
          </div>
          <textarea
            rows={3}
            className="input-primary h-fit text-sm"
            required=""
            placeholder="Enter a  Message"
            name="message"
          />
          <div className="flex justify-end">
            <button className="btn btn-primary mt-2 gap-2">
              Send
              <i className="fa-solid fa-paper-plane text-lg" />
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
}

export default ClientMessagesView;
