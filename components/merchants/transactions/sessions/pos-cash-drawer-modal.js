import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import store from "@/store/store";
import { updateCurrentCashDrawer } from "@/store/merchants/transactions/pos-sessions-slice";

function PosCashDrawerModal() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");

  function clearForm() {
    setType("");
    setAmount("");
    setNarration("");
  }

  async function handleSubmit() {
    const params = {
      accessToken,

      type,
      amount,
      reason: type === "debit" ? "cash_in" : "cash_out",
      narration,
    };

    try {
      setIsSubmitting(true);

      await store.dispatch(updateCurrentCashDrawer(params)).unwrap();

      showNotification({
        title: "Success!",
        message: "Record created successfully",
        color: "green",
      });

      clearForm();
      setOpened(false);
      setIsSubmitting(false);
    } catch (error) {
      let message = "Could not save record";
      message = e.message ? e.message : message;
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
      <Modal
        opened={opened}
        title="Cash Drawer"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Cash Drawer</span>

          <Select
            placeholder="Type"
            label="Type"
            value={type}
            onChange={setType}
            data={[
              { value: "debit", label: "Cash In" },
              { value: "credit", label: "Cash Out" },
            ]}
            searchable
            withAsterisk
            clearable
          />

          <TextInput
            placeholder="Amount"
            label="Amount"
            withAsterisk
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Narration"
            label="Narration"
            value={narration}
            onChange={(e) => setNarration(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        variant="outline"
        leftIcon={<IconPencil size={16} />}
        onClick={() => setOpened(true)}
      >
        Cash Drawer
      </Button>
    </>
  );
}

export default PosCashDrawerModal;
