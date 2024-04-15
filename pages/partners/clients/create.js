import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
//
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { getStaffRoles } from "../../../src/store/partners/staff-slice";
import store from "../../../src/store/Store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Card from "../../../components/ui/layouts/card";
import { Form, Formik } from "formik";
import { Button, Select, TextInput, MultiSelect } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { submitClient } from "../../../src/store/partners/clients-slice";
import { Textarea } from "@mantine/core";
import { getAllCustomerCategories } from "../../../src/store/partners/clients-slice";

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
    to: "/partners/clients/create",
    title: "Create Client",
  },
];

export default function CreateClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const branch_id = useSelector((state) => state.branches.branch_id);
  
    //
    const [categoryId, setCategoryId] = useState([]);
  
    const FormSchema = Yup.object().shape({
      name: Yup.string()
        .min(2, "String too short min(2)")
        .max(200, "Name too long (max 200)")
        .required("This field is required"),
      gender: Yup.string().max(200, "Text too long (max 200)").notRequired(),
      email: Yup.string()
        .email()
        .max(200, "Text too long (max 200)")
        .notRequired(),
      phone: Yup.string().max(50, "Text too long (max 200)").notRequired(),
      dob: Yup.date().notRequired(),
      street_name: Yup.string().max(200, "Text too long (max 200)").notRequired(),
      house_no: Yup.string().max(200, "Text too long (max 200)").notRequired(),
      estate: Yup.string().max(200, "Text too long (max 200)").notRequired(),
      city: Yup.string().max(200, "Text too long (max 200)").notRequired(),
      kra_pin: Yup.string().max(200, "Text too long (max 200)").notRequired(),
  
      //
      allergies: Yup.string().max(200, "Text too long (max 200)").notRequired(),
      med_condition: Yup.string()
        .max(200, "Text too long (max 200)")
        .notRequired(),
    });
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
      // console.log("the branch is " + branch_id);
  
      store.dispatch(getStaffRoles(params));
    }, [session, status, branch_id]);
  
    const items = useSelector((state) => state.clients.getAllCustomerCategories);
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getAllCustomerCategories(params));
    }, [session, status]);
  
    const categories =
      items?.map((item) => ({
        value: item.id,
        label: item.name,
      })) ?? [];

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Create Client" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <Card>
        <Formik
          initialValues={{
            name: "",
            gender: "",
            email: "",
            phone: "",
            dob: "",
            street_name: "",
            house_no: "",
            estate: "",
            city: "",
            allergies: "",
            med_condition: "",
            customerCategory: categoryId ?? [], // Initialize customerCategory as an empty array
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            const params = { ...values };

            params["accessToken"] = session?.user?.accessToken;
            params["branch_id"] = branch_id;

            try {
              setIsSubmitting(true);

              // Convert the customerCategory to an array, if it's not already an array
              if (!Array.isArray(params.customerCategory)) {
                params.customerCategory = [params.customerCategory];
              }

              const response = await store
                .dispatch(submitClient(params))
                .unwrap();

              // Handle the API response as needed
              console.log(response.data); // Replace this with your actual logic

              showNotification({
                title: "Success",
                message: "Record created successfully",
                color: "green",
              });

              router.push(`/partners/clients`);
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

                <Select
                  label="Gender"
                  name="gender"
                  placeholder="Gender"
                  value={values["gender"]}
                  data={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  clearable
                  onChange={(selectedGender) =>
                    setFieldValue("gender", selectedGender)
                  }
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

                <MultiSelect
                  label="Customer Category"
                  placeholder="Select Customer Category"
                  searchable
                  clearable
                  data={categories}
                  onChange={(selectedValues) => setCategoryId(selectedValues)}
                />

                <TextInput
                  label="Date of Birth"
                  placeholder="DOB"
                  type="date"
                  value={values["dob"]}
                  onChange={(e) => setFieldValue("dob", e.target.value)}
                  error={touched.dob && errors.dob}
                />

                <TextInput
                  label="Street/Road"
                  placeholder="Street/Road"
                  type="text"
                  value={values["street_name"]}
                  onChange={(e) => setFieldValue("street_name", e.target.value)}
                  error={touched.street_name && errors.street_name}
                />

                <TextInput
                  label="House No"
                  placeholder="House No"
                  type="text"
                  value={values["house_no"]}
                  onChange={(e) => setFieldValue("house_no", e.target.value)}
                  error={touched.house_no && errors.house_no}
                />

                <TextInput
                  label="Estate/Building"
                  placeholder="Estate/Building"
                  type="text"
                  value={values["estate"]}
                  onChange={(e) => setFieldValue("estate", e.target.value)}
                  error={touched.estate && errors.estate}
                />

                <TextInput
                  label="City"
                  placeholder="City"
                  type="text"
                  value={values["city"]}
                  onChange={(e) => setFieldValue("city", e.target.value)}
                  error={touched.city && errors.city}
                />

                <TextInput
                  label="KRA PIN"
                  placeholder="KRA PIN"
                  type="text"
                  value={values["kra_pin"]}
                  onChange={(e) => setFieldValue("kra_pin", e.target.value)}
                  error={touched.kra_pin && errors.kra_pin}
                />
              </div>

              <span className="text-dark text-sm font-bold">
                Medical Information
              </span>
              <Textarea
                placeholder="Allergies"
                label="Allergies"
                autosize
                name="allergies"
                type="text"
                minRows={3}
                value={values["allergies"]}
                onChange={(e) => setFieldValue("allergies", e.target.value)}
              />

              <Textarea
                placeholder="Any Prior Medical Condition"
                label="Prior Medical Condition"
                autosize
                name="med_condition"
                type="text"
                minRows={3}
                value={values["med_condition"]}
                onChange={(e) => setFieldValue("med_condition", e.target.value)}
              />

              <Button
                type="submit"
                leftIcon={<IconDeviceFloppy size={18} />}
                loading={isSubmitting}
                className="mt-2"
                variant="outline"
              >
                Save Client
              </Button>
            </Form>
          )}
        </Formik>
      </Card>

      </Box>
    </PageContainer>
  );
}
