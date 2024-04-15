import { Button, Modal, MultiSelect, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconLadder } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import {
  submitProductComponent,
  fetchExistingProduct,
  getProducts,
  fetchExistingExpenses,
} from "@/store/merchants/inventory/products-slice";
import { set } from "lodash";

function AddOtherExpense({ ProductId, menus, product_status }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [selected_product, setProduct] = useState();
  const [product_components, setProductComponents] = useState([]);
  const [other_expenses, setOtherExpenses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   const [isUpdating, setIsUpdating] = useState(false);
  //  let edit_values=[]
  const products = useSelector((state) => state.products.getProducts);

  const product = useSelector((state) => state.products.existingProduct);

  let set_products = [];

  const productsData =
    products?.data
      ?.filter((val) => val.id != ProductId)
      .map((item) => ({
        value: item?.sellable?.id,
        label: item?.name,
      })) ?? [];
  const loadedId = product?.id ?? null;

  const addExpense = (e) => {
    let data = [...other_expenses];
    setProduct(e);
    data.push({
      name: "",
      quantity: "",
      cost: "",
    });

    setOtherExpenses(data);
  };

  const handleExpenseName = (e, index) => {
    let data = [...other_expenses];
    data[index]["name"] = e;
    setOtherExpenses(data);
    console.log(data);
  };

  const handleExpenseQuantity = (e, index) => {
    let data = [...other_expenses];
    data[index]["quantity"] = e;
    setOtherExpenses(data);
    console.log(data);
  };

  const handleExpenseCost = (e, index) => {
    let data = [...other_expenses];
    data[index]["cost"] = e;
    setOtherExpenses(data);
    console.log(data);
  };
  const removeExpense = (index) => {
    let data = [...other_expenses];
    data.splice(index, 1);
    setOtherExpenses(data);
  };

  //   const handleQuantityChange = (e, index) => {
  //     let data = [...product_components];
  //     data[index]["quantity"] = e;
  //     setProductComponents(data);
  //     console.log(data);
  //   }

  //   const handleWastageChange = (e, index) => {
  //     let data = [...product_components];
  //     data[index]["wastage"] = e;
  //     setProductComponents(data);
  //     console.log(data);
  //   }

  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    // params["product_components"] = product_components;
    params["other_expenses"] = other_expenses;
    params["productId"] = ProductId;

    setIsSubmitting(true);
    try {
      await store.dispatch(submitProductComponent(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message: "Expense Successfully Added",
        color: "green",
        autoClose: true,
      });

      setProductComponents([]);
      //   store.dispatch(fetchExistingComponent(params));
      store.dispatch(fetchExistingExpenses(params));
      setIsSubmitting(false);
      setOpened(false);
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });

      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title={`Add Expenses`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="100%"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <div
            className={`mt-2 mb-2 grid grid-flow-col content-center md:grid-flow-row grid-cols-3 overflow-x-auto`}
          >
            <button
              onClick={addExpense}
              className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Other Expense
            </button>
          </div>

          {other_expenses?.length > 0 &&
            other_expenses?.map((it, index) => (
              <div
                className={`grid grid-flow-col md:grid-flow-row grid-cols-3 gap-2 overflow-x-auto`}
                key={index}
              >
                <TextInput
                  className="w-full sm:w-auto mt-2"
                  placeholder="Expense Name"
                  onChange={(e) =>
                    handleExpenseName(e.currentTarget.value, index)
                  }
                />
                <TextInput
                  className="w-full sm:w-auto mt-2"
                  placeholder="Quantity"
                  onChange={(e) =>
                    handleExpenseQuantity(e.currentTarget.value, index)
                  }
                />
                <div
                  className={`grid grid-flow-col md:grid-flow-row grid-cols-2  overflow-x-auto`}
                >
                  <TextInput
                    className="w-full sm:w-auto mt-2"
                    placeholder="Cost"
                    onChange={(e) =>
                      handleExpenseCost(e.currentTarget.value, index)
                    }
                  />
                  <i
                    onClick={() => removeExpense(index)}
                    className="text-red-800 font-bold px-2 cursor-pointer mt-4"
                  >
                    X
                  </i>
                </div>
              </div>
            ))}

          <div
            className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}
          >
            <div className=""></div>
            {other_expenses?.length > 0 && (
              <div className="">
                <Button
                  disabled={isSubmitting ? true : false}
                  type="submit"
                  size="md"
                  onClick={submitDetails}
                >
                  {!isSubmitting && <b>SAVE </b>}
                  {isSubmitting && <b>SAVING......</b>}
                </Button>
              </div>
            )}
          </div>
        </section>
      </Modal>

      <Button

        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        className="px-1 py-1 mr-1"
      >
        Other Expense
      </Button>
    </>
  );
}

export default AddOtherExpense;
