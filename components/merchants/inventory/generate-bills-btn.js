import { Button, Menu } from "@mantine/core";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { IconReceipt2 } from "@tabler/icons";

function CreateBillBtn({ item, lpoId, isEnabled }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const itemId = item?.id;

  const handleBills = async (event) => {
    const billId = item?.purchase_orders[0]?.bill?.id;

    if (!item?.purchase_orders[0]?.bill?.id) {
      const data = {
        company_id: item.company_id,
        referenceable_id: item.referenceable_id,
        referenceable_type: item.referenceable_type,
        amount: item.amount,
        type: item.type,
        payment_type: item.payment_type,
        payment_metadata: item.payment_metadata,
        date: item.order_date,
        narration: item.terms_and_conditions,
      };

      const JSONdata = JSON.stringify(data);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/inventory/purchases/create-bill/${lpoId}`;

      const accessToken = session.user.accessToken;

      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "POST",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      const refBillId = result.bill.id;

      console.log(result);
      console.log(response);
      console.log(result.bill.id);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Bill Created Successfully",
          color: "green",
        });

        if (refBillId) {
          router.push(
            `/merchants/inventory/bill/${refBillId}?rfqId=${item.id}`
          );
        }
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result.message,
          color: "red",
        });
      }
    } else {
      router.push(`/merchants/inventory/bill/${billId}?rfqId=${item.id}`);
    }
  };

  return (
    <>
      <Menu.Item
        icon={<IconReceipt2 size={16} />}
        onClick={handleBills}
        color="violet"
        disabled={!isEnabled}
      >
        Bill
      </Menu.Item>
    </>
  );
}

export default CreateBillBtn;
