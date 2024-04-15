import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getTaxes } from "../../src/store/reports/reports-slice";
import { getProductTax } from "../../src/store/merchants/inventory/products-slice";
import store from "../../src/store/Store";
import StatelessLoadingSpinner from "../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../components/ui/layouts/pagination-links";
import { formatNumber } from "../../lib/shared/data-formatters";
import { useState } from "react";
import ActionIconButton from "../../components/ui/actions/action-icon-button";
import { showNotification } from "@mantine/notifications";
import { TextInput, Select } from "@mantine/core";
import { Table } from "../../components/ui/layouts/scrolling-table";
import { TheadDark } from "../../components/ui/layouts/scrolling-table-dark";

function Taxes() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [tax_rate_levy, setTaxRateLevy] = useState("");
  const [tax_type, setTaxType] = useState("");

  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const inventoryStatus = useSelector((state) => state.reports.getTaxesStatus);

  const inventory = useSelector((state) => state.reports.getTaxes);

  const isLoading = inventoryStatus === "loading";
  const taxList = useSelector((state) => state.products.getProductTax);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    if (tax_rate) {
      params["tax_rate"] = tax_rate;
    }

    if (tax_rate_levy) {
      params["tax_rate_levy"] = tax_rate_levy;
    }

    if (tax_type) {
      params["tax_type"] = tax_type;
    }

    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    store.dispatch(getTaxes(params));
    store.dispatch(getProductTax(params));
  }, [
    session,
    status,
    startDate,
    endDate,
    branch_id,
    searchTerm,
    tax_type,
    tax_rate,
    tax_rate_levy,
  ]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    if (tax_rate) {
      params["tax_rate"] = tax_rate;
    }
    if (tax_rate) {
      params["tax_rate_levy"] = tax_rate_levy;
    }

    if (tax_type) {
      params["tax_type"] = tax_type;
    }
    params["branch_id"] = branch_id;

    store.dispatch(getTaxes(params));
  }

  const data = inventory?.taxable_report;

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let endpoint = `${API_URL}/reports/tax-reports/export-pdf?`;

    const accessToken = session.user.accessToken;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (searchTerm) {
      params["search_string"] = searchTerm;
    }
    if (tax_rate) {
      params["tax_rate"] = tax_rate;
    }
    if (tax_rate_levy) {
      params["tax_rate_levy"] = tax_rate_levy;
    }
    if (tax_type) {
      params["tax_type"] = tax_type;
    }

    params["branch_id"] = branch_id;

    endpoint += new URLSearchParams(params);

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
    a.innerHTML = `Tax Reports.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
      setIsLoadingPdf(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setIsLoadingPdf(false);
    }
    setIsLoadingPdf(false);
  };

  return (
    <>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4">
        <div className="flex flex-wrap justify-between items-end">
          <div className="flex w-full md:w-6/12 flex-wrap">
            <div className="flex flex-wrap space-y-1 w-full md:w-3/12 xl:w-fit">
              <div className="text-dark text-sm">From</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                placeholder="dd/mm/yyyy"
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
                value={startDate}
              />
            </div>

            <div className="flex flex-wrap space-y-1 w-full md:w-3/12 md:pl-2 xl:w-fit">
              <div className="text-dark text-sm">To</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                placeholder="dd/mm/yyyy"
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
                value={endDate}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-end">
          <div className="flex w-full md:w-/12 flex-wrap md:justify-end mt-2 md:mt-0 space-x-1 items-center">
            <TextInput
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2"
            />

            <Select
              placeholder="Select VAT Rate"
              className="mt-2"
              vaue={tax_rate}
              onChange={setTaxRate}
              data={
                taxList
                  ?.filter((it) => it?.type != "LEVY")
                  ?.map((item) => ({
                    value: `${item.rate}`,
                    label: `${item?.name} ${item?.rate}%`,
                  })) ?? []
              }
              searchable
              clearable
            />

            <Select
              placeholder="Select Levy Rate"
              className="mt-2"
              vaue={tax_rate_levy}
              onChange={setTaxRateLevy}
              data={
                taxList
                  ?.filter((it) => it?.type === "LEVY")
                  ?.map((item) => ({
                    value: `${item.rate}`,
                    label: `${item?.name} ${item?.rate}%`,
                  })) ?? []
              }
              searchable
              clearable
            />

            <ActionIconButton
              icon="fa-solid fa-download"
              isLoading={isLoadingPdf}
              tooltip="PDF"
              clickHandler={exportPDF}
            />
          </div>
        </div>
        <Table>
          <TheadDark>
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                PRODUCT
              </th>
              <th scope="col" className="th-primary">
                VAT TAX PERCENTAGE
              </th>
              <th scope="col" className="th-primary">
                VAT TAX METHOD
              </th>
              <th scope="col" className="th-primary">
                LEVY TAX PERCENTAGE
              </th>
              <th scope="col" className="th-primary">
                SERVICE CHARGE PERCENTAGE
              </th>
              <th scope="col" className="th-primary">
                TOTAL VAT TAX
              </th>
              <th scope="col" className="th-primary">
                TOTAL LEVY TAX
              </th>
              <th scope="col" className="th-primary">
                SERVICE CHARGE TAX
              </th>
              <th scope="col" className="th-primary">
                TAX SUBTOTAL
              </th>
            </tr>
          </TheadDark>
          {!isLoading &&
            data?.data &&
            data?.data.map((item) => (
              <tr className="border-b" key={item?.id}>
                <td className="py-3 px-6 text-sm font-medium whitespace-nowrap">
                  {item?.id}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.sellable?.name}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.sellable?.tax?.rate}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.sellable?.tax_method}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.sellable?.tax_levy?.rate}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.sellable?.tax_service_charge?.rate}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  Ksh. {formatNumber(item?.normal_tax_sum)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  Ksh. {formatNumber(item?.levy_tax_sum)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  Ksh. {formatNumber(item?.service_charge_sum)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap ">
                  Ksh. {formatNumber(item?.tax_sum)}
                </td>
              </tr>
            ))}
        </Table>

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={data}
          onLinkClicked={onPaginationLinkClicked}
        />
      </div>
    </>
  );
}

export default Taxes;
