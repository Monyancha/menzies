import { Button, Modal, Select, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import store from "@/store/store";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons";
import { submitUIForm } from "@/lib/shared/form-helpers";
import { getProductTax } from "@/store/merchants/inventory/products-slice";
import { fetchMerchantFlags } from "@/store/merchants/settings/security-slice";
import { parseValidFloat } from "@/lib/shared/data-formatters";

export default function AddQuickProductsModal({
  opened = false,
  setOpened = () => {},
  onSuccess = (sellable) => {},
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => session?.user?.accessToken, [session]);

  const [isSubmitting, setIsSubmitting] = useState();

  // ======================================================================
  // Load Taxes
  // ======================================================================
  const taxList = useSelector((state) => state.products.getProductTax);
  const taxListStatus = useSelector(
    (state) => state.products.getProductTaxStatus
  );
  useEffect(() => {
    if (!accessToken || taxListStatus === "fulfilled") {
      return;
    }

    const params = { accessToken };

    store.dispatch(getProductTax(params));
  }, [accessToken, taxListStatus]);
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ======================================================================
  // Load Flags
  // ======================================================================
  const merchantFlagsStatus = useSelector(
    (state) => state.security.merchantFlagsStatus
  );
  const merchantFlags = useSelector((state) => state.security.merchantFlags);
  useEffect(() => {
    if (!accessToken || merchantFlagsStatus !== "idle") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;

    store.dispatch(fetchMerchantFlags(params));
  }, [accessToken, merchantFlagsStatus]);

  const [defaultMarginPc, setDefaultMarginPc] = useState(null);
  const [defaultTaxId, setDefaultTaxId] = useState(null);

  useEffect(() => {
    setDefaultMarginPc(
      merchantFlags?.find((item) => item.name === "default-profit-markup")
        ?.details?.value ?? ""
    );

    setDefaultTaxId(
      merchantFlags?.find((item) => item.name === "default-tax-id")?.details
        ?.value ?? ""
    );
  }, [merchantFlags]);
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  function calculateMarginPc({
    values = null,
    setFieldValue = () => {},
    bpOverride = null,
    costOverride = null,
    taxIdOverride = null,
  } = {}) {
    let taxPc = 0;
    if (values?.tax_id || taxIdOverride) {
      taxPc =
        taxList?.find((item) => item.id == (taxIdOverride ?? values?.tax_id))
          ?.rate ?? 0;
    }

    const spGross = parseValidFloat(costOverride ?? values?.cost);
    const taxAmt = (spGross * (taxPc / 100)) / ((taxPc + 100) / 100);
    const spNet = spGross - taxAmt;

    const bpGross = parseValidFloat(bpOverride ?? values?.buying_price);

    const marginNew = spNet - bpGross;
    const marginPcNew = bpGross > 0 ? (marginNew / bpGross) * 100 : "";

    setFieldValue("margin_pc", marginPcNew);
  }

  const taxListData = useMemo(
    () =>
      taxList?.map((item) => ({
        value: `${item.id}`,
        label: `${item.name} ${item.rate}`,
      })) ?? [],
    [taxList]
  );

  const FIELD_REQUIRED = "This field is required";
  const FormSchema = Yup.object().shape({
    name: Yup.string().required(FIELD_REQUIRED),
    buying_price: Yup.number().min(0).required(FIELD_REQUIRED),
    cost: Yup.number().min(0).required(FIELD_REQUIRED),
    duration: Yup.number().min(5).notRequired(),
    tax_id: Yup.mixed().notRequired(),
    tax_method: Yup.string().required(),
    opening_quantity: Yup.number().min(0).required(FIELD_REQUIRED),
  });

  const branch_id = useSelector((state) => state.branches.branch_id);

  if (defaultTaxId === null || defaultMarginPc === null) {
    return;
  }

  return (
    <Modal
      opened={opened}
      title="New Product"
      onClose={() => setOpened(false)}
      padding="xs"
      overflow="inside"
    >
      <Formik
        initialValues={{
          name: "",
          opening_quantity: 0,
          tax_id: `${defaultTaxId}`,
          tax_method: defaultTaxId ? "inclusive" : "",
        }}
        validationSchema={FormSchema}
        onSubmit={async (values) => {
          const url = `/quick_sellables/product`;

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
                placeholder="Buying Price"
                label="Buying Price"
                value={values["buying_price"]}
                onChange={(e) => {
                  setFieldValue("buying_price", e.target.value);
                  calculateMarginPc({
                    values,
                    setFieldValue,
                    bpOverride: e.target.value,
                  });
                }}
                error={touched.buying_price && errors.buying_price}
                withAsterisk
              />

              <Select
                label="Tax (PC)"
                placeholder="Select Tax (PC)"
                data={taxListData}
                value={values["tax_id"]}
                onChange={(v) => {
                  setFieldValue("tax_id", v);
                  calculateMarginPc({
                    values,
                    setFieldValue,
                    taxIdOverride: v,
                  });
                }}
                error={touched.tax_id && errors.tax_id}
                clearable
                searchable
              />

              <Select
                label="Tax Method"
                placeholder="Tax Method"
                data={[
                  { value: "inclusive", label: "Inclusive" },
                  { value: "exclusive", label: "Exclusive" },
                ]}
                value={values["tax_method"]}
                onChange={(v) => setFieldValue("tax_method", v)}
                error={touched.tax_method && errors.tax_method}
                clearable
                searchable
              />

              <TextInput
                type="number"
                placeholder="Selling Price"
                label="Selling Price"
                value={values["cost"]}
                onChange={(e) => {
                  setFieldValue("cost", e.target.value);
                  calculateMarginPc({
                    values,
                    setFieldValue,
                    costOverride: e.target.value,
                  });
                }}
                error={touched.cost && errors.cost}
                withAsterisk
              />

              <TextInput
                type="number"
                placeholder="Profit Margin"
                label="Profit Margin"
                value={values["margin_pc"]}
                onChange={() => {}}
                error={touched.margin_pc && errors.margin_pc}
              />

              <TextInput
                type="number"
                placeholder="Opening Quantity"
                label="Opening Quantity"
                value={values["opening_quantity"]}
                onChange={(e) =>
                  setFieldValue("opening_quantity", e.target.value)
                }
                error={touched.opening_quantity && errors.opening_quantity}
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
