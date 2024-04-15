import { Button, Modal, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons";
import { submitUIForm } from "@/lib/shared/form-helpers";

export default function AddQuickServiceModal({
  opened = false,
  setOpened = () => {},
  onSuccess = (sellable) => {},
} = {}) {
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState();

  const FIELD_REQUIRED = "This field is required";
  const FormSchema = Yup.object().shape({
    name: Yup.string().required(FIELD_REQUIRED),
    cost: Yup.number().min(0).required(FIELD_REQUIRED),
    duration: Yup.number().min(5).required(FIELD_REQUIRED),
  });

  const branch_id = useSelector((state) => state.branches.branch_id);

  return (
    <Modal
      opened={opened}
      title="New Service"
      onClose={() => setOpened(false)}
      padding="xs"
      overflow="inside"
    >
      <Formik
        initialValues={{
          name: "",
          cost: "",
          duration: 15,
        }}
        validationSchema={FormSchema}
        onSubmit={async (values) => {
          const url = `/quick_sellables/service`;

          const body = { ...values };
          body["branch_id"] = branch_id;

          const params = {};
          params["accessToken"] = session?.user?.accessToken;
          params["body"] = body;
          params["url"] = url;
          params["onSuccessResponse"] = (response) => {
            onSuccess(response);
            setOpened(false);
          };

          setIsSubmitting(true);

          await submitUIForm(params);

          setIsSubmitting(false);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form>
            <section className="flex flex-col space-y-2 p-3 rounded-lg">
              <TextInput
                placeholder="Name"
                label="Name"
                value={values["name"]}
                onChange={(e) => setFieldValue("name", e.target.value)}
                error={touched.name && errors.name}
                withAsterisk
              />

              <TextInput
                type="number"
                placeholder="Selling Price"
                label="Selling Price"
                value={values["cost"]}
                onChange={(e) => setFieldValue("cost", e.target.value)}
                error={touched.cost && errors.cost}
                withAsterisk
              />

              <TextInput
                type="number"
                placeholder="Duration"
                label="Duration"
                value={values["duration"]}
                onChange={(e) => setFieldValue("duration", e.target.value)}
                error={touched.duration && errors.duration}
                withAsterisk
              />
            </section>

            <section className="flex justify-end space-y-2 rounded-lg my-3">
              <Button
                type="submit"
                leftIcon={<IconDeviceFloppy size={18} />}
                loading={isSubmitting}
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
