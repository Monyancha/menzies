import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import {
  getVendorDetails,
  updateVendor,
} from "../../../../src/store/merchants/inventory/inventory-slice";
import { useEffect, useState } from "react";
import store from "../../../../src/store/Store";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import * as Yup from "yup";
import Card from "../../../../components/ui/layouts/card";
import { Form, Formik } from "formik";
import { Button, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import BackButton from "../../../../components/ui/actions/back-button";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/vendors",
    title: "Vendors",
  },
  {
    title: "Edit Vendor",
  },
];

function EditVendor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const vendorId = router?.query?.vendorId ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vendorStatus = useSelector(
    (state) => state.inventory.getVendorDetailsStatus
  );

  const vendor = useSelector((state) => state.inventory.getVendorDetails);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = vendorStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["vendorId"] = vendorId;

    store.dispatch(getVendorDetails(params));
  }, [session, status, vendorId]);

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "String too short min(2)")
      .max(200, "Name too long (max 200)")
      .required("This field is required"),
    address: Yup.string().max(200, "Text too long (max 200)").notRequired(),
    email: Yup.string()
      .email()
      .max(200, "Text too long (max 200)")
      .notRequired(),
    phone: Yup.string().max(50, "Text too long (max 200)").notRequired(),
    city: Yup.string().max(200, "Text too long (max 200)").notRequired(),
    tax_id: Yup.string().max(50, "Text too long (max 200)").notRequired(),
  });

  const breadCrumbActions = <BackButton href="/merchants/inventory/vendors" />;

  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Edit Vendor" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>

      {!isLoading && (
        <Card>
          <Formik
            initialValues={{
              name: vendor?.name ?? "",
              address: vendor?.address ?? "",
              email: vendor?.email ?? "",
              phone: vendor?.phone ?? "",
              city: vendor?.city ?? "",
              tax_id: vendor?.tax_id ?? "",
            }}
            validationSchema={FormSchema}
            onSubmit={async (values) => {
              const body = { ...values };
              body["branch_id"] = branch_id;

              const params = {};
              params["accessToken"] = session?.user?.accessToken;
              params["body"] = body;
              params["vendorId"] = vendorId;

              try {
                setIsSubmitting(true);

                await store.dispatch(updateVendor(params)).unwrap();

                showNotification({
                  title: "Success",
                  message: "Changes saved successfully",
                  color: "green",
                });

                router.push("/partners/vendors");
              } catch (e) {
                let message = "Could not save record";
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <TextInput
                    name="name"
                    label="Full Name"
                    placeholder="Full name"
                    type="text"
                    value={values["name"]}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    error={touched.name && errors.name}
                    withAsterisk
                  />

                  <TextInput
                    name="address"
                    label="Address"
                    placeholder="Address"
                    type="text"
                    value={values["address"]}
                    onChange={(e) => setFieldValue("address", e.target.value)}
                    error={touched.address && errors.address}
                  />

                  <TextInput
                    name="email"
                    label="Email"
                    placeholder="Email"
                    type="email"
                    value={values["email"]}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                    error={touched.email && errors.email}
                  />

                  <TextInput
                    name="phone"
                    label="Phone"
                    placeholder="Phone"
                    type="text"
                    value={values["phone"]}
                    onChange={(e) => setFieldValue("phone", e.target.value)}
                    error={touched.phone && errors.phone}
                  />

                  <TextInput
                    name="city"
                    label="City"
                    placeholder="City"
                    type="text"
                    value={values["city"]}
                    onChange={(e) => setFieldValue("city", e.target.value)}
                    error={touched.city && errors.city}
                  />

                  <TextInput
                    name="tax_id"
                    label="Tax ID"
                    placeholder="Tax ID"
                    type="text"
                    value={values["tax_id"]}
                    onChange={(e) => setFieldValue("tax_id", e.target.value)}
                    error={touched.tax_id && errors.tax_id}
                  />
                              <TextInput
                  name="tax_id"
                  label="Upload KRA PIN Certificate"
                  placeholder="Upload KRA PIN Certificate"
                  type="file"
                />
                <TextInput
                  name="tax_id"
                  label="Upload Business Certificate"
                  placeholder="Upload Business Certificate"
                  type="file"
                />
                <TextInput
                  name="tax_id"
                  label="Upload Business License"
                  placeholder="Upload Business License"
                  type="file"
                />
                <TextInput
                  name="tax_id"
                  label="Upload Other Documents"
                  placeholder="Upload Other Documents"
                  type="file"
                />
                </div>

                <Button
                  variant="outline"
                  type="submit"
                  leftIcon={<IconDeviceFloppy size={18} />}
                  loading={isSubmitting}
                >
                  Edit Vendor
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

    </Box>
    </PageContainer>
  );
}

export default EditVendor;
