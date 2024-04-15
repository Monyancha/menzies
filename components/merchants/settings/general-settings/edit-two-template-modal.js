import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { getBookingsList } from "../../../../store/merchants/bookings/bookings-slice";
import { useRouter } from "next/router";
import store from "../../../../store/store";
import { IconEdit, IconCash } from "@tabler/icons";
import { getLoyaltyTemplatesTwo } from "../../../../store/merchants/settings/access-control-slice";

function EditTwoTemplateModale({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const itemId = item?.id;

  const [loading, setLoading] = useState(false);
  const [perSpend, setPerSpend] = useState(item?.per_spend.toString());
  const [perVisit, setPerVisit] = useState(item?.per_visit.toString());
  const [isChecked, setIsChecked] = useState(true);
  const [x_no_of_visits, setNoVisits] = useState(item?.per_visit.toString());
  const [points_awarded, setPointsAwarded] = useState(
    item?.points_awarded_after_visits.toString()
  );
  const [days_to_expire, setDaysToExpire] = useState(item?.no_of_days);
  const [redemption, setRedemption] = useState(
    item?.redemption_rate.toString()
  );

  function clearForm() {
    setPerSpend("");
    setPerVisit("");
    setRedemption("");
  }

  async function handleSubmit() {
    setLoading(true);

    const accessToken = session.user.accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/template/update/${itemId}`;

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
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update template.");
      }

      showNotification({
        title: "Success!",
        message: "Template updated successfully.",
        color: "green",
      });

      const params = {};
      params["accessToken"] = session.user.accessToken;
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

  return (
    <>
      <Modal
        opened={opened}
        title="Edit Template"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <TextInput
            placeholder="Redeem Points After X No Of Visits Eg 3"
            label="Redeem Points After X No Of Visits"
            defaultValue={x_no_of_visits}
            onChange={(e) => setNoVisits(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Points Awarded After X No Of Visits"
            label="Points Awarded After X No Of Visits"
            defaultValue={points_awarded}
            onChange={(e) => setPointsAwarded(e.currentTarget.value)}
          />
          <TextInput
            placeholder="No Of Days After Which Points Will Expire "
            label="No Of Days After Which Points Will Expire "
            defaultValue={days_to_expire}
            onChange={(e) => setDaysToExpire(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Update Template
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEdit size={16} />}
        onClick={() => setOpened(true)}
        size="sm"
        variant="outline"
      >
        Edit
      </Button>
    </>
  );
}

export default EditTwoTemplateModale;
