import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

//
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { parseValidFloat, parseValidInt } from "../../../lib/shared/data-formatters";
import {
  Button,
  Modal,
  Select,
  TextInput,
  Group,
  Textarea,
  Badge,
  Paper,
  Text,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import CreateTaxModal from "../../../components/accounts/create-tax-modal";
import {
  IconCalendar,
  IconEye,
  IconTrash,
  IconPlus,
  IconCircleCheck,
} from "@tabler/icons-react";
import { getFooterNote, getAllRequirements } from "../../../src/store/accounts/accounts-slice";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import EnterClientModal from "../../../components/partners/enter-client-modal";
import { getAllTaxes } from "../../../src/store/accounts/accounts-slice";
import { fetchClients } from "../../../src/store/accounts/accounts-slice";
import EditFooterModal from "../../../components/accounts/edit-footer-modal";
import PreviewQuotationModal from "../../../components/accounts/preview-quotation";
import AddProductModal from "../../../components/accounts/add-product-modal";
import { fetchMyAccountData } from "../../../src/store/access/access-control-slice";
import SellablesSelectInput from "../../../components/accounts/sellables-select-input";
import { fetchSellables } from "../../../src/store/transactions/transaction-slice";
//

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/accounts/quotations",
    title: "Quotations",
  },
  {
    to: "/accounts/quotations/create",
    title: "Create Quotations",
  },
];

