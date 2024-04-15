import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
  getTimeAgo,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "../../../../lib/shared/data-formatters";
import { fetchVariationList } from "../../../../store/merchants/inventory/variation-slice";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import LinkButton from "../../../ui/actions/link-button";
import { Stat, StatsContainer } from "../../../ui/display/stats";
import Card from "../../../ui/layouts/card";
import { TextInput, Textarea, Button, Modal, Select, Menu, Checkbox } from "@mantine/core";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import {
  Table,
  TSearchFilter,
  TDateFilter,
  Trow,
} from "../../../ui/layouts/scrolling-table";
import {
  IconChevronDown,
  IconDownload,
  IconListDetails,
  IconPrinter,
  IconPencil
} from "@tabler/icons";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import store from "../../../../store/store";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import {

  fetchRequisitionList,
  fetchManuProducts,
  submitEditReq,
} from "@/store/merchants/inventory/requisition-slice";
import { fetchStaff } from "@/store/merchants/partners/staff-slice";
import { fetchExistingComponent, fetchExistingRecipes } from "@/store/merchants/inventory/products-slice";
import { isMerchant } from "@/lib/shared/roles_and_permissions";
import { DatePicker } from "@mantine/dates";

function EditReqModal({ item }) {
  const { data: session, status } = useSession();
  const components = useSelector((state) => state.products.existingComponents);

    const product = useSelector((state) => state.requisition.manu_products);


    const recipes = useSelector((state) => state.products.recipes);
    const existingComponentStatus = useSelector(
        (state) => state.products.existingComponentStatus
      );
    const isLoading = existingComponentStatus === "loading";
    const accessToken = session?.user?.accessToken;

    const branch_id = useSelector((state) => state.branches.branch_id);
    const staffList = useSelector((state) => state.staff.staffList);
    const [opened, setOpened] = useState(false);

    const [staff_id, setStaffId] = useState(item?.staff_id);
    const [requisition_date, setReqDate] = useState(new Date(item?.request_date));
    const [no_products, setNoProducts] = useState(item?.no_products);
    const [req_comments, setReqComments] = useState(item?.request_comments);
    const [receival_comments, setReceivalComments] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [req_id, setReqId] = useState(item?.id);
    const [quantity_to_manufacture,setQtyManufacture] = useState(item?.quantity_to_manufacture);
    const [req_no, setReqNo] = useState(item?.requistion_no);
    const [product_name, setProductName] = useState(item?.sellables?.sellable?.name);
    const [bill_of_material_edit, setBillEdit] = useState(item?.recipes?.id);
    const [manu_prod_id, setManuProdId] = useState(item?.sellables?.sellable?.id);
    const [selected_product_edit, setProduct] = useState(item?.sellables?.sellable?.id);
    const [all_cost_edit, setAllCostEdit] = useState(item?.total_cost);
    const [product_components_edit, setProductsEdit] = useState([]);



const calculate_totals = (quantity_to_manufacture,product_components_edit) => {
  let data_two = [...product_components_edit];
  data_two?.map((item, index) => {
      data_two[index]["quantity_req"] = quantity_to_manufacture * data_two[index]["qty_per_item"];
      data_two[index]["total_cost"] = parseInt(data_two[index]["quantity_req"] * data_two[index]["cost"]);
      data_two[index]["no_manu"] = parseInt(quantity_to_manufacture);
  });
  return product_components_edit
}

const calculation = useMemo(() => calculate_totals(quantity_to_manufacture,product_components_edit)
, [quantity_to_manufacture,product_components_edit]);

 useEffect(() => {
    if (calculation) {
        return;
    }
    //console.log("You Are Good To Go");

    setProductsEdit(calculation);

    //console.log(product_components_edit);
}, [calculation])

const removeComponent = (index) => {
  let data = [...product_components_edit];
  data.splice(index, 1);
  setProductsEdit(data);
};


useEffect(() => {
    if (!accessToken || status !== "authenticated"  || !selected_product_edit) {
        return;
    }
    const params = {};
    params["productId"] = selected_product_edit;
    params["recipe_id"] = bill_of_material_edit
    params["accessToken"] = accessToken;
    store.dispatch(fetchExistingRecipes(params));
    console.log("The selected product is " + selected_product_edit);

}, [accessToken,status,selected_product_edit,bill_of_material_edit]);

useEffect(() => {
  if(!quantity_to_manufacture)
  {
    return;
  }
    setAllCostEdit(
      product_components_edit?.reduce(
        (sum, item) => sum + parseValidFloat(item?.total_cost),
        0
      ) ?? 0
    );
  }, [product_components_edit,quantity_to_manufacture]);


  // useEffect(() => {
  //   if (!session || status !== "authenticated") {
  //     return;
  //   }

  //   const params = {};
  //   params["accessToken"] = session?.user?.accessToken;
  //   params["fetch_all"] = true;
  //   params["lean"] = true;
  //   params["branch_id"] = branch_id;
  //   store.dispatch(fetchStaff(params));
  //   store.dispatch(fetchManuProducts(params));

  // }, [session, status,branch_id]);


  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !selected_product_edit || !bill_of_material_edit) {

        return;
    }

    const params = {};
    params["productId"] = selected_product_edit;
    params["recipe_id"] = bill_of_material_edit;
    params["accessToken"] = accessToken;
    store.dispatch(fetchExistingComponent(params));
}, [selected_product_edit,bill_of_material_edit,accessToken,status]);

