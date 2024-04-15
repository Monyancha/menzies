import { Text, Button, Group, TextInput, Checkbox } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPackagesList,
  sendSubscriptionStk,
} from "../../../../store/merchants/settings/access-control-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Radio } from "@mantine/core";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { showNotification } from "@mantine/notifications";
import SubscriptionHistoryList from "./subscription-history-list";
import { Tabs } from "@mantine/core";
import { IconSquarePlus, IconLayout } from "@tabler/icons";

function BillingDetailsView() {
  const { data: session, status } = useSession();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packageList = useSelector((state) => state.accessControl.packagesList);
  const packageListStatus = useSelector(
    (state) => state.accessControl.packagesListStatus
  );
  const arePackagesLoading = packageListStatus === "loading";

  const userId = useSelector(
    (state) => state.accessControl.myAccountData?.id ?? -1
  );

  const selectedPackageDetails = packageList?.find(
    (item) => item.id === selectedPackage
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    store.dispatch(
      fetchPackagesList({ accessToken: session.user.accessToken })
    );
  }, [session, status]);

  useEffect(() => {
    if (!session || status !== "authenticated" || !userId === -1) {
      return;
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
      disableStats: true,
      encrypted: true,
      encrypted: true,
      forceTLS: true,
    });

    echo
      .channel(`subscriptions.${userId}`)
      .subscribed(() => {
        console.log("ECHO:: Subscribed to subscriptions channel");
      })
      .listen(".stk-safaricom-response", (data) => {
        console.log(
          "ECHO::Received:: ",
          data,
          data?.result_code,
          data?.check_out_id,
          data?.transaction_code
        );

        if (data?.result_code === 0) {
          showNotification({
            title: "Success",
            message: "Received payment",
            color: "green",
          });
          setSelectedPackage(null);
        } else if (data?.result_code !== 0) {
          showNotification({
            title: "Warning",
            message: "Could not process payment",
            color: "orange",
          });
        }
      })
      .error((e) => {
        console.log("Could not connect ", e);
      });
  }, [session, status, userId]);

  return (
    <>
      <div className="w-full">
        <Tabs defaultValue="new-subscription">
          <Tabs.List>
            <Tabs.Tab
              value="new-subscription"
              icon={<IconSquarePlus size={16} />}
            >
              New Subscription
            </Tabs.Tab>
            <Tabs.Tab
              value="subscription-history"
              icon={<IconLayout size={16} />}
            >
              Subscription History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="new-subscription" pt="xs">
            {!selectedPackage && (
              <PackageListSection
                packageList={packageList}
                isLoading={arePackagesLoading}
                onSelectPackage={(id) => setSelectedPackage(id)}
              />
            )}

            {selectedPackageDetails && (
              <SelectedPackageCard
                details={selectedPackageDetails}
                onCancelPackage={() => setSelectedPackage(null)}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="subscription-history" pt="xs">
            <SubscriptionHistoryList />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}

const SelectedPackageCard = ({ details, onCancelPackage }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const [billingCost, setBillingCost] = useState(details.cost);
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneValidation, setPhoneValidation] = useState("");
  const [sendingStkPush, setSendingStkPush] = useState(false);

  async function processMpesaPayment() {
    if (!phoneNumber) {
      setPhoneValidation("Enter a valid phone number");
    } else {
      setPhoneValidation(null);
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["phone"] = phoneNumber;
    // params["amount"] = 1;
    params["amount"] = billingCost;
    params["package_id"] = details.id;
    params["billing_period"] = billingPeriod;

    try {
      setSendingStkPush(true);

      await dispatch(sendSubscriptionStk(params)).unwrap();

      showNotification({
        title: "Info",
        message: "Awaiting Payment",
        color: "blue",
      });
    } catch (e) {
      showNotification({
        title: "Warning",
        message: e?.message ?? "Could not send STK Push",
        color: "orange",
      });
    } finally {
      setSendingStkPush(false);
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <Card>
        <div className="flex justify-between">
          <span className="text-lg font-bold text-dark">{details.name}</span>
          <Button
            size="xs"
            color="red"
            variant="outline"
            onClick={onCancelPackage}
          >
            Cancel
          </Button>
        </div>

        <Text size="sm" color="dimmed">
          {details.description}
        </Text>

        <section className="flex-col space-y-2">
          <Radio.Group
            value={billingCost}
            onChange={setBillingCost}
            name="billingCost"
            label="How do you prefer to be billed?"
            description="Billing period"
            withAsterisk
          >
            <Radio
              value={details.cost}
              onClick={() => setBillingPeriod("monthly")}
              label={`Monthly (KES ${formatNumber(details.cost)})`}
            />
            <Radio
              value={details.quarterly_cost}
              onClick={() => setBillingPeriod("quarterly")}
              label={`Quarterly (KES ${formatNumber(details.quarterly_cost)})`}
            />
            <Radio
              value={details.half_year_cost}
              onClick={() => setBillingPeriod("half_yearly")}
              label={`Half Yearly (KES ${formatNumber(
                details.half_year_cost
              )})`}
            />
            <Radio
              value={details.annual_cost}
              onClick={() => setBillingPeriod("annually")}
              label={`Yearly (KES ${formatNumber(details.annual_cost)})`}
            />
          </Radio.Group>

          <TextInput
            type="text"
            placeholder="Phone Number"
            label="Phone Number"
            error={phoneValidation}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </section>

        <Button
          variant="filled"
          color="green"
          fullWidth
          mt="md"
          radius="md"
          onClick={processMpesaPayment}
          loading={sendingStkPush}
        >
          Pay
        </Button>
      </Card>
      <ManualPaymentInstructions />
    </div>
  );
};

const ManualPaymentInstructions = () => {
  const { data: session } = useSession();

  const [checked, setChecked] = useState(false);

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label="Pay Manually"
        />

        {checked && (
          <>
            <div className="text-md text-darkest flex flex-col gap-2">
              <span className="text-success font-bold">Via M-Pesa:</span>

              <div className="flex flex-col border-l-4 border-success bg-success/5 p-3">
                <p className="pl-3 flex gap-2 items-end">
                  <span className="text-sm">Paybill:</span>
                  <span className="tracking-wider font-bold">4085473</span>
                </p>
                <p className="pl-3 flex gap-2 items-end">
                  <span className="text-sm">Account Number:</span>
                  <span className="tracking-wider font-bold">
                    {session?.user?.merchant_name ??
                      session?.user?.name ??
                      "Merchant Name"}
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

const PackageListSection = ({ packageList, isLoading, onSelectPackage }) => {
  return (
    <>
      {!isLoading && (
        <div className="w-full grid gap-2 gird-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {packageList?.map((item) => (
            <PackageCard
              key={item.id}
              name={item.name}
              description={item.description}
              onSelectPackage={() => onSelectPackage(item.id)}
            />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </>
  );
};

const PackageCard = ({ name, description, onSelectPackage }) => {
  return (
    <div className="w-full h-full">
      <Card>
        <Group position="apart" mt="md" mb="xs">
          <span className="text-lg font-bold text-dark">{name}</span>
        </Group>

        <Text size="sm" color="dimmed">
          {description}
        </Text>

        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={() => onSelectPackage()}
        >
          Choose Plan
        </Button>
      </Card>
    </div>
  );
};

export default BillingDetailsView;
