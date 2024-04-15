import {
   Button,
  MultiSelect,
  Checkbox,
  Select,
  TextInput, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { submitEditMembership } from "@/store/merchants/settings/membership-slice";
import { useEffect, useState } from "react";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import Link from "next/link";
import { IconPencil } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";


function MembershipClientView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const membershipId = router?.query?.MembershipId;



  const membershipStatus = useSelector(
    (state) => state.membership.existingMembershipStatus
  );
  const membership = useSelector((state) => state.membership.existingMembership);

  const [name, setName] = useState(membership?.name ?? "");
  const [validity_days, setValidity] = useState(membership?.validity ?? "");
  const [value_cost, setValueCost] = useState(membership?.cost ?? "");
  const [validity_in, setValidityIn] = useState(membership?.validity_in ?? "");
  const [inventory_type, setInventory] = useState("");
  const [membership_type, SetMembershipType] = useState(membership?.membership_type ?? "");
  const [calculate_commission, setCalculateCommission] = useState(membership?.calculate_commission ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percent_discount, setDisc] = useState(membership?.discount ?? "");

  const isLoading = membershipStatus === "loading";

  const validities = [
    { label: "Days", value: "Days" }
  ];

  const inventories = [
    { label: "Services", value: "services" },
    { label: "Products", value: "products" },
  ];

  const membership_types = [
    { label: "Access", value: "Access" },
    { label: "Discount", value: "Discount" },
  ];

  async function submitDetails() {
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["id"] = membershipId;
    params["name"] = name;
    params["cost"] = value_cost;
    params["validity"] = validity_days;
    params["validity_in"] = validity_in;
    params["discount"] = percent_discount;
    params["membership_type"] = membership_type;
    params["calculate_commission"] = calculate_commission ? 1 : 0;

    try {
      setIsSubmitting(true);

      await store.dispatch(submitEditMembership(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });

      setIsSubmitting(false);
      router.push("/merchants/settings/membership");

    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }

      showNotification({
        title: "Warning",
        message,
        color: "orange",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
     <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end">
          <TextInput
            label="Membership Name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Value/Cost"
            type="text"
            placeholder="Value/Cost"
            value={value_cost}
            onChange={(e) => setValueCost(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Validity"
            placeholder="Validity"
            value={validity_days}
            onChange={(e) => setValidity(e.currentTarget.value)}
            required
          />

          <Select
            label="Validity In"
            placeholder="Validiy In"
            data={validities}
            value={validity_in}
            searchable
            onChange={setValidityIn}
            size="xs"
            required
          />
          <Select
            label="Membership Type"
            data={membership_types}
            value={membership_type}
            searchable
            onChange={SetMembershipType}
            size="xs"
            required
          />
       {membership_type==="Discount" && (
        <div className="grid grid-flow-row gap-2">
        <label className="text-sm">Calculate Commission From Membership Price</label>
       <Checkbox
      size="md"
      onChange={(e) => setCalculateCommission(e.currentTarget.checked)}
      checked={calculate_commission===1 ? true : false}

    />

       </div>

       )}
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 content-end"></div>

       {membership?.membership_type==="Discount" && (
         <div className="w-full grid grid-cols-3 md:grid-cols-3 gap-3  p-6 text-lg">




           <TextInput
             className="w-full text-xs sm:w-auto sm:text-xs"
             label="Percentage Discount"
             placeholder="% Discount"
             onChange={(e) => setDisc(e.currentTarget.value)}
             value={percent_discount}
           />

           </div>
       )}

<div className="mt-5">
          <Button loading={isSubmitting} onClick={submitDetails}>
            UPDATE
          </Button>
        </div>


    </Card>
  );
}

export default MembershipClientView;