useEffect(() => {
  if (!selected_product_edit || !bill_of_material_edit || !item) {

      return;
  }

  let y = item?.sellables?.manufactured_products;
    if(y.length>0)
    {
      let new_data = []
    item?.requisition_products?.map((item) => {
        // console.log(y?.find((it) => it?.component_sellable_id===item?.component_sellable_id).total_quantity_deducted);

        new_data.push({
            id: selected_product_edit,
            name: item?.sellables?.sellable?.name ?? "",
            qty_per_item:
                y?.find(
                    (it) => it?.component_sellable_id === item?.component_sellable_id
                )?.total_quantity_deducted ?? 0,
            quantity_req: item?.quantity_requested ?? 0,
            total_cost: item?.total_cost ?? 0,
            product_sellable_id: item?.product_sellable_id,
            component_sellable_id: item?.component_sellable_id,
            cost: item?.sellables?.sellable?.buying_price ?? 0,
            no_manu: item?.quantity_manufactured,
            status: item?.status ?? "",
            action: item?.requisition_action ?? "",
            action_status: "Edit",
        });

    });
    setProductsEdit(new_data);
    }
}, [selected_product_edit,bill_of_material_edit,item]);




// useEffect(() => {
//     let data = [];
//     if (components?.data.length > 0) {
//       components?.data?.map((item) => {
//         data.push({
//           id: selected_product_edit,
//           name: item?.sellable?.name,
//           qty_per_item: item?.product_components[0]?.total_quantity_deducted,
//           quantity_req: "",
//           total_cost: "",
//           product_sellable_id: item?.product_components[0]?.product_sellable_id,
//           component_sellable_id:
//             item?.product_components[0]?.component_sellable_id,
//           cost: item?.sellable?.buying_price ?? 0,
//           no_manu: "",
//           action: "",
//         });
//       });
//     }
//     setProductsEdit(data);
//   }, [components, selected_product_edit]);



  async function submitEditDetails() {
    if (!session || status !== "authenticated") {
        return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["staff_id"] = staff_id;
    params["product_components"] = product_components_edit;
    params["req_comments"] = req_comments;
    params["requisition_date"] = requisition_date;
    params["productId"] = selected_product_edit ?? manu_prod_id;
    params['quantity_to_manufacture'] = quantity_to_manufacture;
    params['recipe_id'] = bill_of_material_edit
    params["all_cost"] = all_cost_edit;
    params["req_id"] = req_id;

    setIsSubmitting(true);
    try {
        await store.dispatch(submitEditReq(params)).unwrap();
        showNotification({
            position: "top-right",
            zIndex: 2077,
            title: "SUCCESS",
            message: "Stock Requisition Successfully Updated",
            color: "green",
            autoClose: true,
        });

        setProductsEdit([]);

        setIsSubmitting(false);

        store.dispatch(fetchRequisitionList(params));
        setOpened(false);

    } catch (e) {
        let message = null;
        if (e?.message ?? null) {
            message = e.message;
        } else {
            message = "Could not save record";
        }
        showNotification({
            title: "Error",
            message,
            color: "red",
        });
        setIsSubmitting(false);
    }
}
const handleAction = (e,index) => {
  let data = [...product_components_edit];
  data[index]['action'] = e
  setProductsEdit(data);
}
const staffsData =
staffList?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
})) ?? [];

const productsData =
product?.map((item) => ({
    value: item?.id,
    label: item?.name,
})) ?? [];

const recipesData = recipes?.data?.map((item) => ({
value: item?.id,
label: item?.name,
})) ?? [];

