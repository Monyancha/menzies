import { useDispatch, useSelector } from "react-redux";
import {
  clearClient,
  fetchPointsTemplate,
  checkUnRedeemedPoints,
} from "../../../../store/merchants/transactions/transaction-slice";
import { checkTemplateStatus } from "@/store/merchants/partners/clients-slice";
import { IconX } from "@tabler/icons";
import { ActionIcon, Badge, Text } from "@mantine/core";
import { parseValidFloat } from "../../../../lib/shared/data-formatters";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export default function SelectedContactPreview({ selectedClient = null }) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const sum_db_cr = (db, cr) => parseValidFloat(db) - parseValidFloat(cr);
  const pointConversionStatus = useSelector(
    (state) => state.posTransaction.pointConversionStatus
  );

  const award_data = useSelector(
    (state) => state.posTransaction.clientAwardPoints
  );

  const clientUnredeemedPoints = useSelector(
    (state) => state.posTransaction.clientUnredeemedPoints
  );

  const template_status = useSelector((state) => state.clients.template_status);

  const checkTemplatesStatus = useSelector(
    (state) => state.clients.checkTemplatesStatus
  );

  const checkUnRedeemedPointsStatus = useSelector(
    (state) => state.clients.checkUnRedeemedPointsStatus
  );

  useEffect(() => {
    if (
      !accessToken ||
      status !== "authenticated" ||
      pointConversionStatus !== "idle" ||
      checkTemplatesStatus !== "idle" ||
      checkUnRedeemedPointsStatus !== "idle"
    ) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["client_id"] = selectedClient?.id;

    dispatch(fetchPointsTemplate(params));
    dispatch(checkTemplateStatus(params));
    dispatch(checkUnRedeemedPoints(params));
  }, [
    status,
    accessToken,
    dispatch,
    pointConversionStatus,
    checkTemplatesStatus,
    checkUnRedeemedPointsStatus,
    selectedClient,
  ]);

  //(template_status);

  return (
    selectedClient && (
      <section className="border border-v3-darkest shadow-lg rounded px-3 py-2 text-dark flex items-center justify-start gap-2">
        <ActionIcon
          size="md"
          variant="outline"
          color="red"
          onClick={() => dispatch(clearClient())}
        >
          <IconX size={16} />
        </ActionIcon>

        <Text color="dimmed">
          <div className="text-md">{selectedClient?.name ?? "-"}</div>
        </Text>
        {!template_status && (
          <Badge variant="filled" color="green">
            {sum_db_cr(
              selectedClient?.points_debit_sum_points ?? 0,
              selectedClient?.points_credit_sum_points ?? 0
            )}{" "}
            points
          </Badge>
        )}

        {template_status && (
          <Badge variant="light" color="green">
            {award_data ?? 0}
            points
          </Badge>
        )}
        {clientUnredeemedPoints > 0 && !award_data && (
          <Badge variant="light" color="green">
            UnRedeemed Points {clientUnredeemedPoints ?? 0}
          </Badge>
        )}
      </section>
    )
  );
}
