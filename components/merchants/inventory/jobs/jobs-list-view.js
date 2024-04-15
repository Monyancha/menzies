import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
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
  fetchJobsList,
  setJobCardId,
  getJobCardsPDF,
} from "@/store/merchants/inventory/job-slice";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import {
  formatDate,
  formatNumber,
  getDateFilterFrom,
  getDateFilterTo,
  parseValidInt,
} from "@/lib/shared/data-formatters";
import store from "@/store/store";
import LinkButton from "@/components/ui/actions/link-button";
import { getBookingsSelect } from "@/store/merchants/bookings/bookings-slice";
import RemoveJobModal from "./remove-job-modal";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
function JobsListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const jobListStatus = useSelector((state) => state.job.fetchJobsListStatus);
  const router = useRouter();

  const [selectedClients, setSelectedClients] = useState("");

  const [selected_status, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const isLoadingList = jobListStatus === "loading";

  const jobList = useSelector((state) => state.job.jobList);
  const [searchTerm, setSearchTerm] = useState("");
  const can_delete_job = useSelector(hasBeenGranted("can_delete_job"));
  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(getBookingsSelect(params));
  }, [session, status, branch_id]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    // params["detailed"] = true;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    params["startDate"] = startDate;

    params["endDate"] = endDate;

    if (selectedClients) {
      params["selected_client"] = selectedClients;
    }

    if (selected_status) {
      params["status"] = selected_status;
      //  alert(params[status]);
    }

    store.dispatch(fetchJobsList(params));
  }, [
    session,
    status,
    selectedClients,
    searchTerm,
    endDate,
    startDate,
    selected_status,
    branch_id,
  ]);

  const setJobCard = (id) => {
    let job_pars = { job_card: id };
    store.dispatch(setJobCardId(job_pars));
    console.log(id);
    if (id) {
      router.push("/merchants/inventory/jobs/drag");
    }
  };

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

    if (selectedClients) {
      params["selected_client"] = selectedClients;
    }
    store.dispatch(getJobCardsPDF(params));
  }

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(fetchJobsList(params));
  }

  const bookingsSelect = useSelector(
    (state) => state.bookings.getBookingsSelect
  );

  const clientList = bookingsSelect?.clients;

  const clients =
    clientList?.map((item) => ({
      value: item.id,
      label: item.name + " | " + item?.phone ?? "Add Phone",
    })) ?? [];

  const statuses = [
    { label: "Completed", value: "Completed" },
    { label: "InComplete", value: "Incomplete" },
  ];

  const actions = (
    <Fragment>
      <div className="space-x-1">
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
            label="Client"
            placeholder="Select Client"
            searchable
            nothingFound="No options"
            value={selectedClients}
            data={clients}
            onChange={(value) => setSelectedClients(value)}
            clearable
          />
          <Select
            label="Status"
            placeholder="Job Card Status"
            searchable
            nothingFound="No options"
            value={selected_status}
            data={statuses}
            onChange={(value) => setSelectedStatus(value)}
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
                NAME/Title
              </th>

              <th scope="col" className="th-primary">
                Start Date
              </th>
              <th scope="col" className="th-primary">
                End Date
              </th>
              <th scope="col" className="th-primary">
                Status
              </th>
              <th scope="col" className="th-primary">
                Product
              </th>
              <th scope="col" className="th-primary" >Job Card Cost/Labour Cost</th>

              <th scope="col" className="th-primary" >Raw Materials</th>
              <th scope="col" className="th-primary" >Total Job Card Cost</th>
              <th scope="col" className="th-primary">
                Client
              </th>
              <th scope="col" className="th-primary">
                Description
              </th>
              <th scope="col" className="th-primary">
                Date Added
              </th>
              <th scope="col" className="th-primary">
                Action
              </th>
            </tr>
          </Thead>
          <tbody>
            {jobList &&
              jobList?.data?.map((item) => (
                <Trow key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{formatDate(item.start_date)}</td>
                  <td>{formatDate(item.end_date)}</td>
                  <td>{item?.status ?? "-"}</td>
                  <td><strong> {item?.products?.name ?? "-"}</strong></td>
                  <td>{formatNumber(item?.tasks_sum_cost ?? 0)}</td>
                  <td>
                    {item?.requisition?.requisition_products?.map((it,index) => (
                      <p key={index}>{"("+ (parseInt(index) + parseInt(1)) +")" + it?.sellables?.sellable?.name +
                       " Qty : " + it?.quantity_requested + " Total Cost : " + it?.total_cost
                      } </p>
                    ))}
                    <b>Total Cost Kshs : {formatNumber(item?.requisition?.total_cost)} </b>
                  </td>
                  <td>Kshs <strong>{formatNumber(parseInt(item?.tasks_sum_cost ?? 0) + parseInt(item?.requisition?.total_cost ?? 0))}</strong></td>
                  <td>{item?.clients?.name ?? "-"}</td>
                  <td>{item?.description ?? "-"}</td>
                  <td>{item.created_at ? formatDate(item.created_at) : "-"}</td>
                  <td>
                    <td className="py-0 pl-14 2xl:pl-4">
                      <span className="flex justify-end items-center w-full gap-2">
                        <Button onClick={() => setJobCard(item)}>Open</Button>
                        <LinkButton
                      href={`/merchants/inventory/edit-job/${item.id}`}
                    filled={true}
                    responsive={false}
                    icon="fa fa-pencil"
                  />
                        {can_delete_job && <RemoveJobModal item={item} />}
                      </span>
                      <span className="flex justify-end items-center w-full gap-2"></span>
                    </td>
                  </td>
                </Trow>
              ))}
          </tbody>
        </Table>

        {isLoadingList && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={jobList}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </section>
  );
}

export default JobsListView;
