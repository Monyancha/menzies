import { Button, Modal, TextInput, Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "@/store/store";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons";
import { submitUIForm } from "@/lib/shared/form-helpers";
import { fetchCompanyCarList } from "@/store/merchants/accounts/acounts-slice";

function EditCompanyCarsModal({ record, companyId }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  // =================================================================
  // Prepare dropdowns
  // =================================================================
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const car_makes = useSelector(
    (state) => state.accounts.companyCarList?.car_makes ?? []
  );
  const car_types = useSelector(
    (state) => state.accounts.companyCarList?.car_types ?? []
  );
  const car_models = useSelector(
    (state) => state.accounts.companyCarList?.car_models ?? []
  );

  useEffect(() => {
    setMakes(
      car_makes.map((item) => ({
        value: item.name,
        label: item.name,
      }))
    );
  }, [car_makes]);

  useEffect(() => {
    setTypes(
      car_types.map((item) => ({
        value: item.name,
        label: item.name,
      }))
    );
  }, [car_types]);

  useEffect(() => {
    setModels(
      car_models.map((item) => ({
        value: item.name,
        label: item.name,
      }))
    );
  }, [car_models]);
  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  const [isSubmitting, setIsSubmitting] = useState();

  const FormSchema = Yup.object().shape({
    car_plate: Yup.string().required("This field is required"),
    car_year: Yup.number().min(1990).max(2100).notRequired(),
    chassis_no: Yup.string().notRequired(),

    car_make: Yup.string().notRequired(),
    car_type: Yup.string().notRequired(),
    car_model: Yup.string().notRequired(),
  });

  const branch_id = useSelector((state) => state.branches.branch_id);

  return (
    <>
      <Modal
        opened={opened}
        title="New Car"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <Formik
          initialValues={{
            car_plate: record?.car_plate ?? "",
            car_year: record?.car_year ?? "",
            chassis_no: record?.chassis_no ?? "",

            car_make: record?.make?.name ?? "",
            car_type: record?.type?.name ?? "",
            car_model: record?.model?.name ?? "",
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            const url = `/accounts/companies/${companyId}/cars/${record.id}`;

            const body = { ...values };
            body["branch_id"] = branch_id;

            const params = {};
            params["accessToken"] = session?.user?.accessToken;
            params["body"] = body;
            params["method"] = "PUT";
            params["url"] = url;
            params["onSuccess"] = () => {
              setOpened(false);
              params["companyId"] = companyId;
              store.dispatch(fetchCompanyCarList(params));
            };

            setIsSubmitting(true);

            await submitUIForm(params);

            setIsSubmitting(false);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <section className="flex flex-col space-y-2 p-3 rounded-lg">
                <span className="text-dark text-sm font-bold">Car Details</span>

                <TextInput
                  placeholder="Car Plate"
                  label="Car Plate"
                  required
                  value={values["car_plate"]}
                  onChange={(e) => setFieldValue("car_plate", e.target.value)}
                  error={touched.car_plate && errors.car_plate}
                />

                <TextInput
                  type="number"
                  placeholder="Car Year"
                  label="Car Year"
                  value={values["car_year"]}
                  onChange={(e) => setFieldValue("car_year", e.target.value)}
                  error={touched.car_year && errors.car_year}
                />

                <Select
                  label="Car Make"
                  data={makes}
                  placeholder="Car Make"
                  nothingFound="Nothing found"
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Add ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query };
                    setMakes((current) => [...current, item]);
                    return item;
                  }}
                  value={values["car_make"]}
                  onChange={(v) => setFieldValue("car_make", v)}
                  error={touched.car_make && errors.car_make}
                />

                <Select
                  label="Car Model"
                  data={models}
                  placeholder="Car Model"
                  nothingFound="Nothing found"
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Add ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query };
                    setModels((current) => [...current, item]);
                    return item;
                  }}
                  value={values["car_model"]}
                  onChange={(v) => setFieldValue("car_model", v)}
                  error={touched.car_model && errors.car_model}
                />

                <Select
                  label="Car Type"
                  data={types}
                  placeholder="Car Type"
                  nothingFound="Nothing found"
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Add ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query };
                    setTypes((current) => [...current, item]);
                    return item;
                  }}
                  value={values["car_type"]}
                  onChange={(v) => setFieldValue("car_type", v)}
                  error={touched.car_type && errors.car_type}
                />

                <TextInput
                  placeholder="Chassis No"
                  label="Chassis No"
                  type="text"
                  value={values["chassis_no"]}
                  onChange={(e) => setFieldValue("chassis_no", e.target.value)}
                  error={touched.chassis_no && errors.chassis_no}
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

      <Button
        leftIcon={<IconPencil size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Edit
      </Button>
    </>
  );
}

export default EditCompanyCarsModal;
