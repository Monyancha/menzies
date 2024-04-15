import { useRouter } from "next/router";
import LinkButton from "../../../ui/actions/link-button";
import LinkCrumb from "../../../ui/actions/link-crumb";
import MutedCrumb from "../../../ui/actions/muted-crumb";
import BreadCrumbsHeader from "../../../ui/layouts/breadcrumbs-header";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Group, Button, TextInput } from "@mantine/core";
import { getPaymentSettings } from "../../../../store/merchants/settings/access-control-slice";

function PaymentSettings() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [paybill, setPaybill] = useState("");
  const [secret, setSecret] = useState("");
  const [key, setKey] = useState("");
  const [pass, setPass] = useState("");

  const itemStatus = useSelector(
    (state) => state.accessControl.getPaymentSettingsStatus
  );
  const item = useSelector((state) => state.accessControl.getPaymentSettings);

  const isLoading = itemStatus === "loading";

  useEffect(() => {
    if (!item) {
      return;
    }
    //Set Default Params
    setPaybill(item?.businessshortcode);
    setSecret(item?.consumer_secret);
    setKey(item?.consumer_key);
    setPass(item?.passkey);
  }, [item]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getPaymentSettings(params));
  }, [session, status]);

  const submitData = async (event) => {
    event.preventDefault();

    const data = {
      consumer_secret: secret,
      consumer_key: key,
      passkey: pass,
      businessshortcode: paybill,
    };

    console.log("Payload", data);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/payment-settings/store`;

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

    setLoading(true);
    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log("Api Response", result);

    if (!result.error) {
      showNotification({
        title: "Success",
        message: result.message,
        color: "green",
      });
      setLoading(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full bg-white rounded-t-xl px-6 py-4 pb-8">
      <Group grow>
        <TextInput
          placeholder="Pay Bill or Till Number"
          label="Pay Bill or Till Number"
          value={paybill}
          onChange={(event) => setPaybill(event.currentTarget.value)}
        />
        <TextInput
          placeholder="Consumer Secret"
          label="Consumer Secret"
          value={secret}
          onChange={(event) => setSecret(event.currentTarget.value)}
        />
      </Group>

      <Group grow>
        <TextInput
          placeholder="Consumer Key"
          label="Consumer Key"
          value={key}
          onChange={(event) => setKey(event.currentTarget.value)}
        />
        <TextInput
          placeholder="Pass Key"
          label="Pass Key"
          value={pass}
          onChange={(event) => setPass(event.currentTarget.value)}
        />
      </Group>
      <div className="flex mt-4 justify-end mx-2 space-x-2">
        <Button size="md" onClick={submitData} loading={loading}>
          Save Credentials
        </Button>
      </div>
    </div>
  );
}

export default PaymentSettings;
