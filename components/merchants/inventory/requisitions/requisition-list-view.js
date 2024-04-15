import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
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
import { TextInput, Textarea, Button, Tabs, Select, Menu, Checkbox,Tooltip } from "@mantine/core";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import {
  Table,
  TSearchFilter,
  TDateFilter,
  Trow,
  Thead
} from "../../../ui/layouts/scrolling-table";
import {
  IconChevronDown,
  IconDownload,
  IconListDetails,
  IconPrinter,
  IconNewSection
} from "@tabler/icons";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import store from "../../../../store/store";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import {
  submitRequisition,
  fetchRequisitionList,
  confirmRequest,
  getReqProductsPDF,
  receiveRequest,
  getAllReqProductsPDF,
  fetchManuProducts,
  submitEditReq,
  setManufacturedProduct,
  setRequisition
} from "@/store/merchants/inventory/requisition-slice";
import { fetchStaff } from "@/store/merchants/partners/staff-slice";
import { fetchExistingComponent, fetchExistingRecipes } from "@/store/merchants/inventory/products-slice";
import { isMerchant } from "@/lib/shared/roles_and_permissions";
import { DatePicker } from "@mantine/dates";
// import EditReqModal from "./edit-req-modal";
import RemoveReqModal from "./remove-req-modal";
import AddJobCardService from "./add-job-card-service";
import { getBookingsSelect } from "@/store/merchants/bookings/bookings-slice";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import EditReqModal from "./edit-req-modal";
function RequisitionListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  // TODO:: Check if user is merchant or normal user

  const branch_id = useSelector((state) => state.branches.branch_id);

  const can_create_req = useSelector(hasBeenGranted("can_create_requisition"));

  const can_view_req = useSelector(hasBeenGranted("can_view_requisition"));

  // console.log("can create is " + can_create_req);

  const can_confirm_req = useSelector(hasBeenGranted("can_confirm_requisition"));

  const can_receive_req = useSelector(hasBeenGranted("can_receive_requisition"));



  const staffList = useSelector((state) => state.staff.staffList);

  const selected_manufactured_product = useSelector((state) => state.requisition.manufactured_product_id);
  const selected_recipe_id = useSelector((state) => state.requisition.selected_recipe_id);


  const [staff_id, setStaffId] = useState();
  const [staff_id_edit, setStaffIdEdit] = useState();
  const [select_staff, setSelectStaff] = useState();
  const [activeTab, setActiveTab] = useState("create");
  const [requisition_date, setReqDate] = useState("");
  const [requisition_date_edit, setReqDateEdit] = useState("");
  const [req_comments, setReqComments] = useState();
  const [req_comments_edit, setReqCommentsEdit] = useState();
  const [receival_comments, setReceivalComments] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [req_components, setReqComponents] = useState([]);
  const [req_id, setReqId] = useState();
  const [manu_prod_id, setManuProdId] = useState();
  const [no_products, setNoProducts] = useState();
  const [pdf_status, setPdfStatus] = useState(false);
  const [req_status, setReqStatus] = useState();
  const [req_staff, setReqStaff] = useState();
  const [submit_status, setSubmitStatus] = useState("Create");
  const [req_no, setReqNo] = useState();
  const [product_name, setProductName] = useState();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [all_cost, setAllCost] = useState(0);
  const [all_cost_edit, setAllCostEdit] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [selected_product, setProduct] = useState();
  const [bill_of_material, setBill] = useState(selected_recipe_id);
  const [bill_of_material_edit, setBillEdit] = useState();
  const [quantity_to_manufacture, setQtyManufacture] = useState("");
  const [quantity_to_manufacture_edit, setQtyManufactureEdit] = useState();
  const [selected_product_edit, setProductEdit] = useState();

  const [product_components, setProductComponents] = useState([]);
  const [product_reqs,setProductReqs]  =useState([]);
  const [product_components_edit, setProductComponentsEdit] = useState([]);
  const [receival_products, setReceivalProducts] = useState([]);
  //  const [edit_components, setEditComponents] = useState([]);
  const components = useSelector((state) => state.products.existingComponents);

  const product = useSelector((state) => state.requisition.manu_products);

  const router = useRouter();


  const recipes = useSelector((state) => state.products.recipes);

  // function downloadPDF() {
  //   if (!session || status !== "authenticated") {
  //     return;
  //   }

  //   const params = {};
  //   params["accessToken"] = session.user.accessToken;

  //   params["req_id"] = req_id;
  //   //alert(req_id);
  //   store.dispatch(getReqProductsPDF(params));
  // }

  useEffect(() => {
    if (!session || status !== "authenticated" || !req_id || !pdf_status) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["req_id"] = req_id;
    //alert(req_id);
    store.dispatch(getReqProductsPDF(params));
    setPdfStatus(false);
  }, [pdf_status, req_id, session, status]);

  function downloadPDFProducts() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["filter"] = searchTerm;
    store.dispatch(getAllReqProductsPDF(params));
  }

  const addReqComponents = (e) => {

    let new_data = [];
    e.map((item) => {
      new_data.push({
        name: item.sellables.sellable.name,
        qty_req: item.quantity_requested,
        total_cost: item.total_cost,
        status: item.status,
        sellable_id: item?.sellables?.id,
        is_received: item?.is_received,
      });
    });

    setReqComponents(new_data);
  };

  const addEditReqComponents = (e, y) => {

    let new_data = [];
    let all_cost = 0;
    e.map((item) => {

      new_data.push({
        id: manu_prod_id,
        name: item?.sellables?.sellable?.name ?? "",
        qty_per_item:
          y?.find(
            (it) => it?.component_sellable_id === item?.component_sellable_id
          ).total_quantity_deducted ?? 0,
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
      all_cost = parseValidFloat(item?.total_cost) + parseValidFloat(all_cost);
    });
    setAllCostEdit(all_cost);
    setProductComponentsEdit(new_data);
    setActiveTab("edit");
  };
  const requistionList = useSelector(
    (state) => state.requisition.requistionList
  );

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


  const recipesData =
    recipes?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

  let requisition_actions = [
    { label: "Internal Picking", value: "Internal" },
    { label: "Purchase Order", value: "Purchase" },
  ];

  useEffect(() => {
    if (!session || status !== "authenticated" || !branch_id) {
      return;
    }



    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["fetch_all"] = true;
    params["lean"] = true;


    store.dispatch(fetchStaff(params));

    store.dispatch(fetchManuProducts(params));

  }, [session, status, branch_id]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;

    params["startDate"] = startDate;

    params["endDate"] = endDate;
    params["filter"] = searchTerm;
    if (select_staff) {
      params["select_staff"] = select_staff;
    }

    store.dispatch(fetchRequisitionList(params));
  }, [session, status, startDate, endDate, searchTerm, select_staff]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["page"] = page;

    store.dispatch(fetchRequisitionList(params));
  }

  async function confirm() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["req_id"] = req_id;

    setIsSubmitting(true);
    try {
      await store.dispatch(confirmRequest(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "Product Requistion Confirmed",
        color: "green",
        autoClose: true,
      });
      setIsSubmitting(false);
      setProductComponents([]);
      setActiveTab("requisition-list");
      store.dispatch(fetchRequisitionList(params));
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

  async function receive() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["req_id"] = req_id;
    params["receival_comments"] = receival_comments;
    params["req_components"] = req_components;

    setIsSubmitting(true);
    try {
      await store.dispatch(receiveRequest(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "Product Requistion Received",
        color: "green",
        autoClose: true,
      });
      setReqComponents([]);
      setSubmitStatus("Create");
      setReceivalComments("");
      setActiveTab("requisition-list");
      store.dispatch(fetchRequisitionList(params));
      setIsSubmitting(false);
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

  // const fetchComponents = asyn () => {}

  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !selected_product || !bill_of_material) {
      return;
    }

    const params = {};
    params["productId"] = selected_product;

    params["accessToken"] = accessToken;

   // console.log("The bill is " + bill_of_material);
    if (bill_of_material && selected_product) {
      params["recipe_id"] = bill_of_material;
      store.dispatch(fetchExistingComponent(params));
    }



  }, [selected_product, bill_of_material, accessToken, status]);




  useEffect(() => {
    if (!accessToken || status !== "authenticated" || !selected_product) {

      return;
    }

    const params = {};
    params["productId"] = selected_product;
    params["accessToken"] = accessToken;
    if (selected_product) {
       store.dispatch(fetchExistingRecipes(params));
      //console.log("the product id is " + selected_product);
    }

  }, [selected_product, accessToken, status]);


  function clearReqForm()
  {
    setQtyManufacture("");
    setProduct("");
    setBill("");
    setStaffId("");
  }


  const addRecipeComponents = () => {
    let data = [];
    let data_two = [...product_reqs];
    if(data_two.some((el)=> el.id === selected_product))
        {
          alert("Product Already Added");
          clearReqForm();
          return;
        }


    if (components?.data.length > 0) {
      // data[index]["quantity_req"] = quantity_to_manufacture * data[index]["qty_per_item"];
      //     data[index]["total_cost"] = parseInt(data[index]["quantity_req"] * data[index]["cost"]);
      //     data[index]["no_manu"] = parseInt(quantity_to_manufacture);
      if(data.some((el)=> el.id === selected_product))
        {
          alert("Product Already Added");
          clearReqForm();
          return;
        }
        let product_total = 0;
      components?.data?.map((item) => {
        let total_req_qty = parseValidFloat(item?.product_components[0]?.total_quantity_deducted) * parseValidFloat(quantity_to_manufacture);
        let bp = parseValidFloat(item?.sellable?.buying_price);
        let total_req_cost = total_req_qty * bp;
        product_total =parseValidFloat(total_req_cost) + parseValidFloat(product_total);
        data.push({
          id: selected_product,
          staff_id:staff_id,
          reciped_id:bill_of_material,
          name: item?.sellable?.name,
          qty_per_item: item?.product_components[0]?.total_quantity_deducted,
          quantity_req:total_req_qty.toFixed(2) ,
          total_cost: total_req_cost.toFixed(2) ,
          product_sellable_id: item?.product_components[0]?.product_sellable_id,
          component_sellable_id:
            item?.product_components[0]?.component_sellable_id,
          cost: item?.sellable?.buying_price ?? 0,
          no_manu: "",
          action: "",
        });

      });
      data_two.push({id:selected_product,
        name:product?.find((it)=>  it?.id === selected_product)?.name ?? "-",
        raw_mat_total_cost:data?.reduce(
          (sum, y) => sum + parseValidFloat(y?.total_cost),
          0
        ) ?? 0,
        staff_id:staff_id,
        staff_name:staffList?.find((x)=>x?.id === staff_id)?.name,
        quantity_to_manufacture:quantity_to_manufacture,
        recipe_id:bill_of_material,product_components:data});
       console.log(data_two);
      // setProductComponents(data);
      setProductReqs(data_two);
      clearReqForm();

    }

    // console.log(data);
    // clearReqForm();
  }

  useEffect(() => {

  }, [components, selected_product]);



  let sum_cost = 0;

  const handleQuantityChange = (e, index) => {
    let data = [...product_components];

    data[index]["quantity_req"] = e;
    data[index]["no_manu"] = parseInt(e / data[index]["qty_per_item"]);
    data[index]["total_cost"] = parseInt(e * data[index]["cost"]);
    setProductComponents(data);
  };

  // useEffect(() => {
  //   if (!quantity_to_manufacture || !product_components) {
  //     return;
  //   }
  //   let data = [...product_components];
  //   data?.map((item, index) => {
  //     data[index]["quantity_req"] = quantity_to_manufacture * data[index]["qty_per_item"];
  //     data[index]["total_cost"] = parseInt(data[index]["quantity_req"] * data[index]["cost"]);
  //     data[index]["no_manu"] = parseInt(quantity_to_manufacture);

  //   })
  //   setProductComponents(data);
  // }, [quantity_to_manufacture, product_components])


  const handleQuantityChangeEdit = (e, index) => {
    let data = [...product_components_edit];
    data[index]["quantity_req"] = e;
    data[index]["no_manu"] = parseInt(e / data[index]["qty_per_item"]);
    data[index]["total_cost"] = parseInt(e * data[index]["cost"]);
    setProductComponentsEdit(data);
  };

