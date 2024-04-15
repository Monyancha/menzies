import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import store from "../../../../src/store/Store";
import StatelessLoadingSpinner from "../../../../components/ui/utils/stateless-loading-spinner";
import {
  getVendorDetails,
  getContactDetails,
  updateContact,
} from "../../../../src/store/merchants/inventory/inventory-slice";
import BackButton from "../../../../components/ui/actions/back-button";
import * as Yup from "yup";
import Card from "../../../../components/ui/layouts/card";
import { Form, Formik } from "formik";
import { Button, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

function EditContact() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const vendorId = router?.query?.vendorId ?? "";
  const contactId = router?.query?.contactId ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dataStatus = useSelector(
    (state) => state.inventory.getVendorDetailsStatus
  );
  const vendor = useSelector((state) => state.inventory.getVendorDetails);
  const isLoading = dataStatus === "loading";

  const contactStatus = useSelector(
    (state) => state.inventory.getContactDetailsStatus
  );
  const contact = useSelector((state) => state.inventory.getContactDetails);
  const isContactLoading = contactStatus === "loading";

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
    id_number: Yup.string().max(50, "Text too long (max 200)").notRequired(),
  });

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["vendorId"] = vendorId;

    store.dispatch(getVendorDetails(params));
  }, [session, status, vendorId]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["vendorId"] = vendorId;
    params["contactId"] = contactId;

    store.dispatch(getContactDetails(params));
  }, [session, status, vendorId, contactId]);

  const submitContact = async (event) => {
    event.preventDefault();

    if (!event.target.name.value) {
      showNotification({
        title: "Error",
        message: "Name is required!",
        color: "red",
      });

      return;
    }

    const data = {
      company_id: vendorId,
      name: event.target.name.value,
      address: event.target.address.value,
      email: event.target.email.value,
      city: event.target.city.value,
      phone: event.target.phone.value,
      id_number: event.target.id_number.value,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/vendors/${vendorId}/contact/update/${contactId}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    // console.log(result);

    if (result.vendorCode === 200) {
      showNotification({
        title: "Success",
        message: "Contact Updated Successfully",
        color: "green",
      });
      router.push(`/partners/vendors/contacts?vendorId=${vendorId}`);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }

    console.log(result);
  };


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
      to: `/partners/vendors/contacts?vendorId=${vendorId}`,
      title: "Contacts",
    },
    {
      title: "Edit Contact",
    },
  ];



  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Edit Contact" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>

      <Card>
        {!isLoading && (
          <Formik
            initialValues={{
              name: contact?.name,
              address: contact?.address,
              email: contact?.email,
              city: contact?.city,
              phone: contact?.phone,
              id_number: contact?.id_number,
            }}
            validationSchema={FormSchema}
            onSubmit={async (values) => {
              const body = { ...values };
              body["company_id"] = vendorId;

              const params = {};
              params["accessToken"] = session?.user?.accessToken;
              params["vendorId"] = vendorId;
              params["contactId"] = contactId;
              params["body"] = body;

              try {
                setIsSubmitting(true);

                await store.dispatch(updateContact(params)).unwrap();

                showNotification({
                  title: "Success",
                  message: "Record created successfully",
                  color: "green",
                });

                router.push(
                  `/partners/vendors/contacts?vendorId=${vendorId}`
                );
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
                    label="Company"
                    placeholder="Company"
                    defaultValue={vendor?.name}
                    disabled
                  />

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
                    name="id_number"
                    label="ID Number"
                    placeholder="ID Number"
                    type="text"
                    value={values["id_number"]}
                    onChange={(e) => setFieldValue("id_number", e.target.value)}
                    error={touched.id_number && errors.id_number}
                  />
                  
                </div>

                <Button
                  type="submit"
                  leftIcon={<IconDeviceFloppy size={18} />}
                  loading={isSubmitting}
                  variant="outline"
                >
                  Edit Contact
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}
      </Card>
      </Box>
    </PageContainer>
  );
}

export default EditContact;
