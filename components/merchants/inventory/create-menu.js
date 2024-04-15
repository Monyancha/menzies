import {
  getInventoryCategories,
  getProductTax,
} from "@/store/merchants/inventory/products-slice";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
//End Get Categories Imports

import { Loader, Select, Textarea, Checkbox, FileInput } from "@mantine/core";
import * as Yup from "yup";
import Card from "@/components/ui/layouts/card";
import { Form, Formik } from "formik";
import { Button, TextInput } from "@mantine/core";
import InventoryCategoryInputs from "@/components/merchants/inventory/inventory-category-inputs";
import { IconDeviceFloppy, IconUpload } from "@tabler/icons";
import { useRouter } from "next/router";
import { fetchDepartments } from "@/store/merchants/settings/branches-slice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CreateMenuForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getInventoryCategories(params));
    store.dispatch(fetchDepartments(params));
  }, [session, status]);

  const taxList = useSelector((state) => state.products.getProductTax);

  const taxListLoading = useSelector(
    (state) => state.products.getProductTaxStatus === "loading"
  );

  const taxListStatus = useSelector(
    (state) => state.products.getProductTaxStatus
  );

  const departments_list = useSelector((state) => state.branches.departments_list);


  useEffect(() => {
    if (!session || status !== "authenticated" || taxListStatus !== "idle") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getProductTax(params));
  }, [session, status, taxListStatus]);

  const FIELD_REQUIRED = "This field is required";
  const FormSchema = Yup.object().shape({
    name: Yup.string().required(FIELD_REQUIRED),
    description: Yup.string().notRequired(),
    menu_item_type: Yup.string().notRequired(),
    cost: Yup.number().required(FIELD_REQUIRED),
    tax_id: Yup.number().notRequired(),
    levy_tax_id: Yup.number().notRequired(),
    tax_service_charge_id: Yup.number().notRequired(),
    tax_method: Yup.string().notRequired(),
    inventory_category_id: Yup.number().notRequired(),
    active_image: Yup.mixed().notRequired(),
    manufactured: Yup.bool().notRequired(),
    opening_quantity:Yup.number().notRequired(),
    department_id:Yup.number().notRequired()
  });

  return (
    <Card>
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={FormSchema}
        onSubmit={async (values) => {
          let url = `${API_URL}/menu-items?`;

          // if (branch_id) {
          // body.append("branch_id", branch_id);
          // }
          const body = new FormData();
          body.append("name", values.name ?? "");
          body.append("description", values.description ?? "");
          body.append("menu_item_type", values.menu_item_type ?? "");
          body.append("cost", values.cost ?? "");
          body.append("opening_quantity", values.opening_quantity ?? "");
          body.append("tax_id", values.tax_id ?? "");
          body.append("tax_method", values.tax_method ?? "");
          body.append("tax_levy_id", values.levy_tax_id ?? "");
          body.append(
            "tax_service_charge_id",
            values.tax_service_charge_id ?? ""
          );
          body.append(
            "inventory_category_id",
            values.inventory_category_id ?? ""
          );
          body.append("department_id", values.department_id ?? "");
          if (values.active_image) {
            body.append("active_image", values.active_image);
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
              message: "Record created successfully",
              color: "green",
            });

            router.push("/merchants/inventory/menus");
          } catch (e) {
            showNotification({
              title: "Warning",
              message: e?.message ?? "Could not save record",
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
                label="Name"
                placeholder="Name"
                type="text"
                value={values?.name ?? ""}
                onChange={(e) => setFieldValue("name", e.target.value)}
                error={touched.name && errors.name}
              />

              <Select
                placeholder="Type"
                label="Type"
                data={[
                  { label: "Food", value: "food" },
                  { label: "Drink", value: "drink" },
                ]}
                value={values?.menu_item_type ?? ""}
                onChange={(v) => setFieldValue("menu_item_type", v)}
                error={touched.menu_item_type && errors.menu_item_type}
                searchable
                clearable
              />

              <TextInput
                label="Selling Price"
                placeholder="Selling Price"
                type="number"
                value={values?.cost ?? ""}
                onChange={(e) => setFieldValue("cost", e.currentTarget.value)}
                error={touched.cost && errors.cost}
              />
                     <TextInput
          label="Quantity"
          placeholder="Quantity"
          type="number"
          value={values?.opening_quantity ?? ""}
          onChange={(e) => setFieldValue("opening_quantity", e.currentTarget.value)}
          error={touched.opening_quantity && errors.opening_quantity}
        />

              <Select
                placeholder="Tax"
                label="Tax"
                data={
                  taxList
                    ?.filter(
                      (it) => it?.type != "LEVY" && it?.type != "SERVICE_CHARGE"
                    )
                    ?.map((item) => ({
                      value: `${item.id}`,
                      label: `${item?.name} ${item?.rate}%`,
                    })) ?? []
                }
                icon={taxListLoading && <Loader size="xs" color="gray" />}
                value={values?.tax_id ?? ""}
                onChange={(v) => setFieldValue("tax_id", v)}
                error={touched.tax_id && errors.tax_id}
                searchable
                clearable
              />

              <Select
                placeholder="Levy Tax"
                label="Levy Tax"
                data={
                  taxList
                    ?.filter((it) => it?.type === "LEVY")
                    .map((item) => ({
                      value: `${item.id}`,
                      label: `${item?.name} ${item?.rate}%`,
                    })) ?? []
                }
                icon={taxListLoading && <Loader size="xs" color="gray" />}
                value={values?.levy_tax_id ?? ""}
                onChange={(v) => setFieldValue("levy_tax_id", v)}
                error={touched.levy_tax_id && errors.levy_tax_id}
                searchable
                clearable
              />

              <Select
                placeholder="Service Charge"
                label="Service Charge"
                data={
                  taxList
                    ?.filter((it) => it?.type === "SERVICE_CHARGE")
                    .map((item) => ({
                      value: `${item.id}`,
                      label: `${item?.name} ${item?.rate}%`,
                    })) ?? []
                }
                icon={taxListLoading && <Loader size="xs" color="gray" />}
                value={values?.tax_service_charge_id ?? ""}
                onChange={(v) => setFieldValue("tax_service_charge_id", v)}
                error={
                  touched.tax_service_charge_id && errors.tax_service_charge_id
                }
                searchable
                clearable
              />

              <Select
                placeholder="Tax Method"
                label="Tax Method"
                data={[
                  { label: "Inclusive", value: "inclusive" },
                  { label: "Exclusive", value: "exclusive" },
                ]}
                value={values?.tax_method ?? ""}
                onChange={(v) => setFieldValue("tax_method", v)}
                error={touched.tax_method && errors.tax_method}
                searchable
                clearable
              />

              <InventoryCategoryInputs
                categoryId={values?.inventory_category_id ?? ""}
                onChangeCategory={(v) =>
                  setFieldValue("inventory_category_id", v)
                }
                error={
                  touched.inventory_category_id && errors.inventory_category_id
                }
                newModalIsLean={true}
                showSubCategories={false}
              />

              <FileInput
                label="Image"
                placeholder="Upload Image (Max 2mb)"
                icon={<IconUpload size={14} />}
                value={values?.active_image}
                onChange={(f) => setFieldValue("active_image", f)}
                error={touched.active_image && errors.active_image}
                style={{ width: "100%" }}
              />

              <Textarea
                label="Description"
                placeholder="Description"
                value={values?.description ?? ""}
                onChange={(e) =>
                  setFieldValue("description", e.currentTarget.value)
                }
                error={touched.description && errors.description}
                minRows={3}
                autosize
              />
             {departments_list?.data?.length>0 && (
               <Select
               placeholder="Department"
               label="Department"
               data={
                 departments_list
                   ?.data
                   ?.map((item) => ({
                     value: `${item.id}`,
                     label: `${item?.name}`,
                   })) ?? []
               }
               value={values?.department_id ?? ""}
               onChange={(v) => setFieldValue("department_id", v)}
               error={touched.department_id_id && errors.department_id}
               searchable
               clearable
             />
             )}

              <Checkbox
                checked={values?.manufactured ?? false}
                onChange={(e) =>
                  setFieldValue("manufactured", e.currentTarget.checked)
                }
                error={touched.manufactured && errors.manufactured}
                label="Create Recipe"
              />
            </div>

            <Button
              leftIcon={<IconDeviceFloppy size={18} />}
              loading={isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

export default CreateMenuForm;
