import {
  Button,
  Modal,
  Select,
  TextInput,
  Textarea,
  Checkbox,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconTimeline } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCarWash } from "../../../lib/shared/roles_and_permissions";

import store from "../../../store/store";
import { createNewPosSession } from "@/store/merchants/transactions/pos-sessions-slice";
import {
  showAlertSuccess,
  showAlertWarning,
} from "@/store/shared/bottom-alerts-slice";
function NewSessionModal({ mt, size }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [openingBalance, setOpeningBalance] = useState(0);
  const dispatch = useDispatch();

  const onOpeningBalanceChanged = (value) => {
    setOpeningBalance(value);
  };

  const creationStatus = useSelector(
    (state) => state.posSessions.createNewPosSessionStatus
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isCreatingSession = creationStatus === "loading";

  useEffect(() => {
    if (creationStatus === "fulfilled") {
      dispatch(showAlertSuccess({ message: "Created session successfully" }));
    }

    if (creationStatus === "rejected") {
      dispatch(showAlertWarning({ message: "Could not create session" }));
    }
  }, [creationStatus, dispatch]);

  function onNewSessionClicked() {
    if (!session || status !== "authenticated" || isCreatingSession) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["amount"] = openingBalance;
    params["branch_id"] = branch_id;

    store.dispatch(createNewPosSession(params));
  }

  return (
    <>
      <Modal
        opened={opened}
        title="New Session"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="lg"
      >
        <section className="flex flex-col space-y-2 px-3 rounded-lg">
          <TextInput
            placeholder="Opening Balance"
            label="Opening Balance"
            withAsterisk
            value={openingBalance}
            onChange={(e) => onOpeningBalanceChanged(e.currentTarget.value)}
            name="customer_name"
          />
        </section>
        <section className="flex justify-end space-y-2 mx-3 rounded-lg my-3">
          <Button onClick={onNewSessionClicked}>Create</Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconTimeline size={14} />}
        variant="outline"
        size={size ?? "sm"}
        mt={mt}
        onClick={() => setOpened(true)}
      >
        Create Session
      </Button>
    </>
  );
}

export default NewSessionModal;
