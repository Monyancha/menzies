import { parseValidInt } from "@/lib/shared/data-formatters";
import { Button, Checkbox, Radio, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchCreditReminderSetting,
  submitCreditReminderSetting,
} from "../../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";

function CreditRemindersSettingsForm() {
  const [dayType, setDayType] = useState("days");
  const [numDay, setNumDay] = useState("");
  const [numDate, setNumDate] = useState("");
  const [recurring, setRecurring] = useState(false);

  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creditSettings = useSelector(
    (state) => state.transactions.creditReminderSettingData
  );
  const isLoading = useSelector(
    (state) => state.transactions.creditReminderSettingStatus === "loading"
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    store.dispatch(
      fetchCreditReminderSetting({ accessToken: session.user.accessToken })
    );
  }, [session, status]);

  useEffect(() => {
    if (!creditSettings) {
      return;
    }

    setNumDay(creditSettings?.details?.days_x ?? "");
    setNumDate(creditSettings?.details?.date_x ?? "");
    setRecurring(creditSettings?.details?.recurring);

    if (creditSettings?.details?.days_x === null) {
      setDayType("date");
    }
  }, [creditSettings]);

  async function submitForm() {
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["daysX"] = numDay === "" ? null : parseValidInt(numDay);
    params["dateX"] = numDate === "" ? null : parseValidInt(numDate);
    params["recurring"] = recurring;

    try {
      setIsSubmitting(true);

      await store.dispatch(submitCreditReminderSetting(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }

      showNotification({
        title: "Warning",
        message,
        color: "orange",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card>
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 gap-2">
              <div className="mb-2">
                <Radio.Group
                  value={dayType}
                  onChange={setDayType}
                  label="Reminder Type"
                  description="After x Days or on Date x of each month"
                  withAsterisk
                >
                  <Radio value="days" label="After x Days" />
                  <Radio value="date" label="Day x of the month" />
                </Radio.Group>
              </div>

              {dayType === "days" && (
                <TextInput
                  type="number"
                  label="After x Days"
                  placeholder="Number of Days"
                  withAsterisk
                  value={numDay}
                  onChange={(e) => {
                    setNumDay(e.currentTarget.value);
                    setNumDate("");
                  }}
                />
              )}

              {dayType === "date" && (
                <TextInput
                  type="number"
                  label="Send on Day x of the Month"
                  placeholder="Day x of the Month"
                  withAsterisk
                  value={numDate}
                  onChange={(e) => {
                    setNumDate(e.currentTarget.value);
                    setNumDay("");
                  }}
                />
              )}

              <div className="my-2">
                <Checkbox
                  checked={recurring}
                  onChange={(event) =>
                    setRecurring(event.currentTarget.checked)
                  }
                  label="Is recurring"
                />
              </div>
            </div>

            <section className="my-3">
              <Button onClick={submitForm} loading={isSubmitting}>
                Save
              </Button>
            </section>
          </>
        )}

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}
      </Card>
    </>
  );
}

export default CreditRemindersSettingsForm;
