import { Button, Modal, FileInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";

import * as Yup from "yup";
import { Form, Formik } from "formik";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UploadCompaniesModal() {
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const FormSchema = Yup.object().shape({
    upload_file: Yup.mixed().required("This field is required"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={FormSchema}
        onSubmit={async (values) => {
          let url = `${API_URL}/accounts/companies/upload?`;
          console.log("Submitting");

          const body = new FormData();
          body.append("upload_file", values.upload_file);
          if (branch_id) {
            body.append("branch_id", branch_id);
          }

          try {
            setIsSubmitting(true);

            await fetch(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.user.accessToken} `,
                Accept: "application/json",
              },
              body,
            }).then(async (response) => {
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }

              return data;
            });

            showNotification({
              title: "Success",
              message: "Importing records in the background",
              color: "green",
            });
            setOpened(false);
          } catch (e) {
            showNotification({
              title: "Warning",
              message: e?.message ?? "Could not upload file",
              color: "orange",
            });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Modal
            opened={opened}
            title={`Bulk Company Upload Form`}
            onClose={() => setOpened(false)}
            padding="xs"
            overflow="inside"
          >
            <Form>
              <section className="flex flex-col gap-2">
                <FileInput
                  label="Excel Sheet"
                  placeholder="Click here to select file"
                  description="Make sure the upload excel sheet follows our template's format"
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  clearable={true}
                  withAsterisk
                  onChange={(file) => setFieldValue("upload_file", file)}
                  error={touched.upload_file && errors?.upload_file}
                />

                <section className="flex flex-row justify-end gap-2">
                  <Link href="/templates/companies-template.xlsx">
                    <a download>
                      <Button
                        variant="outline"
                        color="blue"
                        size="xs"
                        leftIcon={<IconDownload size={14} />}
                        type="button"
                      >
                        Download Template
                      </Button>
                    </a>
                  </Link>

                  <Button
                    type="submit"
                    variant="filled"
                    color="blue"
                    size="xs"
                    leftIcon={<IconUpload size={14} />}
                    loading={isSubmitting}
                  >
                    Upload
                  </Button>
                </section>
              </section>
            </Form>
          </Modal>
        )}
      </Formik>

      <Button
        variant="outline"
        size="xs"
        onClick={() => setOpened(true)}
        leftIcon={<IconUpload size={14} />}
      >
        Upload
      </Button>
    </>
  );
}
