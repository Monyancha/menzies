import { useContext, useEffect, useMemo, useState } from "react";
import InputControl from "../../../ui/forms/input-control";
import { Fragment } from "react";
import { ModalBackButton } from "../../../ui/layouts/modal";
import ActionButton from "../../../ui/actions/action-button";
import Modal from "../../../ui/layouts/modal";
import store from "../../../../store/store";
import { createNewPosSession } from "../../../../store/merchants/transactions/pos-sessions-slice";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  showAlertSuccess,
  showAlertWarning,
} from "../../../../store/shared/bottom-alerts-slice";

function NewPosSessionModal() {
  const { data: session, status } = useSession();
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

  const modalActions = (
    <Fragment>
      <ModalBackButton />
      <ActionButton
        title="Create"
        size="md"
        filled={true}
        clickHandler={onNewSessionClicked}
        isLoading={isCreatingSession}
        icon="fa-solid fa-save"
      />
    </Fragment>
  );

  return (
    <Modal
      idRef="new-pos-session"
      title="Create POS Session"
      actions={modalActions}
    >
      <div className="w-full">
        <InputControl
          labelText="Opening Balance"
          type="number"
          value={openingBalance}
          onChangeHandler={onOpeningBalanceChanged}
        />
      </div>
    </Modal>
  );
}

export default NewPosSessionModal;
