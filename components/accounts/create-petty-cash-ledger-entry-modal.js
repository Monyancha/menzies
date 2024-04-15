import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../src/store/Store";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { submitUIForm } from "../../lib/shared/form-helpers";
import { fetchCompanyCarList, fetchWalletLedgerList } from "../../src/store/accounts/accounts-slice";
import PettyCashStatusSelect from "./petty-cash-status-select";

export default function CreatePettyCashLedgerEntryModal({ walletId }) {
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState();

  const FormSchema = Yup.object().shape({
    amount: Yup.number().required("This field is required"),
    status: Yup.string().required("This field is required"),
    notes: Yup.string().notRequired(),
  });

  return (
    <>
      <Modal
        opened={opened}
        title="Add Ledger Entry"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <Formik
          initialValues={{
            amount: "",
            status: "pending",
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            const url = `/accounts/expenses/petty_cash_wallets/${walletId}/ledgers`;

            const body = { ...values };

            const params = {};
            params["accessToken"] = session?.user?.accessToken;
            params["body"] = body;
            params["url"] = url;
            params["onSuccess"] = () => {
              setOpened(false);
              params["recordId"] = walletId;
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
                <TextInput
                  placeholder="Amount"
                  label="Amount"
                  type="number"
                  value={values["amount"]}
                  onChange={(e) => setFieldValue("amount", e.target.value)}
                  error={touched.amount && errors.amount}
                  withAsterisk
                />

                <PettyCashStatusSelect
                  value={values["status"]}
                  onChange={(v) => setFieldValue("status", v)}
                  error={touched.status && errors.status}
                  withAsterisk={true}
                />

                <Textarea
                  placeholder="Notes"
                  label="Notes"
                  value={values["notes"]}
                  onChange={(e) => setFieldValue("notes", e.target.value)}
                  error={touched.notes && errors.notes}
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

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Add
      </Button>
    </>
  );
}
