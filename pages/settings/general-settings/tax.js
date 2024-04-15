import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import store from "../../../src/store/Store";
import { Button } from "@mantine/core";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import { Table, Thead, Trow } from "../../../components/ui/layouts/scrolling-table";
import Card from "../../../components/ui/layouts/card";
import { IconTableExport } from "@tabler/icons-react";
import NewTaxModal from "../../../components/merchants/settings/general-settings/new-tax.js";
import EditTaxModal from "../../../components/merchants/settings/general-settings/edit-tax-modal";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { getAllTaxesList } from "../../../src/store/merchants/settings/access-control-slice";
import DelTable from "../../../components/merchants/inventory/del-modals/del-table-modal";
import UploadTaxModal from "../../../components/merchants/settings/general-settings/upload-tax-modal";
import { showNotification } from "@mantine/notifications";
import BackButton from "../../../components/ui/actions/back-button";

function TaxSettings() {
  const { data: session, status } = useSession();
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const taxStatus = useSelector(
    (state) => state.accessControl.getAllTaxesListStatus
  );
  const taxData = useSelector((state) => state.accessControl.getAllTaxesList);

  const isLoading = taxStatus === "loading";
  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(getAllTaxesList(params));
  }, [branch_id, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(getAllTaxesList(params));
  }

  const taxes = taxData;

  const exportExcel = async () => {
    setIsLoadingExcel(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/tax/export-excel`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    };

    try {
      const response = await fetch(endpoint, options);
      const blob = await response.blob();

      if (!response.ok) {
        throw { message: "failure" };
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Tax Report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification({
        title: "Success",
        message: "Download successful",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Sorry! " + error.message,
        color: "red",
      });
    }

    setIsLoadingExcel(false);
  };

  return (

      <Box>

      <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <div className="flex flex-row flex-nowrap gap-1">
      <UploadTaxModal />
      <Button
        leftIcon={<IconTableExport size={16} />}
        variant="outline"
        loading={isLoadingExcel}
        onClick={exportExcel}
        size="xs"
      >
        Export
      </Button>

      <NewTaxModal />
    </div>
          </div>
        </header>

      <div className="w-full flex flex-wrap mt-2">
        <Card>
          <Table>
            <Thead>
              <tr>
                <th scope="col" className="th-primary">
                  NAME
                </th>
                <th scope="col" className="th-primary">
                  RATE
                </th>
                <th scope="col" className="th-primary text-right">
                  ACTIONS
                </th>
              </tr>
            </Thead>
            <tbody>
              {!isLoading &&
                taxes?.data &&
                taxes?.data?.map((item) => (
                  <Trow key={item?.id}>
                    <>
                      <td>{item?.name}</td>
                      <td>{item?.rate}</td>

                      <td className="py-0 pl-14 2xl:pl-4">
                        <span className="flex justify-end items-center w-full gap-2">
                          <EditTaxModal item={item} />
                          <DelTable item={item} source={taxes} />
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
            paginatedData={taxes}
            onLinkClicked={onPaginationLinkClicked}
          />
        </Card>
      </div>
  
      </Box>
  );
}

export default TaxSettings;
