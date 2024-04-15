import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import BackButton from "../../../../components/ui/actions/back-button";
import * as Yup from "yup";
import Card from "../../../../components/ui/layouts/card";
import { Form, Formik } from "formik";
import { Button, TextInput, Select } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { submitUIForm } from "../../../../lib/shared/form-helpers";
import { fetchCompanyDetails } from "../../../../src/store/accounts/accounts-slice";
import { useSelector } from "react-redux";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import store from "../../../../src/store/Store";
//
import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
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
    title: "Edit Company",
  },
];

export default function EditCustomerPage() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const companyId = router?.query?.customerId;

  const isLoading = useSelector(
    (state) => state.accounts.companyDetailsStatus === "loading"
  );

  const record = useSelector((state) => state.accounts.companyDetails);

  useEffect(() => {
    if (!accessToken || !router.isReady) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["companyId"] = companyId;

    store.dispatch(fetchCompanyDetails(params));
  }, [accessToken, companyId, router]);

  const [isSubmitting, setIsSubmitting] = useState();

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
    <Breadcrumb title="View Company" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>
      <Card>
        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        {!isLoading && (
          <Formik
            initialValues={{
              name: record?.name ?? "",
              address: record?.address ?? "",
              kra_pin: record?.kra_pin ?? "",
              contact_name: record?.contact_name ?? "",
              contact_email: record?.contact_email ?? "",
              contact_phone: record?.contact_phone ?? "",
              contact_gender: record?.contact_gender ?? "",
            }}
            validationSchema={FormSchema}
            onSubmit={async (values) => {
              const url = `/accounts/companies/${companyId}`;

              const body = { ...values };
              // body["branch_id"] = branch_id;

              const params = {};
              params["accessToken"] = session?.user?.accessToken;
              params["body"] = body;
              params["url"] = url;
              params["method"] = "PUT";
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
                  variant="outline"
                  leftIcon={<IconDeviceFloppy size={18} />}
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Card>
      </Box>
    </PageContainer>
  );
}
