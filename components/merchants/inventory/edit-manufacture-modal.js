import { Button, Modal,MultiSelect,NumberInput,Select, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconList } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useRouter } from "next/router";
import {
   submitEditManufacturing,
   fetchExistingManufacturings
   } from "@/store/merchants/inventory/products-slice";
import { set } from "lodash";
import { formatNumber, parseValidFloat } from "@/lib/shared/data-formatters";

function EditManufacture({ manufacture,RecipeId }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [buying_price, setBuyingPrice] = useState(manufacture?.buying_price);
  const [selling_price, setSellingPrice] = useState(manufacture?.selling_price);
  const [quantity_to_manufacture,setManufactureQty] = useState(manufacture?.quantity_manufactured);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const dataItems = useSelector((state) => state.inventory.getMenuDetails);

 
 
//   const [isUpdating, setIsUpdating] = useState(false);
//  let edit_values=[]
const products = useSelector((state) => state.products.getProducts);

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

  const components = useSelector(
    (state) => state.products.existingComponents
  );

  // let max_qty = components?.data?.reduce(
  //   (prev,curr) => ((product?.total_remaining/prev?.product_components[0]?.total_quantity_deducted)
  //   > (product?.total_remaining/curr?.product_components[0]?.total_quantity_deducted)
  //   )
  // )?.product_components[0]?.total_quantity_deducted ?? 0;

  let quantities = [];
  components?.data?.map((item)=>{
    //  console.log(product?.total_remaining);
     let total_rem = products?.data.find((y) => y.sellable.id === item.id)?.total_remaining ?? 0;
    quantities.push(formatNumber(total_rem/item?.product_components[0].total_quantity_deducted))
  })

  let max_qty = Math.min(...quantities);

  

  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }


    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["manufacture_id"] = manufacture.id;
    params["quantity_to_manufacture"] = quantity_to_manufacture;
    params["selling_price"] = selling_price;
    params["buying_price"] = buying_price;
    params["productId"]= product?.id;
   

    // if(quantity_to_manufacture>max_qty)
    // {
    //   showNotification({
    //     title: "Error",
    //     message: "Quantity To Manufacture Should Be Less/Equal To Maximum Quantity!",
    //     color: "red",
    //   });
    //   return;
    // }

   setIsSubmitting(true)
    try {
      await store.dispatch(submitEditManufacturing(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message:
          "MANUFACTURING SUCCESSFULLY UPDATED",
        color: "green",
        autoClose: true,
      });

     
      setIsSubmitting(false)
      setOpened(false)
      store.dispatch(fetchExistingManufacturings(params));

      // router.push(`/merchants/inventory/manufacturings/${product?.id}`);
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
        title={`Edit ${product?.name ?? dataItems?.menu_item?.name} Manufacturing Details`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="auto"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">




    <div className={`grid grid-flow-col md:grid-flow-row grid-cols-4 gap-2 overflow-x-auto`}>
      {/* <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        PRODUCTION COST : Kshs {formatNumber(total_cost)}
      </h4> */}
      <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        MAXIMUM QUANTITY : {formatNumber(max_qty)}
      </h4>
     
    </div>
  

  <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 gap-2 overflow-x-auto`}>
  <TextInput
      className="w-full sm:w-auto mt-2"
      placeholder="Buying Price"
      label="Buying Price"
      onChange={(e)=>handleBuyingPriceChange(e.currentTarget.value)}
      defaultValue={manufacture?.buying_price}
    />
    <TextInput
      className="w-full sm:w-auto mt-2"
      placeholder="Selling Price"
      label="Selling Price"
      onChange={(e)=>handleSellingPriceChange(e.currentTarget.value)}
      defaultValue={manufacture?.selling_price}
    />

    <TextInput
      className="w-full sm:w-auto mt-2"
      placeholder="Quantity To Manufacture"
      label="Quantity To Manufacture"
      precision={3}
      step={0.5}
      onChange={(e)=>handleMaxQtyChange(e.currentTarget.value)}
      defaultValue={manufacture?.quantity_manufactured}
    />
    
    
  </div>
<div className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}>
  <div className="">

  </div>
  
  <div className="">
    <Button disabled={isSubmitting ? true : false} type="submit" size="md" onClick={submitDetails}>
      
      {!isSubmitting && ( <b>UPDATE </b>) } 
   {isSubmitting && ( <b>UPDATING......</b>  ) } 
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
        EDIT
      </Button>
    </>
  );
}

export default EditManufacture;
