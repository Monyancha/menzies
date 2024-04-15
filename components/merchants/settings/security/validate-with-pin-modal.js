import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconLockOpen } from "@tabler/icons";
import { Button, Textarea, TextInput, Modal } from "@mantine/core";
import store from "@/store/store";
import { validatePin } from "@/store/merchants/settings/security-slice";
import { showNotification } from "@mantine/notifications";

export default function ValidateWithPinModal({
  opened = false,
  setOpened = () => {},
  message = null,
  onSuccess = () => {},
  onFail = (message) => {},
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = Yup.object().shape({
    pin: Yup.string().required("This field is required"),

    narration: Yup.string().notRequired(),
  });

  function onCloseModal() {
    setOpened(false);
    onFail("Operation Cancelled");
  }

  return (
    <>
      <Modal
        opened={opened}
        title={`Authorize Operation`}
        onClose={onCloseModal}
        padding="xs"
        overflow="inside"
      >
        <Formik
          initialValues={{
            pin: "",
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            const body = { ...values, reason: message };

            const params = {};
            params["accessToken"] = accessToken;
            params["body"] = body;
            console.log("The body is", body);

            try {
              setIsSubmitting(true);

              await store.dispatch(validatePin(params)).unwrap();

              showNotification({
                title: "Success",
                message: "Pin validated successfully",
                color: "green",
              });

              setOpened(false);

              onSuccess();
            } catch (e) {
              let message = "Could not validate pin";
              message = e.message ? e.message : message;
              showNotification({
                title: "Warning",
                message,
                color: "orange",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
                <span className="text-dark text-sm font-bold">
                  Validate <span className="text-primary">{message}?</span>
                </span>

                <TextInput
                  label="Pin"
                  type="password"
                  placeholder="Your Pin"
                  value={values["pin"]}
                  onChange={(e) => setFieldValue("pin", e.target.value)}
                  error={touched.pin && errors.pin}
                />

                <Textarea
                  label="Narration"
                  placeholder="Narration"
                  value={values["narration"]}
                  onChange={(e) => setFieldValue("narration", e.target.value)}
                  error={touched.narration && errors.narration}
                />
              </section>

              <section className="flex justify-end items-end gap-2 space-y-2 bg-light p-3 rounded-lg my-3">
                <Button
                  type="button"
                  color="gray"
                  variant="outline"
                  loading={isSubmitting}
                  onClick={onCloseModal}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  color="green"
                  loading={isSubmitting}
                  leftIcon={<IconLockOpen />}
                >
                  Authorize
                </Button>
              </section>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
