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

export default function TogglePosImagesModal({
  opened = null,
  setOpened = () => {},
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = Yup.object().shape({
    enabled: Yup.bool().required("This field is required"),
  });

  const merchantFlags = useSelector((state) => state.security.merchantFlags);
  const merchantFlagsStatus = useSelector(
    (state) => state.security.merchantFlagsStatus
  );

  const isLoadingMerchantFlags = merchantFlagsStatus === "loading";

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    if (merchantFlagsStatus === "idle") {
      store.dispatch(fetchMerchantFlags({ accessToken }));
    }
  }, [accessToken, merchantFlagsStatus]);

  return (
    <>
      <Modal
        opened={opened}
        title="Download Printing Client"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <div className="flex flex-col w-full mb-4 space-y-2">
          {isLoadingMerchantFlags && (
            <div className="flex justify-center w-full p-3 bg-light rounded-lg">
              <StatelessLoadingSpinner />
            </div>
          )}

          {!isLoadingMerchantFlags && (
            <Formik
              initialValues={{
                enabled:
                  merchantFlags?.find((item) => item.name === "show-pos-image")
                    ?.details?.value ?? false,
              }}
              validationSchema={FormSchema}
              onSubmit={async (values) => {
                const url = `/settings/merchant_flags/boolean_flags`;

                const body = { value: values.enabled, name: "show-pos-image" };
                console.log("Submitting", body, url);

                const params = {};
                params["accessToken"] = accessToken;
                params["body"] = body;
                params["url"] = url;
                params["onSuccess"] = () => {
                  setOpened(false);
                  store.dispatch(fetchMerchantFlags({ accessToken }));
                };

                setIsSubmitting(true);

                await submitUIForm(params);

                setIsSubmitting(false);
              }}
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form>
                  <Checkbox
                    label="Enable POS Images"
                    checked={values["enabled"]}
                    error={touched.enabled && errors.enabled}
                    onChange={(e) =>
                      setFieldValue("enabled", e.currentTarget.checked)
                    }
                  />

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
          )}
        </div>
      </Modal>
    </>
  );
}
