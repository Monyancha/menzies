import {
  Button,
  Modal,
  Select,
  TextInput,
  Table,
  ScrollArea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import {
  submitMultipleStockTransfer,
  fetchBranchesData,
  clearTransfers,
  setIndex,
  setStockToTransfer,
  setBranchToTransfer,
} from "../../../store/merchants/settings/branches-slice";
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { useSelect } from "@mui/base";
import { stubTrue } from "lodash";

function TransferMultipleStock({ product }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [submit_details, setSubmitDetails] = useState([]);

  let branch_id = useSelector((state) => state.branches.branch_id);

  const product_ids = useSelector((state) => state.branches.transfer_ids);

  let [inputFields, setInputFields] = useState(product_ids);
  const [isTransafering, setIsTrans] = useState(false);

  useEffect(() => {
    setInputFields(product_ids);
    setSubmitDetails([...product_ids]);
    console.log(product_ids);
  }, [product_ids]);

  // console.log(submitDetails);

  const form = useForm({
    initialValues: { name: "", email: "", age: 0 },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) => (value.length < 1 ? "This field cannot be empty" : null),
    },
  });

  const handleInputChangeOne = (index, value) => {
    // Object.freeze(inputFields);
    // let data = [...inputFields];
    // alert("You Are Good To Go" + value);
    // //data[index]['stock_to_transfer'] =  value;
    let index_pars = { index_id: index };
    let trans_pars = { stock_to_transfer: value };
    store.dispatch(setIndex(index_pars));
    store.dispatch(setStockToTransfer(trans_pars));
  };

  const handleInputChangeTwo = (index, value) => {
    // Object.freeze(inputFields);
    // let data = [...inputFields];
    // alert("You Are Good To Go" + value);
    // // data[index]['branch_to_transfer'] =  value

    let index_pars = { index_id: index };
    let branch_pars = { branch_to_transfer: value };
    store.dispatch(setIndex(index_pars));
    store.dispatch(setBranchToTransfer(branch_pars));

    // setInputFields(data);
    // console.log(value);
  };

  // let data2 =  [...inputFields];
  // useEffect(() => {

  //   product_ids.map(function(item){
  //     data2['id'] = item;
  //     data2['name']  = products?.data?.find((value) => value?.id === item).name;
  //     data2['current_stock'] = products?.data?.find((value) => value?.id === item).total_remaining
  //     setInputFields(data2);
  //   })
  //   },[product_ids])

  //   console.log(inputFields);

  // ;
  const products = useSelector((state) => state.products.getProducts);

  let branchesList = useSelector((state) => state.branches.branchesList);
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

  const router = useRouter();

  let title = "Transfer Multiple Stock From Branch :   " + branch_name;

  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);

  function clearForm() {
    setInputFields([]);
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

  let branchesDataOne = branchesList?.filter(function (item) {
    return item.id === branch_id;
  });

  let branchesDataTwo = branchesList?.filter(function (item) {
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
  let errors = [];

  async function submitMultiple() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    // product_ids.map((item,index) => ({
    //   if(item[index]['stock_to_transfer'])
    //   {

    //   }
    // })

    if (
      confirm(
        "Are you sure you want to transfer the stock of selected products"
      )
    ) {
      setIsTrans(true);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["product_details"] = product_ids;
      params["from_branch"] = branch_id;

      try {
        await dispatch(submitMultipleStockTransfer(params)).unwrap();
        showNotification({
          title: "Success",
          message: "Stock successfully transfered",
          color: "green",
        });
        //clearForm();
        setOpened(false);
        const pa = {};
        pa["rArray"] = [];

        const par = {};
        par["accessToken"] = session.user.accessToken;
        par["branch_id"] = branch_id;
        store.dispatch(getProducts(par));
        store.dispatch(clearTransfers());
        setIsTrans(false);
      } catch (e) {
        let message = null;
        if (e?.message ?? null) {
          message = e.message;
        } else {
          message = "Could not transfer";
          setIsTrans(false);
        }
        showNotification({
          title: "Error",
          message,
          color: "red",
        });
        setIsTrans(false);
      }
    } else {
      alert("You Have Canceled The Transfer");
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title={title}
        onClose={() => setOpened(false)}
        padding="xs"
        size="auto"
      >
        {isBranchSelected && (
          <section>
            <span className="text-dark text-sm font-bold">
              Multiple Stock Transfer {inputFields.length} Item(s) Selected
            </span>
            <div className="inline-block py-2 min-w-full">
              <div className="overflow-x overflow-y">
                <table className="min-w-fulll">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-sm">
                        <div className="w-full overflow-x">ID</div>
                      </th>
                      <th className="text-sm">
                        <div className="w-full overflow-x">PRODUCT</div>
                      </th>
                      <th className="text-sm">
                        <div className="w-full overflow-x">CURRENT QTY</div>
                      </th>
                      <th className="text-sm">
                        <div className="w-full overflow-x">TRANSFER QTY</div>
                      </th>
                      <th className="text-sm">
                        <div className="w-full overflow-x">TRANSFER TO</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputFields?.map((input, index) => (
                      <tr className="border-b" key={index}>
                        <td>
                          <TextInput fz="sm" value={input.id} disabled />
                        </td>
                        <td>
                          <TextInput fz="sm" value={input.name} disabled />
                        </td>
                        <td>
                          <TextInput
                            fz="sm"
                            value={input.current_stock}
                            disabled
                          />
                        </td>
                        <td>
                          <TextInput
                            fz="sm"
                            name="stock_to_transfer"
                            type="number"
                            defaultValue={input.stock_to_transfer}
                            onChange={(e) =>
                              handleInputChangeOne(index, e.currentTarget.value)
                            }
                          />
                        </td>
                        <td>
                          <Select
                            onChange={(e) => handleInputChangeTwo(index, e)}
                            data={branchesDataTo}
                            name="branch_to_transfer"
                            defaultValue={input.branch_to_transfer}
                            searchable
                            clearable
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
        {isBranchSelected && (
          <section className="flex justify-between space-y-2 bg-light p-3 rounded-lg my-3 ">
            <Button
              onClick={submitMultiple}
              loading={isSubmitting}
              responsive={true}
              className="text-sm hover:text-base"
              disabled={isTransafering ? true : false}
            >
              {isTransafering && <b>Transferring.......</b>}

              {!isTransafering && <b>TRANSFER MULTIPLE</b>}
            </Button>
          </section>
        )}

        {!isBranchSelected && (
          <section>Please Select Branch You Want To Transfer From</section>
        )}
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        responsive={true}
        className="text-sm hover:text-base"
      >
        Transfer Multiple
      </Button>
    </>
  );
}

export default TransferMultipleStock;