let requisition_actions = [
{ label: "Internal Picking", value: "Internal" },
{ label: "Purchase Order", value: "Purchase" },
];





  return (
    <>
      <Modal
        opened={opened}
        title={`Edit Requisition #${req_no}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="70%"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Edit Requisition For {product_name ?? " "}
          </span>

          <div className="min-h-96 h-fit w-100 mx-6 mb-10">
                                        <div className="h-full w-full bg-white rounded-xl px-4 py-4 flex flex-col">
                                            <Table>
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th scope="col" className="th-primary">
                                                            {isMerchant(session?.user) && (
                                                                <Select
                                                                    placeholder="Staff"
                                                                    label="Select Staff"
                                                                    data={staffsData}
                                                                    onChange={(e) => setStaffId(e)}
                                                                    value={staff_id}
                                                                    searchable
                                                                    clearable
                                                                    required
                                                                />
                                                            )}
                                                        </th>
                                                        <th scope="col" className="th-primary">

                                                            <Select
                                                                label="Select Manufactured Product"
                                                                value={selected_product_edit}
                                                                data={productsData}
                                                                onChange={(e) => {
                                                                    setProduct(e);
                                                                    setBillEdit("");
                                                                    setProductsEdit([]);
                                                                }}
                                                                searchable
                                                                clearable
                                                                required
                                                            />
                                                        </th>



                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selected_product_edit && (
                                                        <tr>
                                                            <th scope="col" className="th-primary">

                                                                <Select
                                                                    label="Select Bill Of Material"
                                                                    value={bill_of_material_edit}
                                                                    placeholder="Bill Of Material"
                                                                    data={recipesData}
                                                                    onChange={(e) => {
                                                                        setBillEdit(e);
                                                                    }}
                                                                    searchable
                                                                    clearable
                                                                    required
                                                                />
                                                            </th>
                                                            <th scope="col" className="th-primary">
                                                                <TextInput
                                                                    className="w-full sm:w-auto"
                                                                    label="Quantity To Manufacture"
                                                                    placeholder="Quantity"
                                                                    onChange={(e) => { setQtyManufacture(e.currentTarget.value) }}
                                                                    value={quantity_to_manufacture}
                                                                />
                                                            </th>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>

                                            <Table>
                                                {product_components_edit?.length > 0 && (
                                                    <thead className="">
                                                        <tr>
                                                            <th scope="col" className="th-primary text-darkest">
                                                                Component/Ingredient
                                                            </th>
                                                            <th scope="col" className="th-primary text-darkest">
                                                                Buying Price
                                                            </th>
                                                            <th scope="col" className="th-primary text-darkest">
                                                                Total Quantity Per Product
                                                            </th>
                                                            <th scope="col" className="th-primary text-darkest">
                                                                No Of Products Required
                                                            </th>

                                                            <th scope="col" className="th-primary text-darkest">
                                                                Total Cost
                                                            </th>
                                                            <th scope="col" className="th-primary text-darkest">
                                                                Quantity To Manufacture
                                                            </th>
                                                            <th scope="col" className="th-primary text-darkest">
                                                                Requisition Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                )}
                                               <tbody>
                  {!isLoading &&
                    product_components_edit?.map((item, index) => (
                      <tr className="border-b" key={index}>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            value={item?.name}
                            disabled
                            readOnly
                          />
                        </td>

                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            value={item?.cost}
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            value={item?.qty_per_item}
                            disabled
                          />
                        </td>

                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            value={item?.quantity_req}
                            disabled
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            value={item?.total_cost}
                            disabled
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            value={item?.no_manu}
                            disabled
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <Select
                            data={requisition_actions}
                            searchable
                            clearable
                           onChange={(e)=> {handleAction(e,index)}}
                          />
                        </td>
                        {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.product_components[0]?.final_cost}
                            </td> */}

                        <td className="py-3 px-6 text-sm whitespace-nowrap text-right gap-2 flex">
                          <i
                            onClick={() => removeComponent(index)}
                            className="text-red-800 font-bold px-2 cursor-pointer mt-4"
                          >
                            X
                          </i>
                        </td>
                      </tr>
                    ))}
                </tbody>
                                                {product_components_edit?.length > 0 && (
                                                    <Trow>

                                                            <td colSpan={4} className="text-lg font-bold">
                                                                Total Cost : Kshs {formatNumber(all_cost_edit)}
                                                            </td>

                                                    </Trow>
                                                )}
                                            </Table>

                                            <div
                                                className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}
                                            >

                                                <Textarea
                                                    label="Requistion Comments"
                                                    autosize
                                                    minRows={2}
                                                    maxRows={4}
                                                    onChange={(e) => setReqComments(e.currentTarget.value)}
                                                    value={req_comments}
                                                />


                                                {/* <DatePicker
                                                    onChange={(e) => setReqDate(e)}
                                                    defaultValue={requisition_date}
                                                    label="Date Requested"
                                                /> */}
                                            </div>
                                            <div
                                                className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-1 gap-2 overflow-x-auto`}
                                            ></div>

                                            <div
                                                className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}
                                            >
                                                <div className=""></div>

                                                <div className="">



                                                    <Button
                                                        disabled={true}
                                                        type="submit"
                                                        size="md"
                                                        onClick={submitEditDetails}
                                                    >
                                                        {!isSubmitting && <b> EDIT</b>}

                                                    </Button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
        </section>

        {/* <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section> */}
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Edit
      </Button>
    </>
  );
}

export default EditReqModal;
