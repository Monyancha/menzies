import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { IconFold } from "@tabler/icons";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { mergeUnbatched } from "../../../../store/merchants/inventory/batches-slice";
import store from "../../../../store/store";

export default function MergeUnbatchedModal({ fromBatch }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyingPrice, setBuyingPrice] = useState(
    fromBatch?.batcherable?.buying_price ?? ""
  );
  const [sellingPrice, setSellingPrice] = useState(
    fromBatch?.batcherable?.selling_price ?? ""
  );

  const router = useRouter();

  function clearForm() {
    setBuyingPrice("");
    setSellingPrice("");
  }

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["from_batch_id"] = fromBatch.id;
    params["buying_price"] = buyingPrice;
    params["selling_price"] = sellingPrice;

    try {
      setIsSubmitting(true);
      await store.dispatch(mergeUnbatched(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Changes saved successfully",
        color: "green",
      });

      clearForm();
      setOpened(false);

      router.replace("/merchants/inventory/batches");
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save changes";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title={`Merge ${fromBatch?.batchedable?.sellable?.name} Batches`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 mt-2 bg-light p-3 rounded-lg">
          <TextInput
            placeholder="Buying Price"
            label="Buying Price"
            type="number"
            withAsterisk
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Selling Price"
            label="Selling Price"
            type="number"
            withAsterisk
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Merge
          </Button>
        </section>
      </Modal>

      <Button
        loading={isSubmitting}
        leftIcon={<IconFold size={14} />}
        variant="outline"
        color="green"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Batch with this
      </Button>
    </>
  );
}
