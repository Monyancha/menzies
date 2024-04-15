import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@/components/ui/layouts/card";
import {
  Table,
  Thead,
  TSearchFilter,
  TDateFilter,
  Trow,
} from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconPlus, IconDownload } from "@tabler/icons";
import { TextInput, Textarea, Button, Tabs, Select, Menu } from "@mantine/core";
import {
  fetchJobTasks,
  setJobCardId,
  getSingleJobCardsPDF,
  clearOrderTransId,
} from "@/store/merchants/inventory/job-slice";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidFloat,
} from "@/lib/shared/data-formatters";
import store from "@/store/store";
import LinkButton from "@/components/ui/actions/link-button";
import { getBookingsSelect } from "@/store/merchants/bookings/bookings-slice";
import ManufactureProduct from "../manufacture-product-modal";
function JobsTabularView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const fetchJobTasksStatus = useSelector(
    (state) => state.job.fetchJobTasksStatus
  );
  const router = useRouter();

  const dispatch = useDispatch();

  const [selectedStaffs, setSelectedClients] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const isLoadingList = fetchJobTasksStatus === "loading";

  const taskList = useSelector((state) => state.job.taskList);

  const job_card = useSelector((state) => state.job.job_card);

  const jobList = useSelector((state) => state.job.jobList);

  const [searchTerm, setSearchTerm] = useState("");
  const [staff_id, setStaffId] = useState();

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = accessToken;

    store.dispatch(getBookingsSelect(params));
    store.dispatch(clearOrderTransId());
  }, [accessToken, status]);

  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    // params["detailed"] = true;
    // params["branch_id"] = session.user.branch;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    params["startDate"] = startDate;

    params["endDate"] = endDate;

    if (selectedStaffs) {
      params["selected_staff"] = selectedStaffs;
    }

    if (job_card) {
      params["job_card_id"] = job_card?.id;
    }

    store.dispatch(fetchJobTasks(params));
  }, [searchTerm,accessToken,status,selectedStaffs,endDate,startDate,job_card]);



  let total_job_card_cost =
    taskList?.data?.reduce(
      (sum, item) => sum + parseValidFloat(item?.cost),
      0
    ) ?? 0;

   let raw_materials_cost =  taskList?.data?.reduce(
      (sum, item) =>
        sum + parseValidFloat(item?.requisition?.total_cost),
      0
    ) ?? 0;

  function downloadPDFCards() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    params["startDate"] = startDate;

    params["endDate"] = endDate;

    if (selectedStaffs) {
      params["selected_client"] = selectedStaffs;
    }
    if (job_card) {
      params["job_card_id"] = job_card?.id;
    }
    store.dispatch(getSingleJobCardsPDF(params));
  }

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(fetchJobTasks(params));
  }

  const bookingsSelect = useSelector(
    (state) => state.bookings.getBookingsSelect
  );

  const staffList = bookingsSelect?.staff;

  const staffs =
    staffList?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const actions = (
    <Fragment>
      <div className="space-x-1">
  { job_card?.requisition?.recipe_id && (
     <ManufactureProduct
     RecipeId={job_card?.requisition.recipe_id}
     total_cost={parseValidFloat(total_job_card_cost) + parseValidFloat(job_card?.requisition?.total_cost)}
     max_qty = {job_card.requisition.quantity_to_manufacture}
       ProductId={job_card.product_id}
       product_cost={(parseValidFloat(total_job_card_cost) + parseValidFloat(job_card?.requisition?.total_cost))/job_card.requisition.quantity_to_manufacture}
      />
  )}

        <Button
          className=""
          leftIcon={<IconDownload size={16} />}
          variant="outline"
          // loading={isReceiptLoading}
          onClick={downloadPDFCards}
        >
          EXPORT PDF
        </Button>

      </div>
    </Fragment>
  );

  return (
    <section className="space-y-2 w-full">
      <Card>
        <div className="flex space-x-4">
          <TSearchFilter onChangeSearchTerm={setSearchTerm} />

          <Select
            label="Staff"
            placeholder="Select Staff"
            searchable
            nothingFound="No options"
            value={selectedStaffs}
            data={staffs}
            onChange={(value) => setSelectedClients(value)}
            clearable
          />


        </div>

        <TableCardHeader actions={actions}>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                Current Stage
              </th>
              <th scope="col" className="th-primary">
                Cost
              </th>
              {/* <th scope="col" className="th-primary">
                Raw Materials
              </th> */}

              <th scope="col" className="th-primary">
                Start Date
              </th>
              <th scope="col" className="th-primary">
                End Date
              </th>


              <th scope="col" className="th-primary">
                Staffs
              </th>

              <th scope="col" className="th-primary">
                Created On
              </th>

              {/* <th scope="col" className="th-primary">
                Action</th> */}
            </tr>
          </Thead>
          <tbody>
            {taskList &&
              taskList?.data?.map((item) => (

                <Trow key={item.id}>
                  <td>{item?.id}</td>
                  <td>{item?.name}</td>
                  <td>{item?.stages?.name ?? "-"}</td>
                  <td>{item?.cost}</td>

                  <td>{formatDate(item.start_date)}</td>
                  <td>{formatDate(item.end_date)}</td>
                  <td>{item?.staff_tasks?.map((it,index)=>(
                      <p key={index}> {it?.staffs?.name}</p>
                  ))}</td>




                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>
                  {/* <td>
                    <td className="py-0 pl-14 2xl:pl-4">
                      <span className="flex justify-end items-center w-full gap-2">

                        <Button onClick={()=>setJobCard(item?.id)}>
                          PDF
                        </Button>
                      </span>
                    </td>
                  </td> */}
                </Trow>
              ))}
          </tbody>
          <tfoot>
          <tr className="bg-white border-b text-sm">
                          <th
                            scope="row"
                            colSpan="2"
                            className="text-primary font-bold"
                          >
                            TOTAL TASKS/LABOUR COST
                          </th>
                          <td  colSpan="3" className="text-dark tracking-wider text-xl font-bold">
                            Kshs { formatNumber(parseValidFloat(total_job_card_cost))}
                          </td>
                        </tr>

                        <tr className="bg-white border-b text-sm">
                          <th
                            scope="row"
                            colSpan="2"
                            className="text-primary font-bold"
                          >
                            RAW MATERIALS COST
                          </th>
                          <td  colSpan="3" className="text-dark tracking-wider text-xl font-bold">
                            Kshs { formatNumber( parseValidFloat(job_card?.requisition?.total_cost))}
                          </td>
                        </tr>

                        <tr className="bg-white border-b text-sm">
                          <th
                            scope="row"
                            colSpan="2"
                            className="text-primary font-bold"
                          >
                            TOTAL PRODUCT MANUFACTURING COST
                          </th>
                          <td  colSpan="3" className="text-dark tracking-wider text-xl font-bold">
                            Kshs { formatNumber( parseValidFloat(job_card?.requisition?.total_cost) + parseValidFloat(total_job_card_cost))}
                          </td>
                        </tr>
          </tfoot>
        </Table>

        {isLoadingList && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={taskList}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
      {/* <Card>
      <Table>
                {req_components?.length > 0 && (
                  <thead className="">
                    <tr>
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
                    </tr>
                  </thead>
                )}
                <tbody>
                  {job_card?.requisition?.requisition_products?.map((it, index) => (
                    <tr className="border-b" key={index}>
                      <td className="text-sm whitespace-nowrap">{it.name}</td>
                      <td className="text-sm whitespace-nowrap">
                        {it.qty_req}
                      </td>
                      <td className="text-sm whitespace-nowrap">
                        {it.total_cost}
                      </td>
                      <td className="text-sm whitespace-nowrap">{it.status}</td>
                      {!isMerchant(session?.user) && (
                        <td className="text-sm whitespace-nowrap">
                          <Checkbox
                            key={it.id}
                            onChange={(e) => updateCheckbox(index, e, it.sellable_id)}
                            checked={
                              it?.is_received == 0 || it?.is_received == null
                                ? false
                                : true
                            }
                            size="lg"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                  {req_components?.length < 1 && (
                    <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                      <p className="text-darkest text-center">
                        No Products Under This Requisition Line
                      </p>
                    </div>
                  )}
                </tbody>
              </Table>

      </Card> */}

    </section>


  );
}

export default JobsTabularView;
