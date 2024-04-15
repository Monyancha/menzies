import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { IconLockOpen, IconSend } from "@tabler/icons";
import {
  Button,
  Textarea,
  Modal,
  ActionIcon,
  Tooltip,
  Badge,
} from "@mantine/core";
import store from "@/store/store";
import { fetchApprovalStatus } from "@/store/merchants/settings/security-slice";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import { submitUIForm } from "@/lib/shared/form-helpers";
import { useRouter } from "next/router";

export default function ApprovalRequestModal({
  children = null,
  referenceableId = null,
  referenceableType = null,
  referenceableName = null,
  requiredPermission = null,
} = {}) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  const router = useRouter();

  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approvalRequestStatus = useSelector(
    (state) => state.security.approvalRequestStatus
  );
  const isLoading = useSelector(
    (state) => state.security.approvalRequestStatus === "loading"
  );
  const isLoadingAccessControl = useSelector(
    (state) => state.security.approvalRequestStatus === "loading"
  );
  const approvalRequest = useSelector((state) =>
    state.security.approvalRequest?.referenceable_id == referenceableId
      ? state.security.approvalRequest
      : null
  );

  const approvalStatus = useMemo(
    () => approvalRequest?.status,
    [approvalRequest]
  );

  useEffect(() => {
    if (
      !accessToken ||
      !router.isReady ||
      !referenceableId ||
      !referenceableType ||
      opened === undefined // This is just so that refetch is done every time modal is opened
    ) {
      return;
    }

    store.dispatch(
      fetchApprovalStatus({ accessToken, referenceableId, referenceableType })
    );
  }, [accessToken, router, referenceableId, referenceableType, opened]);

  const FormSchema = Yup.object().shape({
    message: Yup.string().notRequired(),
  });

  function onCloseModal() {
    setOpened(false);
  }

  const myAccountDataLoaded = useSelector(
    (state) => state.accessControl.myAccountDataStatus === "fulfilled"
  );

  const hasPermission = useSelector(hasBeenGranted(requiredPermission));
  const canPerformAction = useMemo(
    () => myAccountDataLoaded && hasPermission,
    [hasPermission, myAccountDataLoaded]
  );

  if (isLoadingAccessControl) {
    return null;
  }

  return (
    <>
      <Modal
        opened={opened}
        title={`Approval Request`}
        onClose={onCloseModal}
        padding="xs"
        overflow="inside"
      >
        <Formik
          initialValues={{
            message: approvalRequest?.message ?? "",
          }}
          validationSchema={FormSchema}
          onSubmit={async (values) => {
            let url = `/security/approval_requests`;

            const body = {
              ...values,
              referenceable_id: referenceableId,
              referenceable_type: referenceableType,
              status: "pending",
            };

            const params = {};
            params["accessToken"] = accessToken;
            params["body"] = body;
            params["url"] = url;
            params["successMessage"] = "Request submitted successfully";

            console.log("The body is", body);

            setIsSubmitting(true);

            await submitUIForm(params);

            setOpened(false);
            setIsSubmitting(false);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <section className="flex flex-col space-y-2 p-2 rounded-lg">
                <span className="text-base-content text-sm font-bold">
                  Approval Request: {referenceableName}{" "}
                  <span className="text-primary">#{referenceableId}</span>
                </span>

                <div className="flex flex-row justify-start">
                  {approvalRequest?.id && (
                    <>
                      <Badge>Request ID: #{approvalRequest?.id}</Badge>
                      {approvalRequest.status === "pending" && (
                        <Badge color="gray">
                          Status: {approvalRequest?.status}
                        </Badge>
                      )}
                      {approvalRequest.status === "approved" && (
                        <Badge color="green">
                          Status: {approvalRequest?.status}
                        </Badge>
                      )}
                      {approvalRequest.status === "rejected" && (
                        <Badge color="red">
                          Status: {approvalRequest?.status}
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                <Textarea
                  label="Message"
                  placeholder="Message"
                  value={values["message"]}
                  onChange={(e) => setFieldValue("message", e.target.value)}
                  error={touched.message && errors.message}
                />
              </section>

              <section className="flex justify-end items-end gap-2 space-y-2 p-2 rounded-lg my-3">
                <Button
                  type="button"
                  color="gray"
                  variant="outline"
                  loading={isSubmitting}
                  onClick={onCloseModal}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  color="blue"
                  loading={isSubmitting}
                  leftIcon={<IconSend />}
                  disabled={
                    approvalStatus === "rejected" ||
                    approvalStatus === "approved"
                  }
                >
                  {!approvalRequest?.id && "Request"}
                  {approvalStatus === "pending" && "Resend Request"}
                  {approvalStatus === "approved" && "Approved"}
                  {approvalStatus === "rejected" && "Rejected"}
                </Button>
              </section>
            </Form>
          )}
        </Formik>
      </Modal>

      {!canPerformAction && approvalStatus !== "approved" && (
        <div className="flex flex-row gap-1 relative items-center">
          <Tooltip label="Approval Request">
            <ActionIcon
              size="lg"
              variant="outline"
              color="blue"
              onClick={() => setOpened(true)}
              loading={isLoading}
            >
              <IconLockOpen size={16} />
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      {(canPerformAction || approvalStatus == "approved") && (
        <div className="flex flex-row gap-1 items-center">{children}</div>
      )}
    </>
  );
}
