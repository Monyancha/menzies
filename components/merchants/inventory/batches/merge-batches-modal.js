import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { IconFold } from "@tabler/icons";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { mergeBatches } from "../../../../store/merchants/inventory/batches-slice";
import store from "../../../../store/store";

export default function MergeBatchesModal({ fromBatch, toBatch }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyingPrice, setBuyingPrice] = useState(
    toBatch?.batcherable?.buying_price ?? ""
  );
  const [sellingPrice, setSellingPrice] = useState(
    toBatch?.batcherable?.selling_price ?? ""
  );

  const router = useRouter();
  const mergeFromId = router?.query?.merge_from_id ?? null;
  const mergeItemId = router?.query?.merge_item_id ?? null;

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
    params["to_batch_id"] = toBatch.id;
    params["buying_price"] = buyingPrice;
    params["selling_price"] = sellingPrice;

    try {
      setIsSubmitting(true);
      await store.dispatch(mergeBatches(params)).unwrap();

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
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Merge <span className="text-primary">#{fromBatch.id}</span> To{" "}
            <span className="text-primary">#{toBatch.id}</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              placeholder="From B.P"
              label="From B.P."
              type="number"
              withAsterisk
              value={fromBatch?.batcherable?.buying_price ?? "-"}
              disabled
            />

            <TextInput
              placeholder="From S.P"
              label="From S.P."
              type="number"
              withAsterisk
              value={fromBatch?.batcherable?.selling_price ?? "-"}
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TextInput
              placeholder="To B.P"
              label="To B.P."
              type="number"
              withAsterisk
              value={toBatch?.batcherable?.buying_price ?? "-"}
              disabled
            />

            <TextInput
              placeholder="To S.P"
              label="To S.P."
              type="number"
              withAsterisk
              value={toBatch?.batcherable?.selling_price ?? "-"}
              disabled
            />
          </div>
        </section>

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
        disabled={
          mergeFromId == toBatch.id || mergeItemId != toBatch?.batchedable?.id
        }
      >
        Merge Here
      </Button>
    </>
  );
}
