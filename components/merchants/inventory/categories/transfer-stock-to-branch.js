import { Button, Modal, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  submitStockTransfer,
  fetchBranchesData,
} from "../../../../store/merchants/settings/branches-slice";
import { getProducts } from "../../../../store/merchants/inventory/products-slice";
import store from "../../../../store/store";

function TransferStock({ product }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [isTransafering, setIsTrans] = useState(false);

  let branch_id = useSelector((state) => state.branches.branch_id);

  let branchesList = useSelector((state) => state.branches.branchesList ?? []);
  let branch_name = null;
  let isBranchSelected = true;
  if (isNaN(branch_id)) {
    // alert("Select Branch To Transfer From First");
    isBranchSelected = false;
  } else {
    branch_name = branchesList?.find(function (item) {
      return item.id === branch_id;
    })?.name;
    isBranchSelected = true;
  }

  const [from_branch, setFromBranch] = useState(branch_id);
  const [to_branch, setToBranch] = useState();
  const [stock_to_transfer, setStockTransfer] = useState();
  const [current_stock, setCurrentStock] = useState(
    product?.total_remaining ? product?.total_remaining : 0
  );

  const router = useRouter();

  let title = "Transfer Stock Of Product :   " + product?.name;

  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  function clearForm() {
    setFromBranch("");
    setToBranch("");
    setStockTransfer("");
    setCurrentStock(null);
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (dataStatus === "fulfilled") {
      store.dispatch(fetchBranchesData(params));
    }
  }, [dataStatus, session, status]);

  let branchesDataOne = branchesList.filter(function (item) {
    return item.id === branch_id;
  });

  let branchesDataTwo = branchesList.filter(function (item) {
    return item.id != branch_id;
  });

  let branchesData =
    branchesDataOne?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  let branchesDataTo =
    branchesDataTwo?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const isSubmitting = useSelector(
    (state) => state.branches.submissionStatus == "loading"
  );

  const dispatch = useDispatch();

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["id"] = product?.id;
    params["from_branch"] = from_branch;
    params["to_branch"] = to_branch;
    params["stock_to_transfer"] = stock_to_transfer;
    params["current_stock"] = current_stock;
    setIsTrans(true);

    try {
      await dispatch(submitStockTransfer(params)).unwrap();
      showNotification({
        title: "Success",
        message: "Stock successfully transfered",
        color: "green",
      });
      clearForm();
      setIsTrans(false);
      const par = {};
      par["accessToken"] = session.user.accessToken;
      par["branch_id"] = branch_id;
      store.dispatch(getProducts(par));
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not transfer";
        setIsTrans(true);
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title={title}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {isBranchSelected && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <span className="text-dark text-sm font-bold">Stock Transfer</span>

            <TextInput
              label="Branch To Transfer From"
              value={branch_name}
              onChange={setFromBranch}
              searchable
              clearable
              disabled
            />

            <Select
              placeholder="Transfer To "
              label="Select Branch To Transfer To"
              value={to_branch}
              onChange={setToBranch}
              data={branchesDataTo}
              searchable
              clearable
            />

            <TextInput
              placeholder="Current Stock"
              label="Current Stock"
              type="number"
              value={current_stock}
              onChange={(e) => setCurrentStock(e.currentTarget.value)}
              disabled
            />

            <TextInput
              placeholder="Enter Stock To Transfer"
              label="Enter Stock To Transfer"
              type="number"
              value={stock_to_transfer}
              onChange={(e) => setStockTransfer(e.currentTarget.value)}
            />
          </section>
        )}
        {isBranchSelected && (
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button
              onClick={submitDetails}
              loading={isSubmitting}
              disabled={isTransafering ? true : false}
            >
              {isTransafering && <b>Transferring.......</b>}

              {!isTransafering && <b>TRANSFER</b>}
            </Button>
          </section>
        )}

        {!isBranchSelected && (
          <section>Please Select Branch You Want To Transfer From</section>
        )}
      </Modal>

      <Button variant="outline" size="xs" onClick={() => setOpened(true)}>
        Transfer Stock
      </Button>
    </>
  );
}

export default TransferStock;
