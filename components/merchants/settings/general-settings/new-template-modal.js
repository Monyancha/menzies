import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
  Radio,
  Group,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { getBookingsList } from "../../../../store/merchants/bookings/bookings-slice";
import { useRouter } from "next/router";
import store from "../../../../store/store";
import { IconPlus, IconCash } from "@tabler/icons";
import {
  getLoyaltyTemplates,
  getLoyaltyTemplatesTwo,
} from "../../../../store/merchants/settings/access-control-slice";

function NewLoyaltyTemplateModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [perSpend, setPerSpend] = useState("");
  const [perVisit, setPerVisit] = useState("");
  const [redemption, setRedemption] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [x_no_of_visits, setNoVisits] = useState("");
  const [points_awarded, setPointsAwarded] = useState("");
  const [days_to_expire, setDaysToExpire] = useState("");

  function clearForm() {
    setPerSpend("");
    setPerVisit("");
    setRedemption("");
    setNoVisits("");
    setPointsAwarded("");
    setDaysToExpire("");
  }

  async function handleSubmit() {
    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/template/store`;

    const data = {
      perspend: perSpend,
      pervisit: perVisit,
      redemption_rate: redemption,
      isChecked: isChecked,
      x_no_of_visits: x_no_of_visits,
      days_to_expire: days_to_expire,
      points_awarded: points_awarded,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create template.");
      }

      showNotification({
        title: "Success!",
        message: "Template created successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getLoyaltyTemplates(params));
      store.dispatch(getLoyaltyTemplatesTwo(params));

      clearForm();
      setOpened(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  // const handleChecked = (value) => {
  //   setIsChecked(value);
  // }

  return (
    <>
      <Modal
        opened={opened}
        title="New Template"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="65%"
      >
        <section className="flex flex-row space-y-2 bg-light p-3 rounded-lg">
          <Radio.Group
            name="favoriteFramework"
            label="Select One Of The Following Templates"
            // description="This is anonymous"
          >
            <Group mt="xs">
              <Radio
                value="false"
                onClick={() => setIsChecked(false)}
                label="Points Awarded Per Amount Spent"
              />
              <Radio
                value="true"
                onClick={() => setIsChecked(true)}
                label="Points Awarded After No Of Visits"
              />
            </Group>
          </Radio.Group>
        </section>
        {!isChecked && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <TextInput
              placeholder="Points Per KSh. 1,000"
              label="Points Per KSh. 1,000"
              value={perSpend}
              onChange={(e) => setPerSpend(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Points Per Visit"
              label="Points Per Visit"
              value={perVisit}
              onChange={(e) => setPerVisit(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Points equivalent to KSh. 1"
              label="Points equivalent to KSh. 1"
              description="Redemption Rate"
              value={redemption}
              onChange={(e) => setRedemption(e.currentTarget.value)}
            />
          </section>
        )}

        {isChecked && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <TextInput
              placeholder="Redeem Points After X No Of Visits Eg 3"
              label="Redeem Points After X No Of Visits"
              value={x_no_of_visits}
              onChange={(e) => setNoVisits(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Points Awarded After X No Of Visits"
              label="Points Awarded After X No Of Visits"
              value={points_awarded}
              onChange={(e) => setPointsAwarded(e.currentTarget.value)}
            />
            <TextInput
              placeholder="No Of Days After Which Points Will Expire "
              label="No Of Days After Which Points Will Expire "
              value={days_to_expire}
              onChange={(e) => setDaysToExpire(e.currentTarget.value)}
            />
          </section>
        )}

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Save Template
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
      >
        New Template
      </Button>
    </>
  );
}

export default NewLoyaltyTemplateModal;
