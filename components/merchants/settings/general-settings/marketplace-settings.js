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
import {
  Group,
  Checkbox,
  Button,
  TextInput,
  Switch,
  Textarea,
} from "@mantine/core";
import { getMarketplaceSettings } from "../../../../store/merchants/settings/access-control-slice";
import { IconPlus, IconTrash } from "@tabler/icons";

const BASE_URL = process.env.NEXT_URL;

function MarketplaceSettings() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [deliveryReturns, setDeliveryReturns] = useState("");
  const [pickDelivery, setPickDelivery] = useState("");
  const [isMpesaActive, setIsMpesaActive] = useState("");
  const [showImages, setShowImages] = useState('');
  const [hideWebsite, setHideWebsite] = useState('');
  //setMpesaTillNo
  const [mpesaTillNo, setMpesaTillNo] = useState("");

  const merchant = useSelector(
    (state) => state.accessControl.myAccountData
  );

  console.log("Marketplace Account Data", merchant);

  //Start Delivery zone
  const [zones, setZones] = useState([{ name: "", fee: "" }]);

  const addZone = () => {
    setZones([...zones, { name: "", fee: "" }]);
  };

  const removeZone = (index) => {
    const newZones = [...zones];
    newZones.splice(index, 1);
    setZones(newZones);
  };

  const updateZoneName = (event, index) => {
    const newZones = [...zones];
    newZones[index].name = event.target.value;
    setZones(newZones);
  };

  const updateZoneFee = (event, index) => {
    const newZones = [...zones];
    newZones[index].fee = parseInt(event.target.value);
    setZones(newZones);
  };

  //End delivery zone

  const itemStatus = useSelector(
    (state) => state.accessControl.getMarketplaceSettingsStatus
  );
  const item = useSelector(
    (state) => state.accessControl.getMarketplaceSettings
  );

  const isLoading = itemStatus === "loading";

  console.log("Items", item);

  useEffect(() => {
    if (!item) {
      return;
    }
    //Set Default Params
    setPaymentOption(item?.return_payment_option);
    setReturnPolicy(item?.return_policy);
    setAboutUs(item?.about_us);
    setDeliveryReturns(item?.delivery_returns);
    setPickDelivery(item?.pickup_delivery);
    setIsMpesaActive(item?.is_mpesa_active);
    setShowImages(item?.show_images);
    setHideWebsite(item?.hide_website);
    setZones(item?.delivery_zone ? JSON.parse(item?.delivery_zone) : []);
  }, [item]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getMarketplaceSettings(params));
  }, [session, status]);

  //handleMpesaSwitchChange
  const handleMpesaSwitchChange = () => {
    setIsMpesaActive(!isMpesaActive);
  };

  const submitData = async (event) => {
    event.preventDefault();

    //
    console.log("Delivery Zones", zones);

    const data = {
      return_payment_option: paymentOption,
      return_policy: returnPolicy,
      delivery_returns: deliveryReturns,
      pickup_delivery: pickDelivery,
      about_us: aboutUs,
      is_mpesa_active: isMpesaActive,
      zones: zones,
      show_images: showImages,
      hide_website: hideWebsite,
    };

    console.log("New Payload", data);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/marketplace-settings/store`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
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
          label="Marketplace Link"
          placeholder="My Marketplace Merchant Link"
          value={`https://ilovalue.com/marketplace/merchant/${merchant?.id}`}
        />
      </Group>

      <p>Enable STK Push</p>

      <Checkbox
        checked={isMpesaActive}
        size="md"
        description="Enable this if you have set up your M-Pesa API credentials from the M-Pesa Payments Settings."
        onChange={(event) => setIsMpesaActive(event.currentTarget.checked)}
      />

    <p>Show service images on marketplace</p>

    <Checkbox
      checked={showImages}
      size="md"
      description="Enable this if you want to show service images on the marketplace."
      onChange={(event) => setShowImages(event.currentTarget.checked)}
    />


    <p>Hide your marketplace website</p>

    <Checkbox
      checked={hideWebsite}
      size="md"
      description="Enable this if you want to hide your marketplace website."
      onChange={(event) => setHideWebsite(event.currentTarget.checked)}
    />


      <Group grow>
        <TextInput
          placeholder="M-Pesa Till No."
          label="M-Pesa Till No."
          description="Enter your M-Pesa Till number if you dont have access to M-Pesa APIs so that clients can be able to pay directly to your Till No. You will get the transaction code
          under the Online Orders Menu on your side navigation."
          value={paymentOption}
          onChange={(event) => setPaymentOption(event.currentTarget.value)}
        />
      </Group>

      <Group grow>
        <Textarea
          label="Return Policy"
          placeholder="Return Policy"
          autosize
          minRows={2}
          value={returnPolicy}
          onChange={(event) => setReturnPolicy(event.currentTarget.value)}
        />
        <Textarea
          label="About Us"
          placeholder="About Us"
          autosize
          minRows={2}
          value={aboutUs}
          onChange={(event) => setAboutUs(event.currentTarget.value)}
        />
      </Group>

      <Group grow>
        <Textarea
          label="Delivery returns"
          placeholder="Delivery returns"
          autosize
          minRows={2}
          value={deliveryReturns}
          onChange={(event) => setDeliveryReturns(event.currentTarget.value)}
        />
        <Textarea
          label="Pickup Delivery"
          placeholder="Pickup Delivery"
          autosize
          minRows={2}
          value={pickDelivery}
          onChange={(event) => setPickDelivery(event.currentTarget.value)}
        />
      </Group>

      <>
        <h2 className="mt-3">Delivery Zones</h2>
        {Array.isArray(zones) && zones.map((zone, index) => (
          <Group key={index} grow>
            <TextInput
              placeholder="Delivery Zone Name"
              value={zone.name}
              name="name"
              className="mt-2"
              onChange={(event) => updateZoneName(event, index)}
            />

            <TextInput
              placeholder="Delivery Fee (Ksh)"
              value={zone.fee}
              name="fee"
              className="mt-2"
              onChange={(event) => updateZoneFee(event, index)}
            />

            <Button
              color="red"
              className="mt-2"
              leftIcon={<IconTrash />}
              onClick={() => removeZone(index)}
            >
              Remove Zone
            </Button>
          </Group>
        ))}

        <Button className="mt-2" leftIcon={<IconPlus />} onClick={addZone}>
          Add New Delivery Zone
        </Button>
      </>

      <div className="flex mt-4 justify-end mx-2 space-x-2">
        <Button size="md" onClick={submitData} loading={loading}>
          Save Marketplace Settings
        </Button>
      </div>
    </div>
  );
}

export default MarketplaceSettings;