export default function CreateQuotation() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [discount, setDiscount] = useState("0");
    const [discountType, setDiscountType] = useState("");
    const [footer, setFooter] = useState("");
    //
    let [hasTax, setHasTax] = useState("0");
    const [taxId, setTaxId] = useState("");
    const [vatTax, setVatTax] = useState("");
    //setClientName //clientPhone //clientEmail
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
  
    //product filter
    const [productFilter, setProductFilter] = useState("");
  
    //Merchant Account Information
    // const merchant = useSelector((state) => state.accessControl.myAccountData);
  
    //
    // useEffect(() => {
    //   if (!session || status !== "authenticated") {
    //     return;
    //   }
  
    //   const params = {};
    //   params["accessToken"] = session.user.accessToken;
  
    //   store.dispatch(fetchMyAccountData(params));
    // }, [session, status]);
  
    //Get Requirements
    const reqStatus = useSelector(
      (state) => state.accounts.getAllRequirementsStatus
    );
  
    const requirements = useSelector(
      (state) => state.accounts.getAllRequirements
    );
  
    const isLoading = reqStatus === "loading";
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      if (productFilter) {
        params["filter"] = productFilter;
      }
  
      store.dispatch(getAllRequirements(params));
    }, [session, status, productFilter]);
  
    const branch_id = useSelector((state) => state.branches.branch_id);
  
    console.log(requirements);
  
    //getFooterNote
    const footerStatus = useSelector(
      (state) => state.accounts.getFooterNoteStatus
    );
  
    const footerNote = useSelector((state) => state.accounts.getFooterNote);
  
    const isLoadingFooter = footerStatus === "loading";
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getFooterNote(params));
    }, [session, status]);
  
    //setFooter(footerNote);
    //Set Default Footer
    useEffect(() => {
      if (!footerNote) {
        return;
      }
  
      setFooter(footerNote);
    }, [footerNote]);
  
    //Fetch Clients
    const clientStatus = useSelector(
      (state) => state.accounts.fetchClientsStatus
    );
  
    const clientsData = useSelector((state) => state.accounts.fetchClients);
  
    const isClientLoading = clientStatus === "loading";
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(fetchClients(params));
    }, [session, status]);
  
    console.log("Clients Data", clientsData);
  
    console.log(requirements);
  
    //Clients
    const clientsList = requirements?.customers;
  
    const clients =
      clientsList?.map((item) => ({
        value: item.id,
        label: item.id + " | " + item.name,
      })) ?? [];
  
    //Tax
    const taxList = useSelector((state) => state.accounts.getAllTaxes);
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["branch_id"] = branch_id;
  
      store.dispatch(getAllTaxes(params));
    }, [session, status, branch_id]);
  
    const tax =
      taxList?.map((item) => {
        const taxType =
          item.tax_type === "percentage"
            ? `${item.tax_amount} % Tax`
            : `Ksh. ${item.tax_amount} Tax`;
  
        return {
          value: item.tax_amount + "_" + item.tax_type,
          label: taxType,
        };
      }) ?? [];
  
    //Products
    const [products, setProducts] = useState([]);
  
    // const productsList = requirements?.products?.data;
    const productsList = requirements?.products;
  
    useEffect(() => {
      const productsData =
        productsList?.data?.map((item) => ({
          value: item.sellable?.name,
          label: "" + item.sellable?.name,
        })) ?? [];
  
      if (!productsData) {
        return;
      }
  
      setProducts(productsData);
    }, [productsList]);
  
    const [loading, setLoading] = useState(false);
  
    const loadOptions = async (inputValue) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = `${API_URL}/partners/clients?filter=${inputValue}`;
  
      try {
        const accessToken = session.user.accessToken;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            Accept: "application/json",
          },
        });
  
        const data = await response.json();
  
        const results = data?.data?.map((item) => ({
          value: item?.id,
          label: item?.name,
        }));
  
        setOptions(results ?? []);
      } catch (error) {
        console.error(error);
        setOptions([]);
      }
    };
  
    //UseStates
    const [items, setItems] = useState([
      {
        product: "",
        description: "",
        quantity: "",
        price: "",
        tax: "",
        product_id: "",
      },
    ]);
    const [clientId, setClientId] = useState("");
    const [posNumber, setPosNumber] = useState("");
    const [description, setDescription] = useState("");
    const [signature, setSignature] = useState("");
    const [estimateDate, setEstimateDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [kraPin, setKraPin] = useState("");
    //
    const [searchValue, onSearchChange] = useState("");
    const [options, setOptions] = useState([]);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
  
    // function handleItemChange(index, key, value) {
    //   setItems((prevItems) =>
    //     prevItems.map((item, i) =>
    //       i === index ? { ...item, [key]: value } : item
    //     )
    //   );
    // }
  
    function handleItemChange(index, key, value) {
      if (key === "product") {
        const price = value ? value?.sellable?.cost : 0;
        const productId = value?.sellable?.id;
        const vatTax = value ? value?.sellable?.tax?.rate : 0;
  
        console.log("nyaranda vat", vatTax);
  
        // Update the item's price field with the selected product's price
        setItems((prevItems) =>
          prevItems.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [key]: value?.sellable?.name,
                  price: price,
                  quantity: 1,
                  product_id: productId,
                  sellable_id: value?.sellable?.sellable?.id,
                  vat: vatTax,
                } // set default quantity to 1
              : item
          )
        );
      } else {
        // Update the item's other fields (quantity, tax, etc.)
        setItems((prevItems) =>
          prevItems.map((item, i) =>
            i === index ? { ...item, [key]: value } : item
          )
        );
      }
    }
  
    function handleAddItem() {
      setItems((prevItems) => [
        ...prevItems,
        { product: "", description: "", quantity: "", price: "", tax: "" },
      ]);
    }
  
    function handleRemoveItem(index) {
      setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    }
  
    function clearForm() {
      setClientId("");
      setPosNumber("");
      setDescription("");
      setSignature("");
      setEstimateDate("");
      setDueDate("");
      setHasTax("");
      setTaxId("");
      // setItems("");
      setKraPin("");
    }
  
    const dateObj = new Date(estimateDate);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const formattedEstimateDate = `${year}-${month}-${day}`;
  
    const dateDueObj = new Date(dueDate);
    const year1 = dateDueObj.getFullYear();
    const month1 = (dateDueObj.getMonth() + 1).toString().padStart(2, "0");
    const day1 = dateDueObj.getDate().toString().padStart(2, "0");
    const formattedDueDate = `${year1}-${month1}-${day1}`;
  
    const calculateTotal = () => {
      let totalTax = 0;
      let totalPrice = 0;
  
      items.forEach((item) => {
        const itemPrice = parseValidFloat(item.price) || 0;
        const vat = item?.vat;
        const itemTax = item.tax || taxId || "0_percentage";
  
        console.log("Monyancha onyambu vat tax", vat);
  
        // const itemQuantity = parseValidInt(item.quantity) || 1; // Default quantity is 1
        const itemQuantity = parseValidInt(item.quantity); //Persist the current quantity to avoid calculating items with 0 quantity
  
        console.log("Item Tax Type", itemTax);
  
        let itemTotalPrice = itemPrice * itemQuantity;
        let itemTotalTax = 0;
  
        if (vat > 0) {
          // Calculate original price
          const taxPercentage = vat / 100;
          const originalPrice = itemTotalPrice / (1 + taxPercentage);
  
          // Calculate tax amount
          totalTax = itemTotalPrice - originalPrice;
        }
  
        if (hasTax === "2") {
          if (itemTax.endsWith("_fixed")) {
            // If item tax is a fixed amount
            const fixedTax = parseFloat(itemTax.replace("_fixed", ""));
            if (itemTotalPrice < fixedTax) {
              // Item price is less than fixed tax
              const taxPercentage = parseFloat(itemTax.replace("%", "")) / 100;
              itemTotalTax = itemTotalPrice * taxPercentage; // Use the specified tax percentage or 0%
            } else {
              // Item price is greater than or equal to fixed tax
              itemTotalTax = fixedTax;
            }
          } else {
            // Assume item tax is a percentage (e.g. "16%")
            const taxPercentage = parseFloat(itemTax.replace("%", "")) / 100;
            if (taxPercentage === 0.16) {
              // Check if tax type is 16%
              const taxableAmount = itemTotalPrice;
              const taxAmount = taxableAmount * taxPercentage;
              itemTotalTax = taxAmount;
            } else {
              itemTotalTax = itemTotalPrice * taxPercentage; // For other taxes, just use the specified tax percentage or 0%
            }
          }
          totalPrice += itemTotalPrice;
          totalTax += itemTotalTax;
  
          totalPrice += itemTotalTax;
        }
  
        if (hasTax === "1") {
          if (itemTax.endsWith("_fixed")) {
            // If item tax is a fixed amount
            const fixedTax = parseFloat(itemTax.replace("_fixed", ""));
            if (itemTotalPrice < fixedTax) {
              // Item price is less than fixed tax
              const taxPercentage = parseFloat(itemTax.replace("%", "")) / 100;
              itemTotalTax = itemTotalPrice * taxPercentage; // Use the specified tax percentage or 0%
            } else {
              // Item price is greater than or equal to fixed tax
              itemTotalTax = fixedTax;
            }
          } else {
            // Assume item tax is a percentage (e.g. "16%")
            const taxPercentage = parseFloat(itemTax.replace("%", "")) / 100;
            if (taxPercentage === 0.16) {
              // Check if tax type is 16%
              const taxableAmount = itemTotalPrice;
              const taxAmount =
                (taxPercentage * taxableAmount) / (taxPercentage + 1);
              itemTotalTax = taxAmount;
            } else {
              itemTotalTax = itemTotalPrice * taxPercentage; // For other taxes, just use the specified tax percentage or 0%
            }
          }
          totalPrice += itemTotalPrice;
          totalTax += itemTotalTax;
  
          // totalPrice += totalTax;
        }
  
        if (hasTax === "0") {
          totalPrice += itemTotalPrice;
        }
      });
  
      // totalPrice += totalTax;
  
      // Deduct the discount from the total price
      // if (discountType === "amount") {
      //   totalPrice -= parseValidFloat(discount);
      // } else if (discountType === "percentage") {
      //   totalPrice *= 1 - parseValidFloat(discount) / 100;
      // }
  
      // return { totalTax, totalPrice };
      let totalDiscount = 0;
  
      if (discountType === "amount") {
        totalDiscount = parseInt(discount);
        totalPrice -= totalDiscount;
      } else {
        totalDiscount = (totalPrice * parseInt(discount)) / 100;
        totalPrice -= totalDiscount;
      }
  
      return { totalTax, totalPrice, totalDiscount };
    };
  
    // const { totalTax, totalPrice, itemTotalTax } = calculateTotal();
    const { totalTax, totalPrice, itemTotalTax, totalDiscount } =
      calculateTotal();
  
    useEffect(() => {
      setVatTax(totalTax);
    }, [totalTax]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      setLoading(true);
  
      const formdata = new FormData();
  
      if (hasTax === "inclusive") {
        hasTax = 1;
      }
      if (hasTax === "exclusive") {
        hasTax = 2;
      }
      formdata.append("client_id", clientId);
      formdata.append("pos_number", posNumber);
      formdata.append("description", description);
      formdata.append("signature", signature);
      formdata.append("estimate_date", formattedEstimateDate);
      formdata.append("due_date", formattedDueDate);
      formdata.append("has_tax", hasTax);
      items.forEach((item) => {
        formdata.append("product_id[]", item.product_id);
        formdata.append("sellable_id[]", item.sellable_id);
        formdata.append("name[]", item.product);
        formdata.append("category[]", item.category);
        formdata.append("desc[]", item.description);
        formdata.append("quantity[]", item.quantity);
        formdata.append("price[]", item.price);
        formdata.append("tax[]", item.tax || taxId);
      });
      formdata.append("total_tax", vatTax || 0);
      formdata.append("kra_pin", kraPin);
      formdata.append("discount", totalDiscount);
      formdata.append("branch_id", branch_id);
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/accounts/quotations/store`;
  
      const accessToken = session.user.accessToken;
  
      const response = fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
        body: formdata,
      }).then(async (response) => {
        const data = await response.json();
        console.log("Response Data", data);
        console.log(response);
  
        if (data?.statusCode !== 201 && response?.status === 200) {
          showNotification({
            title: "Success",
            message: "Quotation created Successfully",
            color: "green",
          });
          setLoading(false);
          router.push("/accounts/quotations");
          clearForm();
          //Fetch sellables
          const params = {
            accessToken,
            branch_id,
          };
          store.dispatch(fetchSellables(params));
        } else {
          // error occurred
          let message = "";
          for (let field in data.errors) {
            message += data.errors[field][0] + ", ";
          }
          message = message.slice(0, -2); // remove last comma and space
          showNotification({
            title: "Error",
            message: message + response?.statusText,
            color: "red",
          });
  
          setLoading(false);
        }
      });
    };
  
    //Fetch selected client
    const selectedClient = useSelector((state) =>
      state.accounts?.fetchClients?.data?.find((item) => item.id == clientId)
    );
  
    //
    const onCreateClient = (newClient) => {
      setClientId(newClient?.id);
      setClientName(newClient?.name);
      setClientPhone(newClient?.phone);
      setClientEmail(newClient?.email);
    };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Create Quotation" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
      

      <main className="w-full flex-grow">
          <div className="w-full mt-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                  <p className="mt-1 text-sm text-gray-500">
                    You can create a quotation for an existing customer or add
                    the customer first
                  </p>
                  <div className="col-span-4 sm:col-span-4">
                    <div className="flex flex-col items-left">
                      <div className="w-full  flex flex-col items-center">
                        <div className="w-full pt-4 flex flex-row">
                          <div>
                            <div></div>
                            <div>
                              <div>
                                <div id="options" className="relative ">
                                  <Select
                                    placeholder="Search a customer"
                                    searchable
                                    onSearchChange={(value) => {
                                      onSearchChange(value);
                                      setIsLoadingClients(true);
                                      loadOptions(value).finally(() =>
                                        setIsLoadingClients(false)
                                      );
                                    }}
                                    onChange={(value) => setClientId(value)}
                                    value={clientId}
                                    searchValue={searchValue}
                                    data={options}
                                    loading={isLoading}
                                    clearable
                                    nothingFound="No clients found"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                          <span className="ml-2 mr-2 mt-2">or</span>
                          <EnterClientModal onCreateClient={onCreateClient} />
                        </div>
                      </div>
                      <div className="mt-2">
                        {clientId && (
                          <>
                            <p>Client ID : #{clientId}</p>
                            <p>
                              Client Name : {selectedClient?.name ?? clientName}
                            </p>
                            <p>
                              Client Phone :{" "}
                              {selectedClient?.phone ?? clientPhone}
                            </p>
                            <p>
                              Client Email :{" "}
                              {selectedClient?.email ?? clientEmail}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 md:col-span-1">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12">
                      <TextInput
                        placeholder="P.O/S.O Number"
                        label="P.O/S.O Number"
                        onChange={(event) => setPosNumber(event.target.value)}
                      />
                    </div>

                    <div className="col-span-12">
                      <DatePickerInput
                      withAsterisk
                        placeholder="Quotation Date"
                        label="Quotation Date"
                        icon={<IconCalendar size={16} />}
                        onChange={setEstimateDate}
                      />
                    </div>

                    <div className="col-span-12">
                      <DatePickerInput
                      withAsterisk
                        placeholder=" Quotation Valid Until"
                        label=" Quotation Valid Until"
                        icon={<IconCalendar size={16} />}
                        onChange={setDueDate}
                      />
                    </div>

                    <div className="col-span-12">
                      <TextInput
                        placeholder="KRA Pin"
                        label="KRA Pin"
                        defaultValue={selectedClient?.kra_pin}
                        onChange={(event) => setKraPin(event.target.value)}
                      />
                    </div>

                    <div className="col-span-12">
                      <Select
                        label="Has Tax"
                        placeholder="Has Tax"
                        onChange={setHasTax}
                        defaultValue={hasTax}
                        data={[
                          { value: "1", label: "Inclusive" },
                          { value: "2", label: "Exclusive" },
                          { value: "0", label: "No" },
                        ]}
                        clearable
                      />
                    </div>

                    <div className="col-span-12">
                      {hasTax !== "0" && (
                        <Select
                          className="w-full sm:w-auto"
                          placeholder="Select Tax"
                          label="Apply tax to all"
                          searchable
                          clearable
                          data={tax}
                          value={taxId}
                          onChange={setTaxId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-2">
              {/* {!isLoading && !isLoadingFooter && ( */}
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Quotation Items
                      </h3>
                      {/* <label
                          htmlFor="expense_items_tax.0"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >

                        </label> */}
                      <label
                        htmlFor="expense_items_tax.0"
                        className="block text-sm font-medium text-gray-700 text-right"
                      >
                        <AddProductModal />
                        {hasTax !== "0" && <CreateTaxModal />}
                      </label>
                    </div>
                    <div id="estimate_items" className="col-span-12">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                        className="mt-2 add-input"
                      ></div>
                    </div>
                    <div className="col-span-12 flex flex-col space-y-2">
                      {items.map((item, index) => (
                        <Group key={index} spacing="md">
                          <SellablesSelectInput
                            parentValue={`${item.product_id}`}
                            onSellableChange={(value) => {
                              handleItemChange(index, "product", value);
                            }}
                          />
                          {item.product_id === null &&
                            item.product !== "" && ( // Check if product_id is null and a product has been selected
                              <Select
                                placeholder="Category"
                                value={item?.category}
                                data={[
                                  { value: "service", label: "Service" },
                                  { value: "product", label: "Product" },
                                ]}
                                onChange={(value) =>
                                  handleItemChange(index, "category", value)
                                }
                              />
                            )}
                          {/* <Select
                            className="w-full sm:w-auto"
                            placeholder="Select Product/Service"
                            data={[...products]}
                            value={item.product}
                            onChange={(value) =>
                              handleItemChange(index, "product", value)
                            }
                            onSearchChange={setProductFilter}
                            searchValue={productFilter}
                            searchable
                            clearable
                          /> */}
                          {/* <Select
                              className="w-full sm:w-auto"
                              placeholder="Select Product/Service"
                              searchable
                              clearable
                              creatable
                              getCreateLabel={(query) => `+ Create ${query}`}
                              onCreate={(query) => {
                                const newItem = { value: query, label: query };
                                setProducts((current) => [...current, newItem]);
                                return newItem;
                              }}
                              data={products}
                              value={item.product}
                              onChange={(value) =>
                                handleItemChange(index, "product", value)
                              }
                            /> */}
                          <TextInput
                            className="w-full sm:w-auto"
                            placeholder="Description"
                            value={item.description}
                            onChange={(event) =>
                              handleItemChange(
                                index,
                                "description",
                                event.currentTarget.value
                              )
                            }
                          />
                          <TextInput
                            className="w-full sm:w-auto"
                            placeholder="Quantity"
                            defaultValue={1}
                            value={item.quantity}
                            onChange={(event) =>
                              handleItemChange(
                                index,
                                "quantity",
                                event.currentTarget.value
                              )
                            }
                          />
                          <TextInput
                            className="w-full sm:w-auto"
                            placeholder="Price"
                            value={item.price}
                            onChange={(event) =>
                              handleItemChange(
                                index,
                                "price",
                                event.currentTarget.value
                              )
                            }
                          />
                          {hasTax !== "0" && !taxId && (
                            <Select
                              className="w-full sm:w-auto"
                              placeholder="Select Tax"
                              searchable
                              clearable
                              data={tax}
                              value={item.tax}
                              onChange={(value) =>
                                handleItemChange(index, "tax", value)
                              }
                            />
                          )}
                          <Button
                            className="w-full sm:w-auto"
                            variant="outline"
                            color="red"
                            leftIcon={<IconTrash />}
                            onClick={() => handleRemoveItem(index)}
                          >
                            Remove
                          </Button>
                        </Group>
                      ))}
                      <Group position="left" className="mb-5 mt-5">
                        <Button
                          variant="outline"
                          color="primary"
                          onClick={handleAddItem}
                          leftIcon={<Text size="sm">+</Text>}
                        >
                          Add Item
                        </Button>
                        {items.length > 0 && (
                          <>
                            <Badge variant="filled" color="primary">
                              {items.length} item{items.length > 1 ? "s" : ""}
                            </Badge>
                          </>
                        )}
                      </Group>
                    </div>
                    <div className="col-span-12">
                      <Textarea
                        placeholder="Notes"
                        label="Notes"
                        minRows={3}
                        defaultValue={footer?.footer}
                        autosize
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </div>

                    <div className="col-span-12">
                      <Textarea
                        placeholder="Signature"
                        label="Signature"
                        minRows={3}
                        autosize
                        onChange={(event) => setSignature(event.target.value)}
                      />
                    </div>

                    <div className="col-span-12">
                      <div className="px-4 py-3  text-right sm:px-6">
                        <p>
                          Tax Ksh
                          <span name="temp_total_amount">
                            {" "}
                            {totalTax.toFixed(2)}{" "}
                            {/* { totalPrice * 16 / 100 } */}
                          </span>
                        </p>

                        <p>
                          Discount
                          <span name="temp_total_amount"> {discount ?? 0}</span>
                        </p>

                        <h3 className="text-lg mt-2 font-medium leading-6 text-gray-900">
                          Total KSH{" "}
                          <span name="temp_total_amount">
                            {" "}
                            {totalPrice.toFixed(2)}{" "}
                          </span>
                        </h3>
                        <EditFooterModal footer={footer} />
                        <PreviewQuotationModal
                          client={selectedClient}
                          description={description}
                          signature={signature}
                          itemTotalTax={itemTotalTax}
                          totalTax={totalTax}
                          discount={discount}
                          totalPrice={totalPrice}
                        //   merchant={merchant}
                          due={estimateDate}
                          date={dueDate}
                          po={posNumber}
                          items={items}
                        />
                        <Button
                          leftIcon={<IconPlus size={16} />}
                          onClick={() => setOpened(true)}
                          variant="outline"
                          className="mb-2 mt-2"
                        >
                          Add Discount
                        </Button>
                        <Button
                          leftIcon={<IconCircleCheck size={16} />}
                          onClick={handleSubmit}
                          className="mt-2 ml-2"
                          loading={loading}
                          variant="outline"
                        >
                          Create Quotation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Modal
        opened={opened}
        title="Add Discount"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 p-3 rounded-lg">


          <Select
            label="Discount Type"
            placeholder="Discount Type"
            onChange={setDiscountType}
            defaultValue={discountType}
            data={[
              { value: "amount", label: "Cash Amount" },
              { value: "percentage", label: "Percentage" },
            ]}
            clearable
          />

          <TextInput
            placeholder="Discount Amount"
            label="Discount Amount"
            withAsterisk
            defaultValue="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 p-3 rounded-lg ">
          <Button variant="outline" onClick={() => setOpened(false)}>Add Discount</Button>
        </section>
      </Modal>

      </Box>
    </PageContainer>
  );
}
