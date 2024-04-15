import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../../components/ui/layouts/scrolling-table";
import { useState } from "react";
import {
  Button,
  Modal,
  Select,
  TextInput,
  Group,
  Textarea,
  Badge,
  Text,
  Checkbox,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconEye,
  IconTrash,
  IconPlus,
  IconCircleCheck,
} from "@tabler/icons-react";
import Card from "../../../components/ui/layouts/card";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import NewConsignmentModal from "../../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../../src/store/Store";
import {
  formatNumber,
  formatDate,
  getDateFilterFrom,
  getDateFilterTo,
} from "../../../lib/shared/data-formatters";
import Link from "next/link";
import {
  getAllInvoices,
  getAllRequirements,
  getAllTaxes,
  getFooterNote,
} from "../../../src/store/accounts/accounts-slice";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { fetchMyAccountData } from "../../../src/store/access/access-control-slice";
import { fetchClients } from "../../../src/store/partners/clients-slice";
import SellablesSelectInput from "../../../components/accounts/sellables-select-input";
import EditFooterModal from "../../../components/accounts/edit-footer-modal";
import PreviewQuotationModal from "../../../components/accounts/preview-quotation";
import { fetchSellables } from "../../../src/store/transactions/transaction-slice";
import EnterClientModal from "../../../components/partners/enter-client-modal";
import AddProductModal from "../../../components/accounts/add-product-modal";
import CreateTaxModal from "../../../components/accounts/create-tax-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/accounts/invoices",
    title: "Invoices",
  },
  {
    to: "/accounts/invoices/create",
    title: "Create Invoice",
  },
];

