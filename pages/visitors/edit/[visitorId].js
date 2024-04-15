import { useRouter } from "next/router";
import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
  Checkbox,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import CreateTaxModal from "../../../components/accounts/create-tax-modal";
import { useMantineTheme } from "@mantine/core";
import { IconTrash, IconPlus, IconCircleCheck, IconEye } from "@tabler/icons-react";
import { getAllRequirements } from "../../../src/store/accounts/accounts-slice";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import EnterClientModal from "../../../components/partners/enter-client-modal";
import {
  formatDate,
  parseValidInt,
} from "../../../lib/shared/data-formatters";
import { getAllTaxes } from "../../../src/store/accounts/accounts-slice";
import { getFooterNote } from "../../../src/store/accounts/accounts-slice";
import EditFooterModal from "../../../components/accounts/edit-footer-modal";
import PreviewQuotationModal from "../../../components/accounts/preview-quotation";
import AddProductModal from "../../../components/accounts/add-product-modal";
import { fetchMyAccountData } from "../../../src/store/access/access-control-slice";
import { fetchClients } from "../../../src/store/accounts/accounts-slice";
import SellablesSelectInput from "../../../components/accounts/sellables-select-input";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/visitors",
    title: "Visitors",
  },
  {
    title: "Edit Visitor",
  },
];

