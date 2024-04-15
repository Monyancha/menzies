import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { formatDate, formatNumber, parseValidFloat, parseValidInt } from "@/lib/shared/data-formatters";
import {
  IconChevronDown,
  IconDownload,
  IconListDetails,
  IconPrinter,
} from "@tabler/icons";
import { TextInput, Textarea, Button, Tabs, Select, Menu, Checkbox } from "@mantine/core";
import { Table, Trow, Thead, TSearchFilter, TDateFilter } from "@/components/ui/layouts/scrolling-table";
import TableCardHeader from "@/components/ui/layouts/table-card-header";
import store from "@/store/store";
import { fetchManuProducts } from "@/store/merchants/inventory/requisition-slice";
import { fetchExistingProduct, fetchExistingComponent, fetchExistingRecipes } from "@/store/merchants/inventory/products-slice";
import AddComponent from "../add-component-modal";
import AddOtherExpense from "../add-other-expense-modal";
import LinkButton from "@/components/ui/actions/link-button";
import Card from "@/components/ui/layouts/card";
import StatelessLoadingSpinner from "@/components/ui/utils/stateless-loading-spinner";
import { setManufacturedProduct, setBillOfMaterial, setRedirectToReq } from "@/store/merchants/inventory/requisition-slice";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import { fetchSelectProducts } from "@/store/merchants/inventory/products-slice";
import Link from "next/link";
function BillOfMaterials() {
  const { data: session, status } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);
  const router = useRouter();


  const branch_id = useSelector((state) => state.branches.branch_id);

  const product = useSelector((state) => state.requisition.manu_products);
  const canCreateProduct = useSelector(hasBeenGranted("can_create_product"));


  const product_status = "";
  const dataItems = useSelector((state) => state.inventory.getMenuDetails);
  const [selected_product, setProduct] = useState("");
  const [bill_of_material, setBill] = useState("");


  const recipes = useSelector((state) => state.products.recipes);

  const expenses = useSelector((state) => state.products.existingExpenses);
  const selected_manufactured_product = useSelector((state) => state.requisition.manufactured_product_id);
  const selected_recipe_id = useSelector((state) => state.requisition.selected_recipe_id);



  const productsData =
    product?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

  useEffect(() => {

    if (!accessToken || status !== "authenticated" || !selected_product) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["productId"] = selected_product;
    // params["branch_id"] = branch_id;
    params["menuId"] = selected_product;

    if (selected_product) {
      store.dispatch(fetchExistingProduct(params));
      store.dispatch(fetchExistingComponent(params));
      store.dispatch(fetchExistingRecipes(params));
    }

    console.log("the selected product is " + selected_product);
  }, [selected_product,accessToken,status])

  const existingComponentStatus = useSelector(
    (state) => state.products.existingComponentStatus
  );


  const isLoading = existingComponentStatus === "loading";







  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }




    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["fetch_all"] = true;
    params["lean"] = true;

    let pars = { status: false }

    store.dispatch(setRedirectToReq(pars));
    store.dispatch(fetchManuProducts(params));
  }, [session, status]);


  const handleRequisition = () => {
    let index_pars = { product_id: selected_product };
    store.dispatch(setManufacturedProduct(index_pars));

    router.push("/merchants/inventory/requisitions");
  }

  const handleBillOfMaterial = (value) => {
    let index_pars = { product_id: selected_product };
    store.dispatch(setManufacturedProduct(index_pars));

    let pars = { bill_id: value };
    store.dispatch(setBillOfMaterial(pars));
    // router.push("/merchants/inventory/requisitions");

  }

  const handleNewProduct = () => {
    let params = { status: true }

    store.dispatch(setRedirectToReq(params));

    // router.push("/merchants/inventory/new-product");

  }

  const extras = (

    <Fragment>



      {selected_product && (
        <AddComponent
          ProductId={selected_product}
          menus={dataItems}
          product_status={product_status}
        />
      )}
      {selected_product && (
        <AddOtherExpense
          ProductId={selected_product}
          menus={dataItems}
          product_status={product_status}
        />
      )}

      {canCreateProduct && (

        <Button
          variant="outline"
          onClick={() => handleNewProduct()}
          size="xs"
        >
          New Product
        </Button>
      )}
    </Fragment>


  );


  return (
    <>
      <section className="space-y-2 w-full">
        <div className="w-full flex flex-wrap mt-2">
          <Tabs color="teal">


            <Tabs.Panel value="create" pt="xs">

            </Tabs.Panel>



            <Tabs.Panel value="requisition-list" pt="xs">

            </Tabs.Panel>

            <Tabs.Panel value="view-transfer-items" pt="xs">

            </Tabs.Panel>
          </Tabs>




        </div>

      </section>



      <Card>
        <div className="mt-2 rounded-lg p-3 w-full">
          <div className="">
            <div className="">
              <TableCardHeader actions={extras}>
                <Select
                  label="Select Manufactured Product"
                  value={selected_product}
                  data={productsData}
                  onChange={(e) => {
                    setProduct(e);

                  }}
                  searchable
                  clearable
                  required
                />
              </TableCardHeader>
              <div className="min-h-96 h-fit w-100 mx-6 mb-10">
                <div className="h-full w-full bg-white rounded-xl px-4 py-4 flex flex-col">


                  <h2 className="text-lg text-darkest font-bold" id="titems">
                    {product?.name}  {product_status !== "menus" && (<b> Bill Of Materials List</b>)}
                    {product_status == "menus" && (<b> RECIPE LIST</b>)}
                  </h2>
                  {selected_product && (
                    <Table>
                      <Thead className="text-xs  uppercase">
                        <Trow>
                          <>
                            <th scope="col" className="th-primary">
                              ID
                            </th>
                            <th scope="col" className="th-primary">
                              Name
                            </th>
                            <th scope="col" className="th-primary">
                              No Of Components
                            </th>
                            <th scope="col" className="th-primary">
                              Components Cost
                            </th>
                            {product_status == "menus" && (
                              <th scope="col" className="px-10 py-2">
                                Status
                              </th>
                            )}
                            <th scope="col" className="th-primary text-right">
                              ACTION
                            </th>
                          </>
                        </Trow>
                      </Thead>

                      <tbody>
                        {!isLoading &&
                          recipes?.data &&
                          recipes?.data.map((item) => (
                            <Trow className="border-b" key={item.id}>
                              <>
                                <td className="py-3 px-10 text-sm whitespace-nowrap">
                                  {item?.id}
                                </td>
                                <td className="py-3 px-10 text-sm whitespace-nowrap">
                                  {item?.name ?? "-"}
                                </td>
                                <td className="py-3 px-10 text-sm whitespace-nowrap">
                                  {item?.components?.length ?? 0}
                                </td>
                                <td className="py-3 px-10 text-sm whitespace-nowrap">
                                  {formatNumber(item.components_sum_final_cost) ??
                                    0}
                                </td>
                                {product_status == "menus" && (
                                  <td className="py-3 px-10 text-sm whitespace-nowrap">
                                    {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                                  </td>
                                )}
                                <td className="py-3 text-sm whitespace-nowrap">
                                  <LinkButton
                                  title="Stock Requisition"
                                  // onClick={() => handleBillOfMaterial(item.id)}
                                  href="/merchants/inventory/requisitions"
                                  />



                                </td>

                                <td className="py-3 text-sm whitespace-nowrap">
                                  <LinkButton

                                    title={
                                      product_status == "menus"
                                        ? "View"
                                        : "Open"
                                    }
                                    href={`/merchants/inventory/rawmaterials/${item.id}?status=${product_status}`}
                                    className="cursor-pointer gap-2"
                                    gradient={{
                                      from: "teal",
                                      to: "blue",
                                      deg: 105,
                                    }}
                                  />

                                  {product_status == "menus" ? (
                                    item?.status === 0 || item?.status === null ? (
                                      <Button
                                        onClick={() => handleActivate(item?.id)}
                                        variant="outline"
                                        color="lime"
                                        size="xs"
                                        className="mr-2 py-2"
                                      >
                                        Activate
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => handleDeactivate(item?.id)}
                                        variant="outline"
                                        color="red"
                                        size="xs"
                                        className="mr-2 py-2"
                                      >
                                        Deactivate
                                      </Button>
                                    )
                                  ) : (
                                    <b></b>
                                  )}
                                </td>
                              </>
                            </Trow>
                          ))}
                      </tbody>

                    </Table>

                  )}

                  {isLoading && (
                    <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                      <StatelessLoadingSpinner />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

export default BillOfMaterials;
