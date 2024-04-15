import {
  Button,
  Modal,
  Select,
  Textarea,
  TextInput,
  Checkbox,
} from "@mantine/core";
import * as Yup from "yup";
import Card from "@/components/ui/layouts/card";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { submitUIForm } from "@/lib/shared/form-helpers";
import store from "@/store/store";
import { fetchMerchantFlags } from "@/store/merchants/settings/security-slice";
import { useSelector } from "react-redux";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import { parseValidFloat } from "@/lib/shared/data-formatters";
import { fetchClients } from "@/store/merchants/partners/clients-slice";

export default function UpdateClientPointsModal({
  client = null,
  opened = null,
  setOpened = (opened) => {},
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const currentPoints = useMemo(
    () =>
      parseValidFloat(client?.points_debit_sum_points ?? 0) -
      parseValidFloat(client?.points_credit_sum_points ?? 0),
    [client]
  );

  const branch_id = useSelector((state) => state.branches.branch_id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = Yup.object().shape({
    points: Yup.number()
      .min(0)
      .max(1_000_000)
      .required("This field is required"),
  });

  return (
    <>
      <Modal
        opened={opened}
        title={`Update ${client?.name} points`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <div className="flex flex-col w-full mb-4 space-y-2">
          <Formik
            initialValues={{
              points: currentPoints,
            }}
            validationSchema={FormSchema}
            onSubmit={async (values) => {
              const url = `/partners/client-points/update-client/${client.id}`;

              const variance =
                parseValidFloat(values["points"]) - currentPoints;
              const type = variance >= 0 ? "in" : "out";
              const points = Math.abs(variance);
              const body = { points, type };
              console.log("Submitting", body, url);

              const params = {};
              params["accessToken"] = accessToken;
              params["body"] = body;
              params["url"] = url;
              params["onSuccess"] = () => {
                setOpened(false);
                store.dispatch(fetchClients({ accessToken }));
              };

              setIsSubmitting(true);

              await submitUIForm(params);

              setIsSubmitting(false);
            }}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form>
                <div className="grid grid-cols-1 gap-2">
                  <TextInput
                    label="Points"
                    placeholder="Points"
                    type="number"
                    value={values["points"]}
                    onChange={(e) =>
                      setFieldValue("points", e.currentTarget.value)
                    }
                    error={touched.points && errors.points}
                  />

                  <TextInput
                    label="Variance"
                    placeholder="Variance"
                    type="number"
                    value={parseValidFloat(values["points"]) - currentPoints}
                    onChange={() => {}}
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    leftIcon={<IconDeviceFloppy size={18} />}
                    loading={isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}
