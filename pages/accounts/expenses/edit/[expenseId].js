import { Box, TableContainer } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "../../../../src/store/Store";
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
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";
import { IconTrash, IconCircleCheck } from "@tabler/icons-react";

import CreateExpenseTypeModal from "../../../../components/accounts/create-expense-type";
import { getExpenseTypes } from "../../../../src/store/accounts/accounts-slice";
import PreviewQuotationModal from "../../../../components/accounts/preview-quotation";
import ExpenseStatusSelect from "../../../../components/accounts/expense-status-select";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/accounts/expenses",
    title: "Expenses",
  },
  {
    title: "Edit Expense",
  },
];

function EditExpense() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const expenseId = router.query?.expenseId ?? null;
  const [loading, setLoading] = useState(false);

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

  //Get ExpenseTypes
  const reqStatus = useSelector(
    (state) => state.accounts.getExpenseTypesStatus
  );

  const requirements = useSelector((state) => state.accounts.getExpenseTypes);

  const isLoading = reqStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getExpenseTypes(params));
  }, [session, status]);

  console.log(requirements);

  //Expenses

  const [products, setProducts] = useState([]);

  const productsList = requirements;

  useEffect(() => {
    const productsData =
      productsList?.map((item) => ({
        value: item?.type,
        label: "" + item?.type,
      })) ?? [];

    if (!productsData) {
      return;
    }

    setProducts(productsData);
  }, [productsList]);

  // const products =
  //   requirements?.map((item) => ({
  //     value: item?.type.toString(),
  //     label: "" + item?.type,
  //   })) ?? [];

  const invoice = useSelector((state) =>
    state.accounts?.getAllExpenses?.expenses?.data?.find(
      (item) => item.id == expenseId
    )
  );

  // console.log("Current Expense", invoice);

  const invoiceLoaded = useSelector(
    (state) => state.accounts?.getAllExpensesStatus === "fulfilled"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!invoiceLoaded) {
      router.replace("/accounts/expenses");
    }
  }, [invoiceLoaded, router]);

  //
  const parsedItems = invoice?.items ? JSON.parse(invoice?.items) : [];

  const updatedItems = parsedItems?.map((item) => {
    return {
      product: item.name, // assuming you need to set both label and value for the `Select` component
      description: item.desc,
      quantity: item.quantity ?? 1,
      price: item.price,
    };
  });

  //Invoice Date
  const invoiceDateString = invoice?.expense_date;
  const invoiceDate = new Date(Date.parse(invoiceDateString));

  //UseStates
  const [items, setItems] = useState([
    { product: "", description: "", quantity: 1, price: "" },
  ]);
  const [posNumber, setPosNumber] = useState(invoice?.pos_number ?? "");
  const [description, setDescription] = useState(invoice?.description ?? "");
  const [signature, setSignature] = useState(invoice?.signature ?? "");
  const [estimateDate, setEstimateDate] = useState(invoiceDate ?? "");
  const [expenseStatus, setExpenseStatus] = useState(
    invoice?.approval_status ?? "pending"
  );
  const [paymentMethod, setPaymentMethod] = useState(
    invoice?.payment_method ?? ""
  );

  useEffect(() => {
    setItems(updatedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleItemChange(index, key, value) {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  }

  function handleAddItem() {
    setItems((prevItems) => [
      ...prevItems,
      { product: "", description: "", quantity: 1, price: "" },
    ]);
  }

  function handleRemoveItem(index) {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }

  function clearForm() {
    setPosNumber("");
    setDescription("");
    setSignature("");
    setEstimateDate("");
  }

  const dateObj = new Date(estimateDate);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const formattedEstimateDate = `${year}-${month}-${day}`;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formdata = new URLSearchParams();
    formdata.append("pos_number", posNumber);
    formdata.append("description", description);
    formdata.append("signature", signature);
    formdata.append("expense_date", formattedEstimateDate);
    formdata.append("approval_status", expenseStatus);
    formdata.append("payment_method", paymentMethod);
    items.forEach((item) => {
      formdata.append("name[]", item.product);
      formdata.append("name_description[]", item.description);
      formdata.append("quantity[]", item.quantity ?? 1);
      formdata.append("price[]", item.price);
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/expenses/update/${expenseId}`;

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
          message: "Expense updated Successfully",
          color: "green",
        });
        setLoading(false);
        router.push("/accounts/expenses");
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

  const handleSaveExpenseType = async (newItem) => {
    setLoading(true);

    const formdata = new FormData();
    formdata.append("expense_type", newItem.value);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/expenses/create-expense-type`;

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
          message: "Expense type created Successfully",
          color: "green",
        });
        setLoading(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getExpenseTypes(params));
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

  //Calculations
  const TAX_PERCENTAGE = 0;

  const calculateTotal = () => {
    let totalTax = 0;
    let totalPrice = 0;

    items.forEach((item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemTax = parseFloat(item.tax) || 0;
      const itemQuantity = parseInt(item.quantity) || 1; // Default quantity is 1

      const itemTotalPrice = itemPrice * itemQuantity;
      const itemTotalTax = itemTax
        ? (itemTotalPrice * itemTax) / 100
        : (itemTotalPrice * TAX_PERCENTAGE) / 100;

      totalPrice += itemTotalPrice;
      totalTax += itemTotalTax;
    });

    totalPrice += totalTax;

    return { totalTax, totalPrice };
  };

  const { totalTax, totalPrice } = calculateTotal();


  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Expenses" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <main className="w-full flex-grow">
        <div className="w-full mt-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <h2>Edit Expense</h2>
                <p className="mt-1 text-sm text-gray-500">
                  You can create a new expense type or select from the existing
                  expense types.
                </p>
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
                      placeholder="Expense Date"
                      label="Expense Date"
                      icon={<IconCalendar size={16} />}
                      onChange={setEstimateDate}
                      defaultValue={estimateDate}
                    />
                  </div>

                  <div className="col-span-12">
                    <Select
                      placeholder="Payment Method"
                      label="Payment Method"
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      data={[
                        { value: "mpesa", label: "M-Pesa" },
                        { value: "cash", label: "Cash" },
                        { value: "visa", label: "Visa/Mastercard" },
                        { value: "credit", label: "Credit" },
                        { value: "cheque", label: "Cheque" },
                        { value: "bank_transfer", label: "Bank Transfer" },
                      ]}
                      searchable
                      clearable
                    />
                  </div>
                  <div className="col-span-12">
                    <ExpenseStatusSelect
                      value={expenseStatus}
                      onChange={setExpenseStatus}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-2">
            <div className="md:grid md:grid-cols-2 md:gap-6">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Items
                    </h3>
                    <label
                      htmlFor="expense_items_tax.0"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      <CreateExpenseTypeModal />
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
                        {/* <Select
                          className="w-full sm:w-auto"
                          placeholder="Select Expense Type"
                          searchable
                          clearable
                          data={products}
                          value={item.product}
                          onChange={(value) =>
                            handleItemChange(index, "product", value)
                          }
                        /> */}

                        <Select
                          className="w-full sm:w-auto"
                          placeholder="Select Product/Service"
                          searchable
                          clearable
                          creatable
                          getCreateLabel={(query) =>
                            `+ Create ${query} Expense`
                          }
                          onCreate={(query) => {
                            const newItem = { value: query, label: query };
                            setProducts((current) => [...current, newItem]);
                            handleSaveExpenseType(newItem); // Save item to database
                            return newItem;
                          }}
                          data={products}
                          value={item.product}
                          onChange={(value) =>
                            handleItemChange(index, "product", value)
                          }
                        />

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
                      autosize
                      onChange={(event) => setDescription(event.target.value)}
                      defaultValue={description}
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
                      <h3 className="text-lg mt-2 font-medium leading-6 text-gray-900">
                        Total KSH{" "}
                        <span name="temp_total_amount">
                          {" "}
                          {totalPrice.toFixed(2)}{" "}
                        </span>
                      </h3>
                      <PreviewQuotationModal
                        quotation={invoice}
                        description={description}
                        signature={signature}
                        totalTax={totalTax}
                        totalPrice={totalPrice}
                        due={estimateDate}
                        po={posNumber}
                        items={items}
                      />
                      <Button
                        leftIcon={<IconCircleCheck size={16} />}
                        className="mt-2"
                        onClick={handleSubmit}
                        loading={loading}
                        variant="outline"
                      >
                        Update Expense
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </Box>
    </PageContainer>
  );
}

export default EditExpense;
