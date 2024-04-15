import BackButton from "../../../../../components/ui/actions/back-button";
import Card from "../../../../../components/ui/layouts/card";
import TableCardHeader from "../../../../../components/ui/layouts/table-card-header";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../../../../src/store/Store";
import StatelessLoadingSpinnerDark from "../../../../../components/ui/utils/stateless-loading-spinner-dark";
import { Table, TSearchFilter } from "../../../../../components/ui/layouts/scrolling-table";
import {
  TheadDark,
  TrowDark,
} from "../../../../../components/ui/layouts/scrolling-table-dark";
import { formatDate } from "../../../../../lib/shared/data-formatters";
import { Button } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import CreateLinkButton from "../../../../../components/ui/actions/create-link-button";
import PaginationLinksDark from "../../../../../components/ui/layouts/pagination-links-dark";
import { fetchPettyCashWalletDetails } from "../../../../../src/store/accounts/accounts-slice";
import { IconPlus, IconTrash, IconDeviceFloppy } from "@tabler/icons-react";

import * as Yup from "yup";
import { Form, Formik } from "formik";
import CardDark from "../../../../../components/ui/layouts/card-dark";
import { submitUIForm } from "../../../../../lib/shared/form-helpers";
import { useRouter } from "next/router";
import { Textarea, TextInput, ActionIcon } from "@mantine/core";

import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../../src/components/container/PageContainer";
const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/accounts/expenses",
    title: "Expenses",
  },
  {
    to: "/accounts/expenses/petty_cash_wallets",
    title: "Petty Cash",
  },
  {
    title: "New Petty Cash",
  },
];


export default function StorePettyCashWallets() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  let walletId = router?.query?.walletId ?? "";
  walletId = walletId == "-1" ? "" : walletId;

  const isLoading = useSelector(
    (state) => state.accounts.walletDetailsStatus === "loading"
  );

  useEffect(() => {
    if (!accessToken || !walletId) {
      return;
    }

    store.dispatch(
      fetchPettyCashWalletDetails({ accessToken, recordId: walletId })
    );
  }, [accessToken, walletId]);

  const actions = (
    <div className="flex flex-row gap-1">
      <BackButton href="/accounts/expenses/petty_cash_wallets" />
    </div>
  );

  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Petty Cash" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>

      {isLoading && (
        <div className="flex flex-row justify-center py-2">
          <StatelessLoadingSpinnerDark />
        </div>
      )}

      {!isLoading && <CrudView />}
      </Box>
    </PageContainer>
  );
}

function CrudView() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  let walletId = router?.query?.walletId ?? "";
  walletId = walletId == "-1" ? "" : walletId;
  const isEditing = useMemo(
    () => (router?.query?.walletId ?? "") != "-1",
    [router]
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const walletDetailsRaw = useSelector((state) => state.accounts.walletDetails);
  const walletDetails = useMemo(
    () => (walletId ? walletDetailsRaw : {}),
    [walletDetailsRaw, walletId]
  );

  const FIELD_REQUIRED = "This field is required";
  const FormSchema = Yup.object().shape({
    name: Yup.string().required(FIELD_REQUIRED),
    description: Yup.string().notRequired(),
    opening_balance: Yup.number().notRequired(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Formik
      initialValues={{
        name: walletDetails?.name ?? "",
        description: walletDetails?.description ?? "",
        opening_balance: walletDetails?.copies ?? "",
      }}
      validationSchema={FormSchema}
      onSubmit={async (values) => {
        const url = `/accounts/expenses/petty_cash_wallets/${walletId}`;

        const body = { ...values };
        body["branch_id"] = branch_id;
        console.log("Submitting", values, url);

        const params = {};
        params["accessToken"] = accessToken;
        params["body"] = body;
        params["url"] = url;
        params["onSuccess"] = () => {
          router.replace(`/accounts/expenses/petty_cash_wallets`);
        };

        setIsSubmitting(true);

        await submitUIForm(params);

        setIsSubmitting(false);
      }}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form>
          <section className="w-full flex flex-col gap-1">
            <CardDark>
              <div
                className={`grid grid-cols-1 gap-2
              ${isEditing ? "md:grid-cols-1" : "md:grid-cols-2"}
                `}
              >
                <TextInput
                  label="Name"
                  placeholder="Name"
                  type="text"
                  value={values?.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  error={touched?.name && errors?.name}
                  withAsterisk
                />

                {!isEditing && (
                  <TextInput
                    label="Opening Balance"
                    placeholder="Opening Balance"
                    type="number"
                    value={values?.opening_balance}
                    onChange={(e) =>
                      setFieldValue("opening_balance", e.target.value)
                    }
                    error={touched?.opening_balance && errors?.opening_balance}
                  />
                )}

                <Textarea
                  label="Description"
                  placeholder="Description"
                  value={values?.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  error={touched?.description && errors?.description}
                />
              </div>
            </CardDark>

            <CardDark>
              <div className="flex flex-row gap-2 w-full justify-state">
                <Button
                  type="submit"
                  variant="outline"
                  leftIcon={<IconDeviceFloppy size={16} />}
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </CardDark>
          </section>
        </Form>
      )}
    </Formik>
  );
}