function EditVisitor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const visitorId = router.query?.visitorId ?? null;


  //product filter
  // const [productFilter, setProductFilter] = useState("");

  //Merchant Account Information
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

  //   store.dispatch(fetchMyAccountData(params));
  // }, [session, status]);

  //Oncreate product

  //Get Requirements
  // const reqStatus = useSelector(
  //   (state) => state.accounts.getAllRequirementsStatus
  // );

  // const requirements = useSelector(
  //   (state) => state.accounts.getAllRequirements
  // );

  const isLoading = reqStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;


    store.dispatch(getAllRequirements(params));
  }, [session, status]);

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

  // console.log("Footer Note", footer);

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
  const taxList = useSelector((state) => state.accounts.getAllTaxes);

  console.log("Tax List", taxList);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getAllTaxes(params));
  }, [session, status]);

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

  const [products, setProducts] = useState([]);

  //Products
  // const productsList = requirements?.products?.data;
  const productsList = requirements?.products;

  useEffect(() => {
    const productsData =
      productsList?.data?.map((item) => ({
        value: item?.sellable?.name,
        label: "" + item.sellable?.name,
      })) ?? [];

    if (!productsData) {
      return;
    }

    setProducts(productsData);
  }, [productsList]);

  const [loading, setLoading] = useState(false);

  const invoice = useSelector((state) =>
    state.accounts?.getAllInvoices?.invoices?.data?.find(
      (item) => item.id == invoiceId
    )
  );

  console.log("Invoice Data Monyancha", invoice);

  const invoiceLoaded = useSelector(
    (state) => state.accounts?.getAllInvoicesStatus === "fulfilled"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!invoiceLoaded) {
      router.replace("/accounts/invoices");
    }
  }, [invoiceLoaded, router]);

  //Due Date
  const dueDateString = invoice?.due_date;
  const expiryDate = new Date(Date.parse(dueDateString));

  //Invoice Date
  const invoiceDateString = invoice?.invoice_date;
  const invoiceDate = new Date(Date.parse(invoiceDateString));

  const parsedItems = invoice?.invoice_items
    ? JSON.parse(invoice?.invoice_items)
    : [];

  const updatedItems = parsedItems?.map((item) => {
    return {
      product: item.name, // assuming you need to set both label and value for the `Select` component
      product_id: item.product_id,
      sellable_id: item.product_id,
      description: item.desc ?? "",
      quantity: item.quantity,
      price: item.price,
      tax: item.tax + "_" + item.tax_type, // assuming you need to set both label and value for the `Select` component
    };
  });

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
  const [clientId, setClientId] = useState(invoice?.client_id);
  const [posNumber, setPosNumber] = useState(invoice?.pos_number ?? "");
  const [description, setDescription] = useState(
    footer?.footer ?? invoice?.description
  );
  const [signature, setSignature] = useState(invoice?.signature ?? "");
  const [estimateDate, setEstimateDate] = useState(invoiceDate);
  const [dueDate, setDueDate] = useState(expiryDate);
  let [hasTax, setHasTax] = useState(invoice?.has_tax.toString());
  const [taxId, setTaxId] = useState("");
  const [isProforma, setIsProforma] = useState(invoice?.is_proforma);
  const [discount, setDiscount] = useState(
    parseValidInt(invoice?.discount ?? 0)
  );
  //
  const [searchValue, onSearchChange] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  useEffect(() => {
    setItems(updatedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //
  console.log("Has Tax Id", hasTax);
  console.log("Updated Items", updatedItems);
  // console.log(clientId);

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

      setOptions(results);
    } catch (error) {
      console.error(error);
      setOptions([]);
    }
  };

  function handleItemChange(index, key, value) {
    if (key === "product") {
      const price = value ? value?.sellable?.cost : 0;
      const productId = value?.sellable?.id;

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
    setDiscount(null);
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
      const itemQuantity = parseInt(item.quantity) || 1; // Default quantity is 1

      console.log("Item Tax Type", itemTax);

      let itemTotalPrice = itemPrice * itemQuantity;
      let itemTotalTax = 0;

      // if (hasTax === "exclusive") {
      //   if (itemTax.endsWith("_fixed")) {
      //     // If item tax is a fixed amount
      //     const fixedTax = parseFloat(itemTax.replace("_fixed", ""));
      //     if (itemTotalPrice < fixedTax) {
      //       // Item price is less than fixed tax
      //       const taxPercentage = parseFloat(itemTax.replace("%", "")) / 100;
      //       itemTotalTax = itemTotalPrice * taxPercentage; // Use the specified tax percentage or 0%
      //     } else {
      //       // Item price is greater than or equal to fixed tax
      //       itemTotalTax = fixedTax;
      //     }
      //   } else {
      //     // Assume item tax is a percentage (e.g. "16%")
      //     const taxPercentage = parseFloat(itemTax.replace("%", "")) / 100;
      //     if (taxPercentage === 0.16) {
      //       // Check if tax type is 16%
      //       const taxableAmount = itemTotalPrice;
      //       const taxAmount =
      //         (taxPercentage * taxableAmount) / (taxPercentage + 1);
      //       itemTotalTax = taxAmount;
      //     } else {
      //       itemTotalTax = itemTotalPrice * taxPercentage; // For other taxes, just use the specified tax percentage or 0%
      //     }
      //   }
      // }

      // totalPrice += itemTotalPrice;
      // totalTax += itemTotalTax;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formdata = new URLSearchParams();
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
      formdata.append("sellable_id[]", item.product_id);
      formdata.append("name[]", item.product);
      formdata.append("name_description[]", item.description);
      formdata.append("category[]", item.category);
      formdata.append("quantity[]", item.quantity);
      formdata.append("price[]", item.price);

      // if (hasTax !== "1") {
      //   item.tax = "0_none";
      // }

      formdata.append("tax[]", taxId || item.tax);
      formdata.append("tax_id[]", "");
    });

    formdata.append("discount", totalDiscount);
    formdata.append("kra_pin", "");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/invoices/update/${invoiceId}`;

    const accessToken = session.user.accessToken;

    const response = fetch(endpoint, {
      method: "PATCH",
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
          message: "Invoice updated Successfully",
          color: "green",
        });
        setLoading(false);
        router.push("/accounts/invoices");
        clearForm();
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

  const onCreateClient = (newClient) => {
    setClientId(newClient?.id);
    setClientName(newClient?.name);
    setClientPhone(newClient?.phone);
    // setClientEmail(newClient?.email);
  };

  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Edit Invoice" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>


      <main className="w-full flex-grow">
        <div className="w-full mt-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <p className="mt-1 text-sm text-gray-500">
                  You can edit an Invoice for an existing customer or add the
                  customer first
                </p>
                <div className="col-span-4 sm:col-span-4">
                  <div className="flex flex-col items-left">
                    <div className="w-full md:w-1/2 flex flex-col items-center">
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
                        <p>ID: #{clientId}</p>
                        <p>Client Name : {selectedClient?.name}</p>
                        <p>Client Phone : {selectedClient?.phone}</p>
                        <p>Client Email : {selectedClient?.email}</p>
                      </div>
                    )}
                    {/* {invoice && (
                      <div className="mt-2">
                        <p>ID: #{invoice?.client_id}</p>
                        <p>Name: {invoice?.client_name}</p>
                        <p>Phone: {invoice?.client_phone}</p>
                        <p>Email: {invoice?.client_email}</p>
                      </div>
                    )} */}
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
                      defaultValue={posNumber}
                    />
                  </div>

                  <div className="col-span-12">
                    <DatePickerInput
                      placeholder="Invoice Date"
                      label="Invoice Date"
                      icon={<IconCalendar size={16} />}
                      onChange={setEstimateDate}
                      defaultValue={estimateDate}
                    />
                  </div>

                  <div className="col-span-12">
                    <DatePickerInput
                      placeholder=" Invoice Valid Until"
                      label=" Invoice Valid Until"
                      icon={<IconCalendar size={16} />}
                      onChange={setDueDate}
                      defaultValue={dueDate}
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
            {!isLoading && !isLoadingFooter && (
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Items
                      </h3>
                      <label
                        htmlFor="expense_items_tax.0"
                        className="block text-sm font-medium text-gray-700 text-right"
                      >
                        {!editItem && (
                          <>
                            <AddProductModal />
                            {hasTax === "1" && <CreateTaxModal />}
                          </>
                        )}
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
                            parentOption={{
                              value: `${item.product_id}`,
                              label: item?.product,
                            }}
                            onSellableChange={(value) => {
                              handleItemChange(index, "product", value);
                            }}
                          />

                          {/* {item.product_id === null &&
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
                            )} */}

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
                          {!editItem && (
                            <Button
                              className="w-full sm:w-auto"
                              variant="outline"
                              color="red"
                              leftIcon={<IconTrash />}
                              onClick={() => handleRemoveItem(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </Group>
                      ))}
                      <Group position="left" className="mb-5 mt-5">
                        {!editItem && (
                          <Button
                            variant="outline"
                            color="primary"
                            onClick={handleAddItem}
                            leftIcon={<Text size="sm">+</Text>}
                          >
                            Add Item
                          </Button>
                        )}
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
                        autosize
                        onChange={(event) => setDescription(event.target.value)}
                        defaultValue={description || (footer && footer.footer)}
                      />
                    </div>

                    <div className="col-span-12">
                      <Textarea
                        placeholder="Signature"
                        label="Signature"
                        minRows={3}
                        autosize
                        onChange={(event) => setSignature(event.target.value)}
                        defaultValue={signature}
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
                            {totalDiscount ?? 0}
                          </span>
                        </p>

                        <h3 className="text-lg mt-2 font-medium leading-6 text-gray-900">
                          Total KSH{" "}
                          <span name="temp_total_amount">
                            {" "}
                            {totalPrice.toFixed(2)}{" "}
                          </span>
                        </h3>
                        {!editItem && (
                          <>
                            <EditFooterModal footer={footer} />
                            <PreviewQuotationModal
                              quotation={invoice}
                              description={description}
                              signature={signature}
                              totalTax={totalTax}
                              discount={discount}
                              totalPrice={totalPrice}
                              // merchant={merchant}
                              due={estimateDate}
                              date={dueDate}
                              po={posNumber}
                              items={items}
                            />
                            <Button
                              onClick={() => setOpened(true)}
                              variant="outline"
                              leftIcon={<IconPlus size={16} />}
                            >
                              Add Discount
                            </Button>

                            <Button
                              className="ml-2 mt-2"
                              onClick={handleSubmit}
                              loading={loading}
                              variant="outline"
                              leftIcon={<IconCircleCheck size={16} />}
                            >
                              Update Invoice
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                <StatelessLoadingSpinner />
              </div>
            )}
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
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button variant="outline" onClick={() => setOpened(false)}>Add Discount</Button>
        </section>
      </Modal>
      </Box>
    </PageContainer>
  );
}

export default EditVisitor;
