import {
   NumberInput,
   Modal,
   Button
  } from "@mantine/core";
  import { showNotification } from "@mantine/notifications";
import { IconUser,IconMoneybag } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {  useSelector } from "react-redux";
import store from "@/store/store";
import { topUpMembership } from "@/store/merchants/settings/membership-slice";
import { fetchClients } from "@/store/merchants/partners/clients-slice";
import { setClient,setSelectedClient,setMembership } from "@/store/merchants/transactions/transaction-slice";
import { clearClient } from "@/store/merchants/transactions/transaction-slice";
function NewMembershipTopup() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [top_up_amount,setTopupAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedClient = useSelector(
        (state) => state.posTransaction.selectedClient
      );

      const clientList = useSelector(
        (state) => state.clients.clientList?.data ?? []
      );


      function clearForm() {

        setTopupAmount("");
        setIsSubmitting(false);

      }

    async function submitDetails() {
        if (!session || status !== "authenticated" || isSubmitting) {
          return;
        }


        const params = {};
        params["accessToken"] = session.user.accessToken;

        params["client_id"] = selectedClient?.id;
        params["membership_id"] = selectedClient?.first_active_membership?.membership_id;
        params["top_up_amount"] = top_up_amount;
        params["membership_client_id"] = selectedClient?.first_active_membership?.id


        // params["branch_id"] = branch_id;
        if (!top_up_amount) {
          showNotification({
            title: "Error",
            message: "Kindly Add All The Values To Proceeed",
            color: "red",
          });
          return;
        }

        try {
          await store.dispatch(topUpMembership(params)).unwrap();

          showNotification({
            position: "top-right",
            zIndex: 2077,
            title: "SUCCESS",
            message:
              "Membership Successfully Topped Up",
            color: "green",
            autoClose: true,
          });
          store.dispatch(clearClient());
         
          clearForm();
          setOpened(false);
          const pars = {};
          pars["accessToken"] = session?.user?.accessToken;
          pars["filter"] = selectedClient?.id;

          store.dispatch(fetchClients(pars));

          let param = {
            client_id: selectedClient?.id,
          };
          store.dispatch(setClient(param));

          let client = clientList.find((item) => item.id === selectedClient?.id);
          let paramst = {
            client: client,
          };
          store.dispatch(setSelectedClient(paramst));

          let pars_two = {};
          pars_two = {membership_id:client?.first_active_membership?.membership_id}

          store.dispatch(setMembership(pars_two));

          // clearForm
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
        }
      }

    return (
        <>
          <Modal
            opened={opened}
            title="Top Up Membership"
            onClose={() => setOpened(false)}
            padding="xs"
            overflow="inside"
            size="lg"
          >
            <section className="flex flex-col space-y-2 px-3 rounded-lg">


              <NumberInput
                placeholder="Amount To Top Up"
                label="Amount To Top Up"
                withAsterisk
                value={top_up_amount}
                onChange={(e) => setTopupAmount(e)}

              />
               </section>

<section className="flex justify-end space-y-2 mx-3 rounded-lg my-3">
  <Button  onClick={submitDetails} loading={isSubmitting}>
    TOP UP
  </Button>
</section>
</Modal>

<Button
leftIcon={<IconMoneybag size={8} />}
variant="outline"
size="xs"
onClick={() => setOpened(true)}
>
TOP UP
</Button>
</>
);
  }
  export default NewMembershipTopup;
