import {
    Button,
    useMantineTheme,
    Modal,
    Select,
    Textarea,
    TextInput,
  } from "@mantine/core";
  import { formatNumber,parseValidFloat } from "@/lib/shared/data-formatters";
  import { useSession } from "next-auth/react";
  import { IconListDetails } from "@tabler/icons";
  import { useState, useEffect,useMemo } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { fetchExistingComponent } from "@/store/merchants/inventory/products-slice";
  import EditComponent from "../edit-component-modal";
  import DeleteComponentModal from "../del-modals/delete-component-modal";
  function ServicesProductsModal(ProductId) {
    const { data: session, status } = useSession();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [file, setFile] = useState(null);
    const branch_id = useSelector((state) => state.branches.branch_id);

    const components = useSelector((state) => state.products.existingComponents);
    const accessToken = useMemo(() => {
        return session?.user?.accessToken;
      }, [session]);
      const existingComponentStatus = useSelector(
        (state) => state.products.existingComponentStatus
      );
      const isLoading = existingComponentStatus === "loading";

      let raw_materials_cost =
      components?.data?.reduce(
        (sum, item) =>
          sum + parseValidFloat(item?.product_components[0]?.final_cost),
        0
      ) ?? 0;

    useEffect(() => {
        if (!accessToken || status !== "authenticated" || !ProductId) {
          return;
        }
    
        const params = {};
        params["productId"] = ProductId;
        params["accessToken"] = accessToken;
      
    
        if (ProductId) {
         
          store.dispatch(fetchExistingComponent(params));
         
        }
      }, [accessToken, status, ProductId]);
  
    return (
      <>
        <Modal
          overlayColor={
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
          }
          overlayOpacity={0.55}
          overlayBlur={3}
          opened={opened}
          title={`Products`}
          onClose={() => setOpened(false)}
          padding="md"
          size="80%"
          overflow="inside"
        >
          {/* Modal content */}
           
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs  uppercase">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Remaining Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Cost
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Wastage
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total Qty Deducted
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {!isLoading &&
                        components?.data &&
                        components?.data.map((item) => (
                          <tr className="border-b" key={item.id}>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.sellable?.id}
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.sellable?.name}
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {formatNumber(item?.sellable?.total_remaining)}
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.sellable?.buying_price}
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.product_components[0]?.quantity}
                              {item?.sellable?.unit?.name ?? ""}
                            </td>

                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.product_components[0]?.wastage_percentage}
                              {item?.sellable?.unit?.name ?? ""}
                            </td>
                            {/* <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.product_components[0]?.final_cost}
                            </td> */}

                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {
                                item?.product_components[0]
                                  ?.total_quantity_deducted
                              }
                            </td>

                            <td className="py-3 px-6 text-sm whitespace-nowrap text-right gap-2 flex">
                              <DeleteComponentModal
                                item={item?.product_components[0]}
                                source="products"
                              />
                            </td>
                          </tr>
                        ))}

                      {!isLoading && components?.data?.length > 0 && (
                        <>
                          <tr className="bg-white border-b text-lg">
                            <th
                              scope="row"
                              colSpan="3"
                              className="text-primary font-bold"
                            >
                             PRODUCTS COST
                            </th>
                            <td className="text-dark tracking-wider text-xl font-bold">
                              Kshs {formatNumber(raw_materials_cost)}
                            </td>
                          </tr>
                          <tr className="bg-white text-lg mt-2">
                            <th
                              scope="row"
                              colSpan="3"
                              className="text-primary font-bold"
                            ></th>
                            <td className="text-xl font-bold">
                              <EditComponent
                                components={components}
                                recipe_id={ProductId}
                              />
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
         
        </Modal>
  
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => setOpened(true)}
          leftIcon={<IconListDetails  size={14} />}
          size="md"
        >
          Products
        </Button>
      </>
    );
  }
  
  export default ServicesProductsModal;
  