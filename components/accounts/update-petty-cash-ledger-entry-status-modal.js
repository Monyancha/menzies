import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import store from "../../src/store/Store";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { submitUIForm } from "../../lib/shared/form-helpers";
import { fetchWalletLedgerList } from "../../src/store/accounts/accounts-slice";
import PettyCashStatusSelect from "./petty-cash-status-select";

export default function UpdatePettyCashLedgerEntryStatusModal({
  ledger = null,
  opened = null,
  setClosed = () => {},
} = {}) {
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState();
  const initialAmount = useMemo(() => {
    let amount = ledger?.amount ?? 0;
    if (ledger?.type === "credit") {
      amount *= -1;
    }
    return amount;
  }, [ledger]);

  const FormSchema = Yup.object().shape({
    amount: Yup.number().required("This field is required"),
    status: Yup.string().required("This field is required"),
    notes: Yup.string().notRequired(),
  });

  if (!ledger) {
    return;
  }
  return (
    <Modal
      opened={opened}
      title="Update Ledger Status"
      onClose={() => setClosed()}
      padding="xs"
      overflow="inside"
    >
      <Formik
        initialValues={{
          amount: initialAmount,
          status: ledger?.status ?? "pending",
        }}
        validationSchema={FormSchema}
        onSubmit={async (values) => {
          const url = `/accounts/expenses/petty_cash_wallets/${ledger?.wallet_id}/ledgers/${ledger?.id}`;

          const body = { ...values };

          const params = {};
          params["accessToken"] = session?.user?.accessToken;
          params["body"] = body;
          params["url"] = url;
          params["onSuccess"] = () => {
            setClosed();
            params["recordId"] = ledger?.wallet_id;
            store.dispatch(fetchWalletLedgerList(params));
          };

          setIsSubmitting(true);

          await submitUIForm(params);

          setIsSubmitting(false);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form>
            <section className="flex flex-col space-y-2">
              <PettyCashStatusSelect
                value={values["status"]}
                onChange={(v) => setFieldValue("status", v)}
                error={touched.status && errors.status}
                withAsterisk={true}
              />

              <TextInput
                placeholder="Amount"
                label="Amount"
                type="number"
                value={values["amount"]}
                onChange={(e) => {}}
                error={touched.amount && errors.amount}
                disabled
              />

              <Textarea
                placeholder="Notes"
                label="Notes"
                value={values["notes"]}
                onChange={(e) => setFieldValue("notes", e.target.value)}
                error={touched.notes && errors.notes}
                disabled
              />
            </section>

            <section className="flex justify-end space-y-2 rounded-lg my-3">
              <Button
                type="submit"
                leftIcon={<IconDeviceFloppy size={18} />}
                loading={isSubmitting}
                variant="outline"
              >
                Save
              </Button>
            </section>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