//   setProduct(prevCat => ({
//     ...prevCat,
//     owner: {
//         ...prevCat.owner,
//         name: "Daniel the owner of Achilles"
//     }
// }))



  const updateCheckbox = (index, e, sellable_id) => {
    let value = e.target.checked;
    let data = [...req_components];
    data[index]["is_received"] = value ? 1 : 0;
    setReqComponents(data);
    // console.dir(req_components);
  };

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {

        return;
    }

    const params = {};

    params["accessToken"] = accessToken;
    store.dispatch(getBookingsSelect(params));
}, [accessToken,status]);


  useEffect(() => {
    setAllCost(
      product_components?.reduce(
        (sum, item) => sum + parseValidFloat(item?.total_cost),
        0
      ) ?? 0
    );
  }, [product_components]);

  useEffect(() => {
    setAllCost(
      product_components_edit?.reduce(
        (sum, item) => sum + parseValidFloat(item?.total_cost),
        0
      ) ?? 0
    );
  }, [product_components_edit]);



  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }



    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["product_reqs"] = product_reqs;
    params["req_comments"] = req_comments;
    params["requisition_date"] = requisition_date;
    params["all_cost"] = all_cost;

    setIsSubmitting(true);
    try {
      await store.dispatch(submitRequisition(params)).unwrap();
      showNotification({
        position: "top-right",
        title: "SUCCESS",
        message: "Stock Requisition Successfully Created",
        color: "green",
        autoClose: true,
      });

      setProductReqs([])

     clearReqForm()
      setIsSubmitting(false);
      store.dispatch(fetchRequisitionList(params));
      setActiveTab("requisition-list");
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

  const handleRequisition = () => {
    router.push(`/merchants/inventory/manufacturings`);
  }
  const jobCards = () => {
    router.push(`/merchants/inventory/jobs`);
  }

  const handleJobCard = () => {

    let req_pars = { req_id: req_id };

    let index_pars = { product_id: manu_prod_id };
    store.dispatch(setManufacturedProduct(index_pars));
    store.dispatch(setRequisition(req_pars));

    router.push(`/merchants/inventory/jobs/new-job`);
  }


  async function submitEditDetails() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["staff_id"] = staff_id_edit;
    params["product_components"] = product_components_edit;
    params["req_comments"] = req_comments_edit;
    params["requisition_date"] = requisition_date_edit;
    params["productId"] = selected_product_edit ?? manu_prod_id;
    params["all_cost_edit"] = all_cost_edit;
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

      setProductComponents([]);

      setIsSubmitting(false);
      setReqComments("");
      setReqDate("");
      setStaffId("");
      setProduct("");
      setSubmitStatus("Create");
      setIsSubmitting(false);
      store.dispatch(fetchRequisitionList(params));
      setActiveTab("requisition-list");
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

  const handleAction = (e, index,ind) => {
    let data = [...product_reqs];
  data[index]["product_components"][ind]["action"] = e;
    setProductReqs(data);
    console.log(data);
  }

  const removeComponent = (index,ind) => {
    let data = [...product_reqs];
    let data_t = data[index]["product_components"];
    data_t.splice(ind, 1);
    setProductReqs(data);
  };

  const removeProductReq = (index) => {
    let data = [...product_reqs];
    data.splice(index, 1);
    setProductReqs(data);
  };

  const actions = (
    <Fragment>

    </Fragment>
  );

  const actionsthree = (
    <Fragment>
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
      <Button
        className="mr-2 mt-5"
        leftIcon={<IconDownload size={16} />}
        variant="outline"
        // loading={isReceiptLoading}
        onClick={downloadPDFProducts}
      >
        EXPORT PDF
      </Button>
    </Fragment>
  );

  return (
    <section className="space-y-2 w-full">
      <div className="w-full flex flex-wrap mt-2">
        <Tabs color="teal">
          <Tabs.List>
            <Tabs.Tab value="create" onClick={() => handleRequisition()} >
              Raw Materials
            </Tabs.Tab>
            <Tabs.Tab value="stock-movements" color="blue">
              Stock Requisition
            </Tabs.Tab>


            <Tabs.Tab value="requisition-list" color="blue" onClick={()=>{handleJobCard()}}>
              Job Card
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="create" pt="xs">

          </Tabs.Panel>



          <Tabs.Panel value="requisition-list" pt="xs">

          </Tabs.Panel>

          <Tabs.Panel value="view-transfer-items" pt="xs">

          </Tabs.Panel>
        </Tabs>
      </div>
      <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          {can_create_req && (
            <Tabs.Tab value="create" onClick={() => {
              setReqComments("");
              setReqDate("");
              setStaffId("");
              setSubmitStatus("");
              setProductComponents([]);
            }}>
              Create
            </Tabs.Tab>
          )}
          {/* <Tabs.Tab value="stock-movements" color="blue">
              Stock Movements
            </Tabs.Tab> */}
             {can_view_req && (
          <Tabs.Tab value="requisition-list" onClick={() => {
            setReqComments("");
            setReqDate("");
            setStaffId("");

            setSubmitStatus("");
            setProductComponents([]);
          }} color="blue">
            Requisition List
          </Tabs.Tab>
             )}
        </Tabs.List>

        <Tabs.Panel value="create" pt="xs">
          <div className="min-h-96 h-fit w-100 mx-6 mb-10">
            <div className="h-full w-full bg-white rounded-xl px-4 py-4 flex flex-col">
              <Table>
                <thead className="bg-gray-100">
                  <Trow>
                    <>
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
                          defaultValue={selected_product}
                          data={productsData}
                          onChange={(e) => {
                            setProduct(e);

                          }}
                          searchable
                          clearable
                          required
                        />
                      </th>
                      <th scope="col" className="th-primary">

                      </th>
                    </>

                  </Trow>
                </thead>
                <tbody>
                  {selected_product && (
                    <Trow>
                      <>
                        <th scope="col" className="th-primary">

                          <Select
                            label="Select Bill Of Material"
                            value={bill_of_material}
                            placeholder="Bill Of Material"
                            data={recipesData}
                            onChange={(e) => {
                              setBill(e);
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

                          />
                        </th>
                        <th><Button onClick={()=>addRecipeComponents()}>Add</Button></th>
                      </>
                    </Trow>
                  )}
                </tbody>
              </Table>
              <Table>
                {product_components && product_components?.length > 0 && (
                  <Thead>
                    <Trow>
                      <>
                      <th></th>
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
                        {/* <th scope="col" className="th-primary text-darkest">
                          Quantity To Manufacture
                        </th> */}
                        <th scope="col" className="th-primary text-darkest">
                          Requisition Action
                        </th>
                      </>
                    </Trow>
                  </Thead>
                )}
                <tbody>
                  {product_reqs && product_reqs?.length > 0 &&
                    product_reqs?.map((item, index) => (
                      <Trow className="border-b" key={index}>
                        <td> <i
                            onClick={() => removeProductReq(index)}
                            className="text-red-800 font-bold px-2 cursor-pointer mt-4"
                          >
                            X
                          </i></td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <p>{item?.name }</p>
                          <p>Total  Kshs: {formatNumber(item?.raw_mat_total_cost)}</p>
                          <p>Staff: {item?.staff_name}</p>
                          <p>Quantity To Manufacture: {formatNumber(item?.quantity_to_manufacture)}</p>
                        </td>
                        <td>
                          <Table>
                          {item?.product_components && item?.product_components?.length > 0 && (
                  <Thead>
                    <Trow>
                      <>

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
                        {/* <th scope="col" className="th-primary text-darkest">
                          Quantity To Manufacture
                        </th> */}
                        <th scope="col" className="th-primary text-darkest">
                          Requisition Action
                        </th>
                      </>
                    </Trow>
                  </Thead>
                )}
                <tbody>
                          {item?.product_components.map((it, ind) => (
                          <Trow className="border-b" key={ind}>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {it?.name }

                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {it?.cost}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {it?.qty_per_item || ""}


                        </td>

                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                         {it?.quantity_req}

                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {it?.total_cost}

                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <Select
                            data={requisition_actions}
                            searchable
                            clearable
                            onChange={(e) => handleAction(e, index,ind)}

                          />
                        </td>
                        {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.product_components[0]?.final_cost}
                            </td> */}

                        <td className="py-3 px-6 text-sm whitespace-nowrap text-right gap-2 flex">
                          <i
                            onClick={() => removeComponent(index,ind)}
                            className="text-red-800 font-bold px-2 cursor-pointer mt-4"
                          >
                            X
                          </i>
                        </td>
                        </Trow>
                          ))}
                           <tfoot>

                    <Trow>
                      <td colSpan={4} className="text-lg font-bold">
                      Total : Kshs {formatNumber(item?.raw_mat_total_cost) }
                      </td>
                    </Trow>


                </tfoot>
                </tbody>
                          </Table>
                        </td>

                        {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <TextInput
                            className="w-full sm:w-auto"
                            defaultValue={item?.no_manu}

                            readOnly
                          />
                        </td> */}

                      </Trow>
                    ))}
                </tbody>
                <tfoot>
                  {product_reqs && product_reqs?.length > 0 && (
                    <Trow>
                      <td colSpan={4} className="text-lg font-bold">
                        Total Cost : Kshs {formatNumber(product_reqs?.reduce(
          (sum, y) => sum + parseValidFloat(y?.raw_mat_total_cost),
          0
        ) ?? 0)}
                      </td>
                    </Trow>
                  )}
                </tfoot>
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


                <DatePicker
                  onChange={(e) => setReqDate(e)}
                  value={requisition_date}
                  label="Date Requested"
                  defaultValue={new Date()}
                />
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
                    disabled={isSubmitting ? true : false}
                    type="submit"
                    size="md"
                    onClick={submitDetails}
                  >
                    {!isSubmitting && <b> CREATE REQUEST</b>}
                    {isSubmitting && <b>CREATING......</b>}
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </Tabs.Panel>



        <Tabs.Panel value="requisition-list" pt="xs">
          <div className="min-h-96 h-fit w-100 mx-6 mb-10">
            <div className="h-full w-full bg-white rounded-xl px-4 py-4 flex flex-col">
              <div
                className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}
              >
                <h2 className="text-md text-darkest font-bold" id="titems">
                  Requisition List
                </h2>
              </div>
              <div className="flex justify-end">
                <div></div>
                {isMerchant(session?.user) && (
                  <Select
                    className=""
                    placeholder="Select Staff"
                    data={staffsData}
                    onChange={(e) => setSelectStaff(e)}
                    searchable
                    clearable
                  />
                )}
              </div>
              <TableCardHeader actions={actionsthree}>
                <TDateFilter
                  startDate={startDate}
                  endDate={endDate}
                  onChangeStartDate={setStartDate}
                  onChangeEndDate={setEndDate}
                />
              </TableCardHeader>
              <Table>
                <Thead className="bg-gray-100">
                  <Trow>

                    <td className="py-3 px-6 text-sm whitespace-nowrap">ID</td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      Requisition No
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      Manufactured Product
                    </td>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      No Of Raw Materials
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Bill Of Material
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Total Cost
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Employee
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Date Requested
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Date Recieved
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Request Comments
                    </th>

                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Receival Comments
                    </th>

                    <th
                      scope="col"
                      className="th-primary text-darkest font-bold"
                    >
                      Action
                    </th>
                  </Trow>
                </Thead>
                <tbody>
                  {requistionList &&
                    requistionList?.data?.map((item) => (
                      <Trow key={item.id}>

                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.requistion_no ?? "-"}
                        </td>

                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.sellables?.sellable?.name ?? "-"}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.no_products ?? "-"}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.recipes?.name ?? "-"}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          Kshs {formatNumber(item?.total_cost)}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.staff?.name ?? "-"}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.date_requested
                            ? formatDate(item?.date_requested)
                            : "-"}
                        </td>
                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.date_received
                            ? formatDate(item?.date_received)
                            : "-"}
                        </td>
                        <td
                          className="py-3 px-6 text-sm whitespace-nowrap"

                        >
                          {item?.status ?? "-"}
                        </td>

                        <td
                          className="py-3 px-6 text-sm whitespace-nowrap"

                        >
                          {item?.request_comments}
                        </td>

                        <td className="py-3 px-6 text-sm whitespace-nowrap">
                          {item?.receival_comments}
                        </td>
                        <td className="py-0 pl-14 2xl:pl-4">
                          <span className="flex justify-end items-center w-full gap-2">
                            <Menu
                              shadow="md"
                              width={200}
                              position="bottom-end"
                              variant="outline"
                            >
                              <Menu.Target>
                                <Button
                                  rightIcon={<IconChevronDown size={12} />}
                                >
                                  Actions
                                </Button>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Label>#</Menu.Label>

                                <Fragment>
                                  <Menu.Item
                                    icon={<IconPrinter size={15} />}
                                    onClick={() => {
                                      setReqId(item.id);
                                      setPdfStatus(true);
                                    }}
                                  >
                                    PDF
                                  </Menu.Item>

                                  <Menu.Item
                                    icon={<IconListDetails size={15} />}
                                    onClick={() => {
                                      setReqComponents([]);
                                      setReqId("");
                                      setReqStatus("");
                                      setReqStaff("");
                                      setReqNo("");
                                      setProductName("");
                                      setManuProdId("");
                                      setActiveTab("view-transfer-items");
                                      addReqComponents(
                                        item?.requisition_products
                                      );
                                      setReqId(item?.id);
                                      setNoProducts(item?.no_products);
                                      setManuProdId(
                                        item?.sellables?.sellable?.id
                                      );
                                      setReqNo(item?.requistion_no);
                                      setProductName(
                                        item?.sellables?.sellable?.name
                                      );
                                      setReqStatus(item?.status);
                                      setReqStaff(item?.staff?.name);
                                    }}
                                  >
                                    View
                                  </Menu.Item>

                                </Fragment>
                              </Menu.Dropdown>
                            </Menu>
                            {/* <Button

                              size="md"
                              onClick={() => handleJobCard(item?.sellables?.sellable?.id, item?.id)}
                            >
                              Job Card

                            </Button> */}
                               {/* <Link
                            href={`/merchants/inventory/jobs/new-job`}
                          >
                                                    <Button

                                                        size="md"
                                                    >
                                                         Job Card

                                                    </Button>
                                                    </Link> */}
                            <EditReqModal item={item} productId={item?.sellables?.sellable?.id} recipeId={item?.recipes?.id} />
                            <AddJobCardService item={item} />
                            <RemoveReqModal item={item} />
                          </span>

                        </td>

                      </Trow>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="view-transfer-items" pt="xs">
          <div className="min-h-96 h-fit w-100 mx-6 mb-10">
            <div className="h-full w-full bg-white rounded-xl px-4 py-4 flex flex-col">
              <div className="flex justify-items-center">

                <label className="text-darkest">
                  Requisition NO : {req_no}
                </label>
                <label
                  scope="col"
                  className="th-primary text-darkest font-bold"
                >
                  Manufactured Product : {product_name}
                </label>
                <label
                  scope="col"
                  className="th-primary text-darkest font-bold"
                >
                  Staff : {req_staff}
                </label>

              </div>
              <Table>
                {req_components?.length > 0 && (
                  <Thead>
                    <Trow>
                      <>
                        <th
                          scope="col"
                          className="th-primary text-darkest font-bold"
                        >
                          Product
                        </th>

                        <th
                          scope="col"
                          className="th-primary text-darkest font-bold"
                        >
                          Quantity Requested
                        </th>

                        <th
                          scope="col"
                          className="th-primary text-darkest font-bold"
                        >
                          Total Cost
                        </th>
                        <th
                          scope="col"
                          className="th-primary text-darkest font-bold"
                        >
                          Status
                        </th>
                        {!isMerchant(session?.user) && (
                          <th
                            scope="col"
                            className="th-primary text-darkest font-bold"
                          >
                            Check Products To Receive
                          </th>
                        )}
                      </>
                    </Trow>
                  </Thead>
                )}
                <tbody>
                  {req_components?.map((it, index) => (
                    <Trow className="border-b" key={index}>
                      <>
                        <td className="text-sm whitespace-nowrap">{it.name}</td>
                        <td className="text-sm whitespace-nowrap">
                          {it.qty_req}
                        </td>
                        <td className="text-sm whitespace-nowrap">
                          {it.total_cost}
                        </td>
                        <td className="text-sm whitespace-nowrap">{it.status}</td>
                        {/* {!isMerchant(session?.user) && ( */}
                          <td className="text-sm whitespace-nowrap">
                            <Checkbox key={it.id}
                              onChange={(e) => updateCheckbox(index, e, it.sellable_id)}
                              checked={
                                it?.is_received == 0 || it?.is_received == null
                                  ? false
                                  : true
                              }
                              size="lg"
                            />
                          </td>
                        {/* )} */}
                      </>
                    </Trow>
                  ))}
                </tbody>
              </Table>
              {req_components?.length > 0 && (
                <div>
                  {/* {!isMerchant(session?.user) && ( */}
                    <div className="flex">
                      <div className="grow">
                        <Textarea
                          label="Comments"
                          autosize
                          minRows={2}
                          maxRows={4}
                          onChange={(e) => setReceivalComments(e.currentTarget.value)}
                          value={receival_comments}
                        />
                      </div>
                    </div>
                  {/* )} */}
                  <div className="flex items-end space-x-7 space-y-4">

                      {isMerchant(session?.user) || can_confirm_req ? (
                       <div className="flex space-x-2">
                         <Button
                          disabled={req_status === "Requested" ? false : true}
                          //  type="submit"
                          size="md"
                          onClick={confirm}

                        >

                          CONFIRM
                        </Button>

                        <Button
                        disabled={req_status === "Confirmed" || req_status === "Partially Received" || req_status === "Received" ? false : true}
                        //  type="submit"
                        size="md"
                        onClick={receive}


                      >

                        RECEIVE
                      </Button>

                       </div>



                      ) : ( can_receive_req && (
                        <Button
                        disabled={req_status === "Confirmed" || req_status === "Partially Received" || req_status === "Received"  ? false : true}
                        //  type="submit"
                        size="md"
                        onClick={receive}


                      >

                        RECEIVE
                      </Button>

                      )

                      )}
                                      <Tooltip label="Materials In This Requisition Will Be  Linked To The Jobs Done">

                       <Button
                         className="mr-2"
                         leftIcon={<IconNewSection size={16} />}
                         variant="outline"
                         // loading={isReceiptLoading}
                         disabled={req_status === "Received"  ? false : true}


                         onClick={()=>{handleJobCard()}}
                       >
                         START JOB
                       </Button>
                       </Tooltip>

                  </div>

                  <div className="flex md:flex md:flex-grow flex-row justify-end space-x-1">


                    <Button
                      className="mr-2"
                      leftIcon={<IconDownload size={16} />}
                      variant="outline"
                      // loading={isReceiptLoading}

                      onClick={() => {
                        setPdfStatus(true);
                      }}
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </section>
  );
}

export default RequisitionListView;
