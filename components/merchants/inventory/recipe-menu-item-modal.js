import { Button, Modal,MultiSelect,NumberInput,Select, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconList } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useRouter } from "next/router";
import {
   fetchExistingComponent,
   updateMenuItemsDetails
   } from "@/store/merchants/inventory/products-slice";
   import { getMenuDetails } from "@/store/merchants/inventory/inventory-slice";
import { set } from "lodash";
import { formatNumber, parseValidFloat } from "@/lib/shared/data-formatters";

function RecipeMenuItem({ RecipeId,ProductId,total_cost,max_qty}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [selling_price, setSellingPrice] = useState();
  const [buying_price, setBuyingPrice] = useState();
  const [quantity_to_manufacture,setManufactureQty] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();


//   const [isUpdating, setIsUpdating] = useState(false);
//  let edit_values=[]

const dataItems = useSelector((state) => state.inventory.getMenuDetails);

// useEffect(() => {

//     if (!accessToken || status !== "authenticated" || !ProductId) {
//         return;
//       }

//       const params = {};
//       params["accessToken"] = accessToken;
//       params["productId"] = product_status=="menus" ? dataItems?.menu_item?.sellable?.id : ProductId;
//       params["branch_id"] = branch_id;
//       params["menuId"] =    ProductId;
//       params["product_status"] =  product_status;
//       if(ProductId || product_status)
//       {

//         store.dispatch(getMenuDetails(params));
//       }
// })

  const product = useSelector(
    (state) => state.products.existingProduct
  );

  const recipes = useSelector(
    (state)=> state.products.recipes
  );


  const handleMaxQtyChange = (e) => {
    setManufactureQty(e);
  }

  const handleSellingPriceChange = (e)  => {
    setSellingPrice(e)
  }

  const handleBuyingPriceChange = (e)  => {
    setBuyingPrice(e)
  }




  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }
  //  console.log("The product id is" + dataItems?.menu_item?.id);
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["recipe_id"] = RecipeId;
    params["quantity_to_manufacture"] = quantity_to_manufacture;
    params["selling_price"] = selling_price;
    params["buying_price"] = buying_price;
    params["productId"] = dataItems?.menu_item?.id;

    if(quantity_to_manufacture>max_qty)
    {
      showNotification({
        title: "Error",
        message: "Quantity  Should Be Less/Equal To Maximum Quantity!",
        color: "red",
      });
      return;
    }

   setIsSubmitting(true)
    try {
      await store.dispatch(updateMenuItemsDetails(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message:
          "RECORD SUCCESSFULLY UPDATED",
        color: "green",
        autoClose: true,
      });
      setIsSubmitting(false)
      setOpened(false)
      router.push(`/merchants/inventory/manufacturings/${dataItems?.menu_item?.id}?status=menus`);
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
      setIsSubmitting(false)
    }
  }





  return (
    <>
      <Modal
        opened={opened}
        title={`Produce ${ dataItems?.menu_item?.name ?? " "} With Recipe ${recipes?.data?.find((val)=>{
          return val?.id==RecipeId
      })?.name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="md"
      >
    <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
    <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 gap-2 overflow-x-auto`}>
      <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        SUGGESTED PRODUCTION COST : Kshs {formatNumber(total_cost)}
      </h4>
      <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        MAXIMUM QUANTITY : {formatNumber(max_qty)}
      </h4>

    </div>


  <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 overflow-x-auto`}>


  <TextInput
      className="w-full sm:w-auto mt-2"
      label="PRODUCTION COST"
      onChange={(e)=>handleBuyingPriceChange(e.currentTarget.value)}
    />
    </div>
    <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 overflow-x-auto`}>


    <TextInput
      className="w-full sm:w-auto mt-2"
      label="Selling Price"
      onChange={(e)=>handleSellingPriceChange(e.currentTarget.value)}
    />
    </div>
    <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 overflow-x-auto`}>

    <NumberInput
      className="w-full sm:w-auto mt-2"
      label="Quantity To Produce"
      precision={2}
      step={0.5}
      onChange={(e)=>handleMaxQtyChange(e)}
    />


  </div>
<div className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}>
  <div className="">

  </div>

  <div className="">
    <Button disabled={isSubmitting ? true : false} type="submit" size="md" onClick={submitDetails}>

      {!isSubmitting && ( <b>SAVE </b>) }
   {isSubmitting && ( <b>Processing......</b>  ) }
    </Button>
  </div>

</div>
        </section>
      </Modal>

      <Button
        leftIcon={<IconList size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
      COMPLETE
      </Button>
    </>
  );
}

export default RecipeMenuItem;