export default function CreateInvoice() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");

  //product filter
  const [productFilter, setProductFilter] = useState("");

  //Merchant Account Information
  // const merchant = useSelector((state) => state.accessControl.myAccountData);

  // console.log("Merchant", merchant);

  //
  // useEffect(() => {
  //   if (!session || status !== "authenticated") {
  //     return;
  //   }

  //   const params = {};
  //   params["accessToken"] = session.user.accessToken;
  //   params["branch_id"] = branch_id;

  //   store.dispatch(fetchMyAccountData(params));
  // }, [session, status, branch_id]);
  //
  let [hasTax, setHasTax] = useState("0");
  const [taxId, setTaxId] = useState("");
  const [isProforma, setIsProforma] = useState(false);
  //setDiscountType

  //setClientName //clientPhone //clientEmail
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  //calculate the discount

  //Get Requirements
  const reqStatus = useSelector(
    (state) => state.accounts.getAllRequirementsStatus
  );

  const requirements = useSelector(
    (state) => state.accounts.getAllRequirements
  );

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = reqStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (productFilter) {
      params["filter"] = productFilter;
    }

    store.dispatch(getAllRequirements(params));
  }, [session, status, branch_id, productFilter]);

  console.log(requirements);

  //getFooterNote
  const footerStatus = useSelector(
    (state) => state.accounts.getFooterNoteStatus
  );

  const footer = useSelector((state) => state.accounts.getFooterNote);

  const isLoadingFooter = footerStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getFooterNote(params));
  }, [session, status]);

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

  //Clients
  const clientsList = requirements?.customers;

  const clients =
    clientsList?.map((item) => ({
      value: item.id,
      label: item.id + " | " + item.name,
    })) ?? [];

  //Tax
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
  //
  const [searchValue, onSearchChange] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

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

  // function handleItemChange(index, key, value) {
  //   setItems((prevItems) =>
  //     prevItems.map((item, i) =>
  //       i === index ? { ...item, [key]: value } : item
  //     )
  //   );
  // }

  function handleItemChange(index, key, value) {
    console.log("Monyancha Value", value);
    if (key === "product") {
      const price = value ? value?.sellable?.cost : 0;
      const productId = value?.sellable?.id;
      const tax_method = value?.sellable?.tax_method;
      const tax_rate = value?.sellable?.tax?.rate;

      const newCost = (16 * price) / 100;

      console.log(
        "Selected Tax Method: " +
          tax_method +
          " Tax Rate: " +
          tax_rate +
          " Product Details: " +
          value
      );
      console.log("New Cost: ", newCost);

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
    setDiscount("");
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

  //Calculations
  const calculateTotal = () => {
    let totalTax = 0;
    let totalPrice = 0;

    items.forEach((item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemTax = item.tax || taxId || "0_percentage";
      // const itemTax = taxId || "0_percentage";
      const itemQuantity = parseInt(item.quantity) || 1; // Default quantity is 1

      console.log("Item Tax Type", itemTax);

      let itemTotalPrice = itemPrice * itemQuantity;
      let itemTotalTax = 0;

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

    // Deduct the discount from the total price
    // if (discountType === "amount") {
    //   totalPrice -= parseInt(discount);
    // } else if (discountType === "percentage") {
    //   totalPrice *= 1 - parseInt(discount) / 100;
    // }

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

  const { totalTax, totalPrice, totalDiscount } = calculateTotal();

  // useEffect(() => {
  //   if (!session || status !== "authenticated") {
  //     return;
  //   }

  //   setDiscount(totalDiscount)
  // }, [session, status, totalDiscount]);

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
    formdata.append("invoice_date", formattedEstimateDate);
    formdata.append("due_date", formattedDueDate);
    formdata.append("has_tax", hasTax);
    formdata.append("is_proforma", isProforma ? 1 : 0);
    items.forEach((item) => {
      formdata.append("product_id[]", item.product_id);
      formdata.append("sellable_id[]", item.sellable_id);
      formdata.append("name[]", item.product);
      formdata.append("category[]", item.category);
      formdata.append("name_description[]", item.description);
      formdata.append("quantity[]", item.quantity);
      formdata.append("price[]", item.price);
      // if (hasTax !== "1") {
      //   item.tax = "0_none";
      // }
      formdata.append("tax[]", item.tax || taxId);
      formdata.append("tax_id[]", "");
    });
    formdata.append("kra_pin", "");
    formdata.append("discount", totalDiscount);
    formdata.append("branch_id", branch_id);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/store`;

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
          message: "Invoice created Successfully",
          color: "green",
        });
        setLoading(false);
        router.push("/accounts/invoices");
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
      <Breadcrumb title="Invoices" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        {/* <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            <Button size="sm" variant="outline">
              Back
            </Button>
          </div>
        </header> */}

        <main className="w-full flex-grow">
          <div className="w-full mt-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                  <p className="mt-1 text-sm text-gray-500">
                    You can create an Invoice for an existing customer or add
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
                          {/* <NewClientModal /> */}
                          <EnterClientModal onCreateClient={onCreateClient} />
                        </div>
                      </div>
                      {clientId && (
                        <div className="mt-2">
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
                        </div>
                      )}
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
                        name="po_number"
                      />
                    </div>

                    <div className="col-span-12">
                    <DatePickerInput
                    withAsterisk
                      placeholder="Invoice Date"
                      label="Invoice Date"
                      icon={<IconCalendar size={16} />}
                      onChange={setEstimateDate}
                      name="invoice_date"
                    />
                  </div>

                  <div className="col-span-12">
                    <DatePickerInput
                    withAsterisk
                      placeholder=" Invoice Valid Until"
                      label=" Invoice Valid Until"
                      icon={<IconCalendar size={16} />}
                      onChange={setDueDate}
                      name="due_date"
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

                    <div className="col-span-12 mt-2">
                      <Checkbox
                        label="Is Pro-forma"
                        description="Is this invoice a pro-forma invoice?"
                        checked={isProforma}
                        onChange={(e) => setIsProforma(e.currentTarget.checked)}
                      />
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
                        Invoice Items
                      </h3>
                      <label
                        htmlFor="expense_items_tax.0"
                        className="block text-sm font-medium text-gray-700 text-right"
                      >
                        <AddProductModal />
                        {hasTax === "1" && <CreateTaxModal />}
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
                          <TextInput
                            className="w-full sm:w-auto"
                            placeholder="Description"
                            value={item.description}
                            name="description"
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
                            name="quantity"
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
                            name="price"
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
                        name="notes"
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
                          <span name="temp_total_amount">
                            {" "}
                            {totalDiscount ?? 0}{" "}
                          </span>
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
                          totalTax={totalTax}
                          discount={discount}
                          totalPrice={totalPrice}
                          //merchant={merchant}
                          due={estimateDate}
                          date={dueDate}
                          po={posNumber}
                          items={items}
                        />
                        <Button
                          leftIcon={<IconPlus size={16} />}
                          onClick={() => setOpened(true)}
                          variant="outline"
                        >
                          Add Discount
                        </Button>
                        <Button
                          leftIcon={<IconCircleCheck size={16} />}
                          className="ml-2 mt-2"
                          onClick={handleSubmit}
                          loading={loading}
                          variant="outline"
                        >
                          Create Invoice
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
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <span className="text-dark text-sm font-bold">
              Discount Information
            </span>

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

          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button variant="outline" onClick={() => setOpened(false)}>
              Add Discount
            </Button>
          </section>
        </Modal>
      </Box>
    </PageContainer>
  );
}
