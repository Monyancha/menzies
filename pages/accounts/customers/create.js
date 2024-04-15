import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
//
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import BackButton from "../../../components/ui/actions/back-button";
import * as Yup from "yup";
import Card from "../../../components/ui/layouts/card";
import { Form, Formik } from "formik";
import { Button, TextInput, Select } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useState } from "react";
import { submitUIForm } from "../../../lib/shared/form-helpers";
import { useSelector } from "react-redux";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/clients",
    title: "Clients",
  },
  {
    to: "/accounts/customers/create",
    title: "Create Company",
  },
];

function AddCustomer() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState();
  const branch_id = useSelector((state) => state.branches.branch_id);


  const FormSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    address: Yup.string().required(),
    kra_pin: Yup.string().notRequired(),
    contact_email: Yup.string().email().required(),
    contact_name: Yup.string().required(),
    contact_phone: Yup.string().required(),
    contact_gender: Yup.string().notRequired(),
  });

  const actions = <BackButton href={`/partners/clients`} />;

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Create Company" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <Card>
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            let url = `/accounts/companies?`;
            const pars ={}
            if (branch_id) {
              pars["branch_id"] = branch_id;
            }

            url += new URLSearchParams(pars);

            const body = { ...values };
            // body["branch_id"] = branch_id;

            const params = {};
            params["accessToken"] = session?.user?.accessToken;
            params["body"] = body;
            params["url"] = url;
            params["onSuccess"] = () => {
              router.push(`/partners/clients`);
            };

            setIsSubmitting(true);

            await submitUIForm(params);

            setIsSubmitting(false);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextInput
                  label="Company Name"
                  placeholder="Company Name"
                  type="text"
                  value={values["name"]}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  error={touched.name && errors.name}
                />

                <TextInput
                  label="Company Address"
                  placeholder="Company Address"
                  type="text"
                  value={values["address"]}
                  onChange={(e) => setFieldValue("address", e.target.value)}
                  error={touched.address && errors.address}
                />

                <TextInput
                  label="Company KRA Pin"
                  placeholder="Company KRA Pin"
                  type="text"
                  value={values["kra_pin"]}
                  onChange={(e) => setFieldValue("kra_pin", e.target.value)}
                  error={touched.kra_pin && errors.kra_pin}
                />

                <TextInput
                  label="Contact Name"
                  placeholder="Contact Name"
                  type="text"
                  value={values["contact_name"]}
                  onChange={(e) =>
                    setFieldValue("contact_name", e.target.value)
                  }
                  error={touched.contact_name && errors.contact_name}
                />

                <TextInput
                  label="Contact Email"
                  placeholder="Contact Email"
                  type="email"
                  value={values["contact_email"]}
                  onChange={(e) =>
                    setFieldValue("contact_email", e.target.value)
                  }
                  error={touched.contact_email && errors.contact_email}
                />

                <TextInput
                  label="Contact Phone"
                  placeholder="Contact Phone"
                  type="tel"
                  value={values["contact_phone"]}
                  onChange={(e) =>
                    setFieldValue("contact_phone", e.target.value)
                  }
                  error={touched.contact_phone && errors.contact_phone}
                />

                <Select
                  placeholder="Contact Gender"
                  label="Contact Gender"
                  value={values["contact_gender"]}
                  onChange={(value) => {
                    setFieldValue("contact_gender", value);
                  }}
                  data={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  error={touched.contact_gender && errors.contact_gender}
                  searchable
                  clearable
                />
              </div>

              <Button
                type="submit"
                leftIcon={<IconDeviceFloppy size={18} />}
                loading={isSubmitting}
                variant="outline"
              >
                Save Customer
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Box>
    </PageContainer>
  );
}

export default AddCustomer;
