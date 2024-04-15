import { Button, Modal,TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useRouter } from "next/router";
import {
   submitEditExpense,
   fetchExistingExpenses
   } from "@/store/merchants/inventory/products-slice";


function EditExpense({ edit_expenses }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const ProductId = router.query?.ProductId ?? null;
  const product_status = router.query?.status ?? null;


  const product = useSelector(
    (state) => state.products.existingProduct
  );

  const dataItems = useSelector((state) => state.inventory.getMenuDetails);



  const product_id =
  product_status !== "menus" ? ProductId : dataItems?.menu_item?.id;






 let edit_values=[]
  edit_expenses?.map((value)=>{
    edit_values?.push({
      id:value?.id,
      name: value?.name,
      quantity: value?.quantity,
      cost:value?.cost
    })
  })

  const [edit_product_expenses, setEditExpense] = useState(edit_values);



  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

  }, [session, status]);


  const handleExpenseNameEdit = (e, index) => {
    let data = [...edit_product_expenses];
    data[index]["name"] = e;
    setEditExpense(data);
    console.log(edit_product_expenses);

  }

  const handleExpenseQtyEdit = (e, index) => {
    let data = [...edit_product_expenses];
    data[index]["quantity"] = e;
    setEditExpense(data);

  }

  const handleExpenseCostEdit = (e, index) => {
    let data = [...edit_product_expenses];
    data[index]["cost"] = e;
    setEditExpense(data);

  }




  const dispatch = useDispatch();
  async function submitDetails() {
    // if (!session || status !== "authenticated" || isSubmitting) {
    //   return;
    // }

    setIsUpdating(true);

    const params = {};

    params["accessToken"] = session.user.accessToken;
    params["product_expenses"] = edit_product_expenses;
    params["productId"] = product_id;


    try {

      await dispatch(submitEditExpense(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Expense Updated Successfully",
        color: "green",
      });

      dispatch(fetchExistingExpenses(params));
      setIsUpdating(false);
      setOpened(false)

    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      }
      else {
        message = "Could not update record";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title={`Edit Expense For ${product?.name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="auto"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
        { edit_product_expenses && edit_product_expenses?.length > 0 &&
     (
        <div className={`grid grid-flow-col md:grid-flow-row grid-cols-3 gap-2 overflow-x-auto`}>
        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        Expense Name
        </h4>
        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
          Quantity
        </h4>

        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
          Cost
        </h4>
     </div>
     )
     }

       {edit_product_expenses?.map((item,index)=>(
         <div className={`grid grid-flow-col md:grid-flow-row grid-cols-3 gap-2 overflow-x-auto`} key={index}>
         <TextInput
        className="w-full sm:w-auto mt-2"

        onChange={(e)=>handleExpenseNameEdit(e.currentTarget.value,index)}
        defaultValue={item.name}
      />
      <TextInput
        className="w-full sm:w-auto mt-2"

        onChange={(e)=>handleExpenseQtyEdit(e.currentTarget.value,index)}
        defaultValue={item.quantity}
      />
      <TextInput
        className="w-full sm:w-auto mt-2"

        onChange={(e)=>handleExpenseCostEdit(e.currentTarget.value,index)}
        defaultValue={item.cost}
      />

        </div>

       ))}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} disabled ={isUpdating ? true : false}>
           {!isUpdating && ( <b>UPDATE </b>) }
           {isUpdating && ( <b>UPDATING......</b>  ) }
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPencil size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Edit
      </Button>
    </>
  );
}

export default EditExpense;
