import { useEffect, useState, Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "../../ui/layouts/card";
import {
  Table,
  Thead,
  Trow,
  TSearchFilter,
} from "../../ui/layouts/scrolling-table";
import {
  formatDate,
  formatNumber,
} from "../../../lib/shared/data-formatters";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../src/store/Store";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { Menu, Button, Text, TextInput,Checkbox,Tooltip } from "@mantine/core";
import {
  IconChevronDown,
  IconEye,
  IconPencil,
  IconMathSymbols,
  IconTableExport,
} from "@tabler/icons-react";
import Link from "next/link";
import { fetchClients } from "../../../src/store/partners/clients-slice";
import TableCardHeader from "../../ui/layouts/table-card-header";
import { showNotification } from "@mantine/notifications";
import { getAllCustomerCategories } from "../../../src/store/partners/clients-slice";
import DelTable from "../../merchants/inventory/del-modals/del-table-modal";
import { useRouter } from "next/router";

function ClientsListView() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  //
  const router = useRouter();
  const nextUrl = router?.query?.next_url ?? null;
  const [next_url, setNextUrl] = useState(nextUrl ?? "");

  const [searchTerm, setSearchTerm] = useState("");
  const [branch_clients, setBranchClient] = useState("");

  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const clientListStatus = useSelector(
    (state) => state.clients.clientListStatus
  );
  const clientList = useSelector((state) => state.clients.clientList);

  const isLoading = clientListStatus === "loading";
  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["detailed"] = true;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (next_url) {
      params["page"] = next_url;
    }

    store.dispatch(fetchClients(params));
  }, [accessToken, searchTerm, branch_id, next_url]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    setNextUrl(page);

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;
    params["page"] = page;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchClients(params));
  }

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/partners/clients/downloadExcel`;

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

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = `StaffTransactions.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
    setIsLoadingPdf(false);
  };

  const items = useSelector((state) => state.clients.getAllCustomerCategories);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getAllCustomerCategories(params));
  }, [session, status]);

  useEffect(()=>{
    if(branch_clients)
    {
      showNotification({
        title: "Success",
        message: "Clients Successfully Branched",
        color: "green",
      });
    }
  },[branch_clients])

  const [openClientPointsModal, setOpenClientPointsModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  const actions = (
    <div className="flex items-end gap-2">

      <TSearchFilter onChangeSearchTerm={setSearchTerm} />

      <Button
        className="mr-2"
        leftIcon={<IconTableExport size={16} />}
        variant="outline"
        loading={isLoadingPdf}
        onClick={exportPDF}
      >
        Export to Excel
      </Button>
    </div>
  );

  return (
    <>

      <Card>
        <TableCardHeader actions={actions}>
       
          <Fragment></Fragment>
        </TableCardHeader>

        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>
              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                REGISTERED AT
              </th>
             
              <th scope="col" className="th-primary text-right">
                ACTIONS
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              clientList &&
              clientList?.data.map((item) => (
                <Trow key={item.id}>
                  <>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      {item?.created_at ? formatDate(item?.created_at) : "-"}
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
                              rightIcon={<IconChevronDown size={14} />}
                              size="xs"
                              variant="outline"
                            >
                              Actions
                            </Button>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Label>
                              #{item.id + " - " + item.name}
                            </Menu.Label>

                            <>
                              <Link
                                href={`/partners/clients/${item.id}`}
                              >
                                <Menu.Item
                                  icon={<IconEye size={15} color="lime" />}
                                  onClick={() => {}}
                                >
                                  <Text color="lime">View</Text>
                                </Menu.Item>
                              </Link>
                              <Link
                                href={`/partners/clients/edit/${item.id}?next_url=${next_url}`}
                              >
                                <Menu.Item
                                  icon={<IconPencil size={15} color="blue" />}
                                  onClick={() => {}}
                                >
                                  <Text color="blue">Edit</Text>
                                </Menu.Item>
                              </Link>

                            </>
                          </Menu.Dropdown>
                        </Menu>
                        <DelTable item={item} source="clients" />
                      </span>
                    </td>
                  </>
                </Trow>
              ))}
          </tbody>
        </Table>
        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={clientList}
          onLinkClicked={onPaginationLinkClicked}
        />


      </Card>
    </>
  );
}

export default ClientsListView;
