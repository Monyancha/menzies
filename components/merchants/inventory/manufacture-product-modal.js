import { Button, Modal,MultiSelect,NumberInput,Select, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconList } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useRouter } from "next/router";
import {
   submitProductManufacturing,
   fetchExistingComponent,
   } from "@/store/merchants/inventory/products-slice";
import { set } from "lodash";
import { formatNumber, parseValidFloat } from "@/lib/shared/data-formatters";

function ManufactureProduct({ RecipeId,total_cost,max_qty,ProductId,product_cost}) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [selling_price, setSellingPrice] = useState();
  //alert(ProductId)

  const [quantity_to_manufacture,setManufactureQty] = useState(max_qty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const job_card = useSelector((state)=>state.job.job_card);

  let by_price = job_card?.requisition?.recipe_id ? product_cost : total_cost;

  const [buying_price, setBuyingPrice] = useState((by_price));

//   const [isUpdating, setIsUpdating] = useState(false);
//  let edit_values=[]

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


    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["recipe_id"] = RecipeId ??  job_card.requisition.recipe_id;
    params["quantity_to_manufacture"] = quantity_to_manufacture;
    params["selling_price"] = selling_price;
    params["buying_price"] = buying_price;
    params["productId"] = ProductId ??  job_card?.product_id;
    params["status"] = job_card?.requisition.recipe_id ? "requisition" : " ";

    if(quantity_to_manufacture>max_qty)
    {
      showNotification({
        title: "Error",
        message: "Quantity To Manufacture Should Be Less/Equal To Maximum Quantity!",
        color: "red",
      });
      return;
    }

   setIsSubmitting(true)
    try {
      await store.dispatch(submitProductManufacturing(params)).unwrap();
      showNotification({
        position: "top-right",
        zIndex: 2077,
        title: "SUCCESS",
        message:
          "PRODUCT SUCCESSFULLY PRODUCED",
        color: "green",
        autoClose: true,
      });


      setIsSubmitting(false)
      setOpened(false)
      store.dispatch(fetchExistingComponent(params));
      router.push(`/merchants/inventory/products`);


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
        title={`Add Prices For ${product?.name ?? job_card?.products?.name} `}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="lg"
      >
    <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
    <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 gap-2 overflow-x-auto`}>
      <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        PRODUCTION COST : Kshs {formatNumber(total_cost) }
      </h4>
      <h4 className="text-sm text-darkest font-bold mt-6" id="titems">
        QUANTITY : {formatNumber(max_qty)}
      </h4>

    </div>


  <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 overflow-x-auto`}>


  <TextInput
      className="w-full sm:w-auto mr-2 mt-2"
      label="Buying Price Per Product"
      onChange={(e)=>handleBuyingPriceChange(e.currentTarget.value)}
      value={buying_price}
    />
    </div>
      <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 overflow-x-auto`}>

    <TextInput
      className="w-full sm:w-auto mt-2 mr-2"
      label="Selling Price"
      onChange={(e)=>handleSellingPriceChange(e.currentTarget.value)}
    />
    </div>
  <div className={`grid grid-flow-col md:grid-flow-row grid-cols-1 overflow-x-auto`}>

    <NumberInput
      className="w-full sm:w-auto mt-2 mr-2"
      label="Quantity To Produced"
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
   {isSubmitting && ( <b>Saving......</b>  ) }
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
      Add Prices
      </Button>
    </>
  );
}

export default ManufactureProduct;
