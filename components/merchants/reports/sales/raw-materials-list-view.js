import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import store from "@/store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import PaginationLinks from "@/components/ui/layouts/pagination-links";
import {
    formatNumber,
    formatDate,
  } from "../../../../lib/shared/data-formatters";
import { useState } from "react";
import ActionIconButton from "@/components/ui/actions/action-icon-button";
import { showNotification } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { IconEye, IconCash } from "@tabler/icons";
import { TextInput } from "@mantine/core";
import {
     fetchExistingComponent,
     getProducts
    } from "@/store/merchants/inventory/products-slice";

function RawMaterials() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  //setPaymentMethod
  const [paymentMethod, setPaymentMethod] = useState("");
  //isLoadingPdf
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  //
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const inventoryStatus = useSelector(
    (state) => state.reports.getProductVariationsStatus
  );

  const inventory = useSelector((state) => state.reports.product_variations_list);

  const isLoading = inventoryStatus === "loading";

  const branch_id = useSelector((state) => state.branches.branch_id);

  const productStatus = useSelector(
    (state) => state.products.getProductsStatus
  );

  const products = useSelector((state) => state.products.getProducts);


  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    // if (!startDate && !endDate) {
    //   store.dispatch(getProductVariations(params));
    //   return;
    // }
    // if (!startDate || !endDate) {
    //   return;
    // }

      params["searchTerm"] = searchTerm;


    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(fetchExistingComponent(params));

  }, [
    session,
    status,
    startDate,
    endDate,
    searchTerm,
    branch_id,
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
    if (paymentMethod) {
      params["paymentMethod"] = paymentMethod;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchExistingComponent(params));
  }

  const components = useSelector(
    (state) => state.products.existingComponents
  );

  const data = components;

  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/raw-materials-pdf?` +  new URLSearchParams({
      branch_id: branch_id,

  });

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
    a.innerHTML = `Inventory.pdf`;
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
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
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

            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 md:pl-2 xl:w-fit">
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
          <div className="flex w-full md:w-6/12 flex-wrap md:justify-end mt-2 md:mt-0 space-x-2 items-center">
            <TextInput
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
            />
             <ActionIconButton
              icon="fa-solid fa-download"
              isLoading={isLoadingPdf}
              tooltip="PDF"
              clickHandler={exportPDF}
            />

          </div>

        </div>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg">
              <table className="rounded-lg min-w-full" id="inventorySales">
                <thead className="bg-gray-50">
                  <tr>

                    <th scope="col" className="th-primary">
                      NAME
                    </th>
                    <th scope="col" className="th-primary">
                      No Of Main Products
                    </th>
                    <th scope="col" className="th-primary">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {components?.data &&
                        components?.data.map((item) => (
                          <tr className="border-b" key={item?.id}>

                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.sellable?.name}
                            </td>



                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {
                                item?.product_components.length
                              }
                            </td>

                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                          <Link
                            href={`/merchants/reports/sales/manufactured/${item?.id}`}

                          >
                            <Button
                              variant="outline"
                              leftIcon={<IconEye size={16} />}
                              size="xs"
                            >
                              View
                            </Button>
                          </Link>
                        </td>


                      </tr>
                    ))}
                </tbody>
              </table>

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
          </div>
        </div>
      </div>
    </>
  );
}

export default RawMaterials;
