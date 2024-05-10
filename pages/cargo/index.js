import { Box } from "@mui/material";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../components/ui/layouts/scrolling-table";
import { Badge, Button } from "@mantine/core";
import Card from "../../components/ui/layouts/card";
import TableCardHeader from "../../components/ui/layouts/table-card-header";
import { IconPlus } from "@tabler/icons-react";
import NewConsignmentModal from "../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../components/ui/layouts/pagination-links";
import { getConsignments } from "../../src/store/consignments/consignments-slice";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../src/store/Store";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../lib/shared/data-formatters";
import Link from "next/link";
import { useRouter } from "next/router";
import { getDashboard, getLists } from "../../src/store/cargo/cargo-slice";
import DashboardCard from "../../components/dashboard/dashboard-card";
import { showNotification } from "@mantine/notifications"; //Import mantine notifications
import MoreCargoModal from "../../components/cargo/more-cargo-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Cargo Status",
  },
];

export default function Cargo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { status: queryStatus } = router.query;

  //Set Pdf Loading Button Status
  const [pdfLoading, setPdfLoading] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const itemStatus = useSelector(
    (state) => state.cargo.getListsStatus
  );
  const items = useSelector((state) => state.cargo.getLists);

  const isLoading = itemStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getLists(params));
  }, [session, status, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getLists(params));
  }


  const cargoitems = items?.lists?.cargoDetails;

  //Get Dashboard Stats
  const dashboard = useSelector((state) => state.cargo.getDashboard);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    store.dispatch(getDashboard(params));
  }, [session, status, searchTerm]);

  //End Dashboard Stats


  //Download Button Usage on the frontend
  const downloadCargo = async (itemId) => {
    // Set loading state to true for the clicked item
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/cargo-pdf/${itemId}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    //Fix Naming Start Here
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw { message: "failure" };
    }

    const result = await response.blob();

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.download = "Cargo PDF"; // Set the filename for download
    a.innerHTML = "Cargo PDF";
    a.target = "_blank";
    a.click();

    console.log(response);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    }
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: false,
    }));
  };


  const actions = (
    <div className="flex flex-row items-end gap-2">
      <TSearchFilter onChangeSearchTerm={setSearchTerm} />
    </div>
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Cargo Status" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            {/* <NewConsignmentModal /> */}
            {/*<Button variant="outline" leftIcon={<IconPlus size={18} />}>New Visitor</Button>*/}
          </div>
        </header>

        <div className="w-full flex flex-wrap ">
          <div className="flex w-full items-stretch flex-wrap mb-3">
          <DashboardCard title="Total Cargo" value={dashboard?.cargo ?? 0} color="maroon" />
          <DashboardCard title="Known Cargo" value={dashboard?.known_cargo ?? 0} color="green" />
          <DashboardCard title="Uknown Cargo" value={dashboard?.unknown_cargo ?? 0} color="orange" />
          <DashboardCard title="General Cargo" value={dashboard?.general_cargo ?? 0} color="purple" />
          
        </div>
        </div>

        <div className="w-full flex flex-wrap ">
          <div className="flex w-full items-stretch flex-wrap mb-3">

          <DashboardCard title="Total AWBs" value={dashboard?.awbs ?? 0} color="red" />
          <DashboardCard title="Total ULDs" value={dashboard?.total_ulds ?? 0} color="olive" />
          <DashboardCard title="Total Check In" value={dashboard?.visits_in ?? 0} color="blue" />
          <DashboardCard title="Total Check Out" value={dashboard?.visits_out ?? 0} color="magenta" />

          </div>
        </div>

        <div className="w-full flex flex-wrap mt-2">
          <Card>
            <TableCardHeader actions={actions}>

            </TableCardHeader>

            <Table>
              <Thead>
                {/* make sure the titles are aligned well */}
                <tr>
                  <th scope="col" className="th-primary">
                    DATE
                  </th>
                  <th scope="col" className="th-primary"> 
                    SHIPPER NAME
                  </th>
                  <th scope="col" className="th-primary"> 
                    DRIVER DETAILS
                  </th>
                  <th scope="col" className="th-primary">
                    AWB
                  </th>
                  <th scope="col" className="th-primary">
                    DESTINATION
                  </th> 
                  <th scope="col" className="th-primary text-right">
                    ACTION
                  </th>
                </tr>
              </Thead>
              <tbody>
                {!isLoading &&
                  cargoitems &&
                  // items?.data?.map((item) => ( //After pagination use this
                  cargoitems?.map((item) => (
                    <tr key={item?.id} className="border-b" >
                      <td>
                        {item?.updated_at}
                      </td>
                      <td>{item?.shipper_name}</td>
                      <td>{item?.first_name} {item?.last_name} - {item?.phone_number}</td>
                      <td>{item?.number || "N/A"}</td>
                      <td>{item?.destination || "N/A"}</td>
                      
                      <td className="flex justify-end items-center space-x-2">
                        <MoreCargoModal item={item} />
                        <Button loading={pdfLoading[item.id]} onClick={() => downloadCargo(item?.id)} size="xs" variant="outline">
                          Download
                        </Button>
                      </td>

                    </tr>
                   ))}
              </tbody>
            </Table>
            {isLoading && (
              <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                <StatelessLoadingSpinner />
              </div>
            )}

            <PaginationLinks
              paginatedData={cargoitems}
              onLinkClicked={onPaginationLinkClicked}
            />
          </Card>
        </div>
      </Box>
    </PageContainer>
  );
}
