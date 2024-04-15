import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import {
   submitEditComponent,
   fetchExistingComponent
   } from "@/store/merchants/inventory/products-slice";
import { set } from "lodash";

function EditComponent({ components,recipe_id }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
 let edit_values=[]
  components.data.map((value)=>{
    edit_values?.push({
      id:value?.sellable?.id,
      quantity:value?.product_components[0]?.quantity,
      wastage:value?.product_components[0]?.wastage_percentage,
      cost:value?.sellable?.buying_price,
      component_id:value?.product_components[0]?.id
    })
  })

  const [edit_product_components, setEditProductComponents] = useState(edit_values);


  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

  }, [session, status]);

  const products = useSelector((state) => state.products.getProducts);

  const handleQty = (e,index) => {
    let data = [...edit_values];
    data[index]["quantity"] = e;
     setEditProductComponents(data);
  }

  const handleWastageChange = (e,index) => {
    let data = [...edit_values];
    data[index]["wastage"] = e;
    setEditProductComponents(data);
  }

  const product = useSelector(
    (state) => state.products.existingProduct
  );



  const isSubmitting = useSelector(
    (state) => state.branches.EditSubmissionStatus == "loading"
  );

  const dispatch = useDispatch();
  async function submitDetails() {
    // if (!session || status !== "authenticated" || isSubmitting) {
    //   return;
    // }

    setIsUpdating(true);

    const params = {};

    params["accessToken"] = session.user.accessToken;
    params["product_components"] = edit_product_components;
    params["productId"] = product?.sellable?.id;
    params["recipe_id"] = recipe_id;


    try {
      await dispatch(submitEditComponent(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Ingredients details updated successfully",
        color: "green",
      });

      dispatch(fetchExistingComponent(params));
      setIsUpdating(false);
      setOpened(false)

    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
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
        title={`Edit Components`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="auto"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Edit Components
          </span>
          { components?.data && components?.data?.length > 0 &&
     (
        <div className={`grid grid-flow-col md:grid-flow-row grid-cols-4 gap-2 overflow-x-auto`}>
        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
          Ingredients/Components
        </h4>
        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
          Quantity To Deduct
        </h4>
        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
          Wastage
        </h4>
        <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
          Cost(Buying Price)
        </h4>
     </div>
     )
     }
       {components?.data?.map((item,index)=>(
         <div className={`grid grid-flow-col md:grid-flow-row grid-cols-4 gap-2 overflow-x-auto`} key={index}>

         <TextInput
                     className="w-full sm:w-auto mt-2"
                     placeholder="Ingredient"

                      defaultValue={item?.sellable?.name}
                     disabled
                   />
                   <TextInput
                     className="w-full sm:w-auto mt-2"
                     placeholder="Quantity"
                     defaultValue={item?.product_components[0]?.quantity}
                     onChange={(e)=>handleQty(e.currentTarget.value,index)}
                     rightSection={products?.data?.find((y) => y?.sellable?.id===item?.sellable?.id)?.unit?.name ?? ""}
                   />
                    <TextInput
                     className="w-full sm:w-auto mt-2"
                     placeholder="Wastage"
                     defaultValue={item?.product_components[0]?.wastage_percentage}
                     onChange={(e)=>handleWastageChange(e.currentTarget.value,index)}
                   />
                    <TextInput
                     className="w-full sm:w-auto mt-2"
                     placeholder="Cost"
                      defaultValue={item?.sellable?.buying_price}
                     disabled
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

export default EditComponent;
