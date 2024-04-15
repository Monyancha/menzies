import { useEffect, useState, Fragment, useMemo } from "react";
import store from "@/store/store";
import { closeCurrentPosSession } from "@/store/merchants/transactions/pos-sessions-slice";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { isRestaurant } from "@/lib/shared/roles_and_permissions";
import { Button, Textarea, TextInput, Modal } from "@mantine/core";
import { IconX } from "@tabler/icons";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconDeviceFloppy } from "@tabler/icons";
import { parseValidFloat } from "@/lib/shared/data-formatters";

function ClosePosSessionModal() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const isRestaurantAc = useMemo(() => isRestaurant(session?.user), [session]);

  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSession = useSelector(
    (state) => state.posSessions.currentPosSession
  );

  const FormSchema = Yup.object().shape({
    cash_amount: Yup.number().notRequired(),
    cash_amount_variance: Yup.number().notRequired(),

    mpesa_amount: Yup.number().notRequired(),
    mpesa_amount_variance: Yup.number().notRequired(),

    card_amount: Yup.number().notRequired(),
    card_amount_variance: Yup.number().notRequired(),

    credited_amount: Yup.number().notRequired(),
    credited_amount_variance: Yup.number().notRequired(),

    bank_amount: Yup.number().notRequired(),

    cheque_amount: Yup.number().notRequired(),
    cheque_amount_variance: Yup.number().notRequired(),

    jumia_amount: Yup.number().notRequired(),
    jumia_amount_variance: Yup.number().notRequired(),

    glovo_amount: Yup.number().notRequired(),
    glovo_amount_variance: Yup.number().notRequired(),

    bolt_amount: Yup.number().notRequired(),
    bolt_amount_variance: Yup.number().notRequired(),

    uber_amount: Yup.number().notRequired(),
    uber_amount_variance: Yup.number().notRequired(),

    complimentary_amount: Yup.number().notRequired(),
    complimentary_amount_variance: Yup.number().notRequired(),

    narration: Yup.string().notRequired(),
  });

  return (
    <>
      <Modal
        opened={opened}
        title="Close Session"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="lg"
      >
        <Formik
          initialValues={{
            cash_amount: currentSession?.cash_payments ?? 0,
            mpesa_amount: currentSession?.mpesa_payments ?? 0,
            card_amount: currentSession?.card_payments ?? 0,
            credited_amount: currentSession?.credited_payments ?? 0,
            bank_amount: currentSession?.bank_payments ?? 0,
            cheque_amount: currentSession?.cheque_payments ?? 0,
            jumia_amount: currentSession?.jumia_payments ?? 0,
            glovo_amount: currentSession?.glovo_payments ?? 0,
            bolt_amount: currentSession?.bolt_payments ?? 0,
            uber_amount: currentSession?.uber_payments ?? 0,
            complimentary_amount: currentSession?.complimentary_payments ?? 0,
            narration: "",
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            const body = { ...values };

            const params = {};
            params["accessToken"] = session?.user?.accessToken;
            params["body"] = body;
            console.log("The body is", body);

            try {
              setIsSubmitting(true);

              await store.dispatch(closeCurrentPosSession(params)).unwrap();

              showNotification({
                title: "Success",
                message: "Record created successfully",
                color: "green",
              });
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
              <section className="flex flex-col space-y-2 p-3 rounded-lg">
                <span className="text-dark text-sm font-bold">
                  Close Session
                </span>

                <div className="flex flex-row gap-2">
                  <TextInput
                    label="Cash Amount"
                    type="number"
                    placeholder="Cash Amount"
                    value={values["cash_amount"]}
                    onChange={(e) => {
                      setFieldValue("cash_amount", e.target.value);
                      setFieldValue(
                        "cash_amount_variance",
                        parseValidFloat(e.target.value) -
                          parseValidFloat(currentSession?.cash_payments)
                      );
                    }}
                    error={touched.cash_amount && errors.cash_amount}
                  />

                  <TextInput
                    label="Cash Variance"
                    type="number"
                    disabled
                    placeholder="Cash Variance"
                    value={values["cash_amount_variance"]}
                    error={
                      touched.cash_amount_variance &&
                      errors.cash_amount_variance
                    }
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <TextInput
                    label="Card Amount"
                    type="number"
                    placeholder="Card Amount"
                    value={values["card_amount"]}
                    onChange={(e) => {
                      setFieldValue("card_amount", e.target.value);
                      setFieldValue(
                        "card_amount_variance",
                        parseValidFloat(e.target.value) -
                          parseValidFloat(currentSession?.card_payments)
                      );
                    }}
                    error={touched.card_amount && errors.card_amount}
                  />

                  <TextInput
                    label="Card Variance"
                    type="number"
                    disabled
                    placeholder="Card Variance"
                    value={values["card_amount_variance"]}
                    error={
                      touched.card_amount_variance &&
                      errors.card_amount_variance
                    }
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <TextInput
                    label="Mpesa Amount"
                    type="number"
                    placeholder="Mpesa Amount"
                    value={values["mpesa_amount"]}
                    onChange={(e) => {
                      setFieldValue("mpesa_amount", e.target.value);
                      setFieldValue(
                        "mpesa_amount_variance",
                        parseValidFloat(e.target.value) -
                          parseValidFloat(currentSession?.mpesa_payments)
                      );
                    }}
                    error={touched.mpesa_amount && errors.mpesa_amount}
                  />

                  <TextInput
                    label="Mpesa Variance"
                    type="number"
                    disabled
                    placeholder="Mpesa Variance"
                    value={values["mpesa_amount_variance"]}
                    error={
                      touched.mpesa_amount_variance &&
                      errors.mpesa_amount_variance
                    }
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <TextInput
                    label="Credited Amount"
                    type="number"
                    placeholder="Credited Amount"
                    value={values["credited_amount"]}
                    onChange={(e) => {
                      setFieldValue("credited_amount", e.target.value);
                      setFieldValue(
                        "credited_amount_variance",
                        parseValidFloat(e.target.value) -
                          parseValidFloat(currentSession?.credited_payments)
                      );
                    }}
                    error={touched.credited_amount && errors.credited_amount}
                  />

                  <TextInput
                    label="Credited Variance"
                    type="number"
                    disabled
                    placeholder="Credited Variance"
                    value={values["credited_amount_variance"]}
                    error={
                      touched.credited_amount_variance &&
                      errors.credited_amount_variance
                    }
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <TextInput
                    label="Bank Amount"
                    type="number"
                    placeholder="Bank Amount"
                    value={values["bank_amount"]}
                    onChange={(e) =>
                      setFieldValue("bank_amount", e.target.value)
                    }
                    error={touched.bank_amount && errors.bank_amount}
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <TextInput
                    label="Cheque Amount"
                    type="number"
                    placeholder="Cheque Amount"
                    value={values["cheque_amount"]}
                    onChange={(e) => {
                      setFieldValue("cheque_amount", e.target.value);
                      setFieldValue(
                        "cheque_amount_variance",
                        parseValidFloat(e.target.value) -
                          parseValidFloat(currentSession?.cheque_payments)
                      );
                    }}
                    error={touched.cheque_amount && errors.cheque_amount}
                  />

                  <TextInput
                    label="Cheque Variance"
                    type="number"
                    disabled
                    placeholder="Cheque Variance"
                    value={values["cheque_amount_variance"]}
                    error={
                      touched.cheque_amount_variance &&
                      errors.cheque_amount_variance
                    }
                  />
                </div>

                {!isRestaurantAc && (
                  <>
                    <div className="flex flex-row gap-2">
                      <TextInput
                        label="Jumia Amount"
                        type="number"
                        placeholder="Jumia Amount"
                        value={values["jumia_amount"]}
                        onChange={(e) => {
                          setFieldValue("jumia_amount", e.target.value);
                          setFieldValue(
                            "jumia_amount_variance",
                            parseValidFloat(e.target.value) -
                              parseValidFloat(currentSession?.jumia_payments)
                          );
                        }}
                        error={touched.jumia_amount && errors.jumia_amount}
                      />

                      <TextInput
                        label="Jumia Variance"
                        type="number"
                        disabled
                        placeholder="Jumia Variance"
                        value={values["jumia_amount_variance"]}
                        error={
                          touched.jumia_amount_variance &&
                          errors.jumia_amount_variance
                        }
                      />
                    </div>

                    <div className="flex flex-row gap-2">
                      <TextInput
                        label="Glovo Amount"
                        type="number"
                        placeholder="Glovo Amount"
                        value={values["glovo_amount"]}
                        onChange={(e) => {
                          setFieldValue("glovo_amount", e.target.value);
                          setFieldValue(
                            "glovo_amount_variance",
                            parseValidFloat(e.target.value) -
                              parseValidFloat(currentSession?.glovo_payments)
                          );
                        }}
                        error={touched.glovo_amount && errors.glovo_amount}
                      />

                      <TextInput
                        label="Glovo Variance"
                        type="number"
                        disabled
                        placeholder="Glovo Variance"
                        value={values["glovo_amount_variance"]}
                        error={
                          touched.glovo_amount_variance &&
                          errors.glovo_amount_variance
                        }
                      />
                    </div>

                    <div className="flex flex-row gap-2">
                      <TextInput
                        label="Bolt Amount"
                        type="number"
                        placeholder="Bolt Amount"
                        value={values["bolt_amount"]}
                        onChange={(e) => {
                          setFieldValue("bolt_amount", e.target.value);
                          setFieldValue(
                            "bolt_amount_variance",
                            parseValidFloat(e.target.value) -
                              parseValidFloat(currentSession?.bolt_payments)
                          );
                        }}
                        error={touched.bolt_amount && errors.bolt_amount}
                      />

                      <TextInput
                        label="Bolt Variance"
                        type="number"
                        disabled
                        placeholder="Bolt Variance"
                        value={values["bolt_amount_variance"]}
                        error={
                          touched.bolt_amount_variance &&
                          errors.bolt_amount_variance
                        }
                      />
                    </div>

                    <div className="flex flex-row gap-2">
                      <TextInput
                        label="Uber Amount"
                        type="number"
                        placeholder="Uber Amount"
                        value={values["uber_amount"]}
                        onChange={(e) => {
                          setFieldValue("uber_amount", e.target.value);
                          setFieldValue(
                            "uber_amount_variance",
                            parseValidFloat(e.target.value) -
                              parseValidFloat(currentSession?.uber_payments)
                          );
                        }}
                        error={touched.uber_amount && errors.uber_amount}
                      />

                      <TextInput
                        label="Uber Variance"
                        type="number"
                        disabled
                        placeholder="Uber Variance"
                        value={values["uber_amount_variance"]}
                        error={
                          touched.uber_amount_variance &&
                          errors.uber_amount_variance
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-2">
                      <TextInput
                        label="Complimentary Amount"
                        type="number"
                        placeholder="Complimentary Amount"
                        value={values["complimentary_amount"]}
                        onChange={(e) => {
                          setFieldValue("complimentary_amount", e.target.value);
                          setFieldValue(
                            "complimentary_amount_variance",
                            parseValidFloat(e.target.value) -
                              parseValidFloat(currentSession?.uber_payments)
                          );
                        }}
                        error={touched.complimentary_amount && errors.complimentary_amount}
                      />

                      <TextInput
                        label="Complimentary Variance"
                        type="number"
                        disabled
                        placeholder="Complimentary Variance"
                        value={values["complimentary_amount_variance"]}
                        error={
                          touched.complimentary_amount_variance &&
                          errors.complimentary_amount_variance
                        }
                      />
                    </div>
                  </>
                )}

                <Textarea
                  label="Narration"
                  placeholder="Narration"
                  value={values["narration"]}
                  onChange={(e) => setFieldValue("narration", e.target.value)}
                  error={touched.narration && errors.narration}
                />
              </section>

              <section className="flex justify-end space-y-2 p-3 rounded-lg my-3">
                <Button type="submit" loading={isSubmitting}>
                  Save
                </Button>
              </section>
            </Form>
          )}
        </Formik>
      </Modal>

      <Button
        color="red"
        variant="outline"
        leftIcon={<IconX size={16} />}
        onClick={() => setOpened(true)}
      >
        Close
      </Button>
    </>
  );
}

export default ClosePosSessionModal;
