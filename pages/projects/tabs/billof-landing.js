import React, { useState } from "react";
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import {
  Button,
  FileInput,
  Group,
  Image,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";

// images
import { Stack } from "@mui/system";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import store from "../../../src/store/Store";
import { fileType } from "../../../lib/shared/data-formatters";
import { getSingleConsignment } from "../../../src/store/consignments/consignments-slice";
import {
  formatDateTime,
  formatDateOnly,
} from "../../../lib/shared/data-formatters";
import { IconPlus, IconTrash } from "@tabler/icons-react";

const BillOfLanding = ({ itemId, item }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("kes");
  const [deposit, setDeposit] = useState("");
  const [etaTime, setEtaTime] = useState(formatDateTime(item?.eta_time) ?? "");
  const [vesselNumber, setVesselNumber] = useState(item?.vessel_no ?? "");
  const [dischargeDate, setDischargeDate] = useState(
    formatDateOnly(item?.discharge_date) ?? ""
  );
  const [containerTransferDate, setContainerTransferDate] = useState(
    formatDateOnly(item?.container_transfer_date) ?? ""
  );
  const [manifestNumber, setManifestNumber] = useState(item?.manifest_no ?? "");
  const [shippingCharges, setShippingCharges] = useState(
    item?.shipping_cost ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState(
    item?.payment_method ?? ""
  );
  const [paidBy, setPaidBy] = useState(item?.paid_by ?? "");
  const [pickingDate, setPickingDate] = useState(
    formatDateOnly(item?.picking_date) ?? ""
  );
  // File states
  const [billDocument, setBillDocument] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [deliveryOrder, setDeliveryOrder] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("am here 1");

    const formData = new FormData();
    formData.append("consignment_id", itemId);
    formData.append("eta_time", etaTime);
    formData.append("vessel_no", vesselNumber);
    formData.append("discharge_date", dischargeDate);
    formData.append("container_transfer_date", containerTransferDate);
    formData.append("manifest_no", manifestNumber);
    formData.append("shipping_cost", shippingCharges);
    formData.append("payment_method", paymentMethod);
    formData.append("paid_by", paidBy);
    formData.append("picking_date", pickingDate);
    // Append files if they are selected
    // if (billDocument) {
    //   formData.append("bill_of_lading", billDocument);
    // }
    // if (paymentProof) {
    //   formData.append("proof_of_payment", paymentProof);
    // }
    
    // Append container deposits if they are selected
    containerDeposits.forEach((deposit, index) => {
      formData.append(`container_deposits[${index}][currency]`, deposit.currency);
      formData.append(`container_deposits[${index}][amount]`, deposit.amount);
      formData.append(`container_deposits[${index}][shipping_line]`, deposit.shippingLine);
    });

    // Append proof of payments if they are selected
    proofOfPayments.forEach((payment, index) => {
      if (payment.file) {
        formData.append(`proof_of_payments[${index}][file]`, payment.file);
      }
      formData.append(`proof_of_payments[${index}][description]`, payment.description);
    });


    if (deliveryOrder) {
      formData.append("delivery_order", deliveryOrder);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/bill-of-lading`;

      const accessToken = session.user.accessToken;

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      };

      console.log("Am here 2");

      setLoading(true);

      const response = await fetch(endpoint, options);

      const result = await response.json();
      console.log("Aiden Kabalake", response);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Bill of Lading updated successful!",
          color: "green",
        });
        // clearForm();
        setLoading(false);
        const params = {};
        params["accessToken"] = accessToken;
        params["itemId"] = itemId;
        store.dispatch(getSingleConsignment(params));
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result?.message,
          color: "red",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification({
        title: "Error",
        message: "Try uploading files below 100Kbs. " + error,
        color: "red",
      });
      setLoading(false); // Turn off loading indicator in case of error
    }
  };

  console.log("Monyancha Enock", item);

  const [containerDeposits, setContainerDeposits] = useState([
    { currency: "kes", amount: "", shippingLine: "" }
  ]);
  
  const [proofOfPayments, setProofOfPayments] = useState([{ file: null, description: "" }]);
  
  const handleContainerDepositChange = (index, key, value) => {
    const updatedDeposits = [...containerDeposits];
    updatedDeposits[index][key] = value;
    setContainerDeposits(updatedDeposits);
  };
  
  const handleAddContainerDeposit = () => {
    setContainerDeposits([...containerDeposits, { currency: "kes", amount: "", shippingLine: "" }]);
  };
  
  const handleRemoveContainerDeposit = (index) => {
    const updatedDeposits = [...containerDeposits];
    updatedDeposits.splice(index, 1);
    setContainerDeposits(updatedDeposits);
  };
  
  const handleProofOfPaymentChange = (index, key, value) => {
    const updatedPayments = [...proofOfPayments];
    updatedPayments[index][key] = value;
    setProofOfPayments(updatedPayments);
  };
  
  const handleAddProofOfPayment = () => {
    setProofOfPayments([...proofOfPayments, { file: null, description: "" }]);
  };
  
  const handleRemoveProofOfPayment = (index) => {
    const updatedPayments = [...proofOfPayments];
    updatedPayments.splice(index, 1);
    setProofOfPayments(updatedPayments);
  };

  return (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <Typography variant="h5" mb={1}>
          Update Bill of Lading
        </Typography>
        <Typography color="textSecondary" mb={3}>
          To change your details, edit and save from here
        </Typography>

        <SimpleGrid
          cols={2}
          spacing="xs"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "xs" },
            { maxWidth: "sm", cols: 2, spacing: "xs" },
            { maxWidth: "xs", cols: 1, spacing: "xs" },
          ]}
        >
          <TextInput
            defaultValue={etaTime}
            onChange={(e) => setEtaTime(e.target.value)}
            type="datetime-local"
            placeholder="Bill of lading ETA/Time"
            label="ETA/Time"
          />
          <TextInput
            value={vesselNumber}
            onChange={(e) => setVesselNumber(e.target.value)}
            placeholder="Vessel Number"
            label="Vessel Number"
          />
          <TextInput
            value={manifestNumber}
            onChange={(e) => setManifestNumber(e.target.value)}
            placeholder="Manifest Number"
            label="Manifest Number"
          />
          <TextInput
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            type="date"
            placeholder="Discharge Date"
            label="Discharge Date"
          />
          <TextInput
            value={containerTransferDate}
            onChange={(e) => setContainerTransferDate(e.target.value)}
            type="date"
            placeholder="Date of container transfer"
            label="Date of container transfer"
          />
          <TextInput
            value={pickingDate}
            onChange={(e) => setPickingDate(e.target.value)}
            type="date"
            placeholder="Shiping Line Picking Date"
            label="Shiping Line Picking Date"
          />
          <TextInput
            value={shippingCharges}
            onChange={(e) => setShippingCharges(e.target.value)}
            placeholder="Shipping line charges"
            label="Shipping line charges"
          />

        </SimpleGrid>


          {/*TODO::1 Make this Deposit form Dynamic */}
          <Typography mt={2} variant="h5" mb={1}>
              Container Deposit Fees
          </Typography>
          <Typography color="textSecondary" mb={3}>
            You can add multiple container deposits and shipping lines
          </Typography>

          {containerDeposits.map((deposit, index) => (
          <SimpleGrid
          cols={4}
          key={index}
          spacing="xs"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "xs" },
            { maxWidth: "sm", cols: 2, spacing: "xs" },
            { maxWidth: "xs", cols: 1, spacing: "xs" },
          ]}
        >
          <Select
            label="Currency"
            placeholder="Currency"
            data={[
              { value: "kes", label: "KES" },
              { value: "usd", label: "USD" }
            ]}
            clearable
            searchable
            value={deposit.currency}
            onChange={(value) => handleContainerDepositChange(index, "currency", value)}
          />
          <TextInput
            value={deposit.amount}
            onChange={(e) => handleContainerDepositChange(index, "amount", e.target.value)}
            placeholder="Amount"
            label="Amount"
          />
          <Select
            label="Shipping Line"
            placeholder="Shipping Line"
            data={[
              { value: "1", label: "Shipping Line 1" },
              { value: "2", label: "Shipping Line 2" },
              { value: "3", label: "Shipping Line 3" },
              { value: "4", label: "Shipping Line 4" }
            ]}
            clearable
            searchable
            value={deposit.shippingLine}
            onChange={(value) => handleContainerDepositChange(index, "shippingLine", value)}
          />

          <Button leftIcon={<IconPlus size={18} />} mt={20} variant="outline">New Shipping Line</Button>

          <TextInput
            // value={containerTransferDate}
            // onChange={(e) => setContainerTransferDate(e.target.value)}
            type="date"
            placeholder="Shipping Line Date"
            label="Shipping Line Date"
          />

          <TextInput
            // value={containerTransferDate}
            // onChange={(e) => setContainerTransferDate(e.target.value)}
            type="date"
            placeholder="Date of Interchange Return"
            label="Date of Interchange Return"
          />

          <TextInput
            // value={containerTransferDate}
            // onChange={(e) => setContainerTransferDate(e.target.value)}
            type="date"
            placeholder="Date of Lodging the refund"
            label="Date of Lodging the refund"
          />

          <TextInput
            // value={containerTransferDate}
            // onChange={(e) => setContainerTransferDate(e.target.value)}
            type="date"
            placeholder="Date the refund was paid back"
            label="Date the refund was paid back"
          />

          <Button
            leftIcon={<IconTrash size={18} />}
            variant="outline"
            color="red"
            onClick={() => handleRemoveContainerDeposit(index)}
          >
            Remove
          </Button>

        </SimpleGrid>
        ))}
        <Button mt="xl" leftIcon={<IconPlus size={18} />} variant="outline" onClick={handleAddContainerDeposit}>
          Add another Deposit
        </Button>

        <SimpleGrid
          cols={2}
          mt="xl"
          spacing="xs"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "xs" },
            { maxWidth: "sm", cols: 2, spacing: "xs" },
            { maxWidth: "xs", cols: 1, spacing: "xs" },
          ]}
        >
          
          <Select
            label="Payment Method"
            placeholder="Payment Method"
            data={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cash", label: "Cash" },
              { value: "Cheque", label: "Cheque" },
              { value: "M-Pesa", label: "M-Pesa" },
            ]}
            clearable
            searchable
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
          <Select
            label="Paid By"
            placeholder="Paid By"
            data={[
              { value: "Merchant", label: "Merchant" },
              { value: "Client", label: "Client" },
            ]}
            clearable
            searchable
            value={paidBy}
            onChange={setPaidBy}
          />

          </SimpleGrid>
          
          {/*TODO::2 Make this proof of payment form dynamic also */}

          <Typography mt={2} variant="h5" mb={1}>
              Upload Proof of Payment 
        </Typography>
        <Typography color="textSecondary" mb={3}>
          You can add multiple proof of payments
        </Typography>

        {proofOfPayments.map((payment, index) => (
          <SimpleGrid
          cols={3}
          mt="xl"
          key={index}
          spacing="xs"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "xs" },
            { maxWidth: "sm", cols: 2, spacing: "xs" },
            { maxWidth: "xs", cols: 1, spacing: "xs" },
          ]}
        >

          <Stack>
          <FileInput
            onChange={(file) => handleProofOfPaymentChange(index, "file", file)}
            label="Upload Payment Proof"
            placeholder="Upload Payment Proof"
          />
          
          {item?.proof_of_payment && (
            <Link href={item?.proof_of_payment} target='_blank'>
              {fileType(item.proof_of_payment)}
            </Link>
          )}
          </Stack>

          <TextInput
            value={payment.description}
            onChange={(e) => handleProofOfPaymentChange(index, "description", e.target.value)}
            placeholder="Description"
            label="Description"
          />

        <Button
          mt={21}
          leftIcon={<IconTrash size={18} />}
          variant="outline"
          color="red"
          onClick={() => handleRemoveProofOfPayment(index)}
        >
          Remove
        </Button>

        </SimpleGrid>
        ))}
        <Button mt="xl" leftIcon={<IconPlus size={18} />} variant="outline" onClick={handleAddProofOfPayment}>
          Add Proof of Payment
        </Button>
          {/* <Stack>
          <FileInput
            label="Upload Bill of Landing Document"
            placeholder="Upload Bill of Landing Document"
            onChange={setBillDocument}
          />
          {item?.bill_of_lading && (
            <Link href={item?.bill_of_lading} target='_blank'>
              {fileType(item.bill_of_lading)}
            </Link>
          )}
          </Stack> */}

      <SimpleGrid
          cols={1}
          mt="xl"
          spacing="xs"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "xs" },
            { maxWidth: "sm", cols: 2, spacing: "xs" },
            { maxWidth: "xs", cols: 1, spacing: "xs" },
          ]}
        >
          
          <Stack>
          <FileInput
            onChange={setDeliveryOrder}
            label="Upload Delivery Order"
            placeholder="Upload Delivery Order"
          />
          {item?.delivery_order && (
            <Link href={item?.delivery_order} target='_blank'>
              {fileType(item.delivery_order)}
            </Link>
          )}
          </Stack>
        </SimpleGrid>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >
          <Button onClick={handleSubmit} loading={loading} variant="outline">
            Update Bill of Landing
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default BillOfLanding;
