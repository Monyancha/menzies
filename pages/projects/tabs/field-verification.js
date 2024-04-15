import React, { useEffect, useState } from "react";
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import {
  Badge,
  Button,
  FileInput,
  Group,
  Image,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
} from "@mantine/core";

// images
import { Stack } from "@mui/system";
import { getSingleConsignment } from "../../../src/store/consignments/consignments-slice";
import { showNotification } from "@mantine/notifications";
import store from "../../../src/store/Store";
import { useSession } from "next-auth/react";
import { fileType } from "../../../lib/shared/data-formatters";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getExpenseTypes } from "../../../src/store/accounts/accounts-slice";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import CreateExpenseTypeModal from "../../../components/accounts/create-expense-type";

const FieldVerification = ({ itemId, item }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);
  const [cocPaymentStatus, setCocPaymentStatus] = useState(item?.payment_status ?? "");
  const [cocAmount, setCocAmount] = useState(item?.coc_amount ?? "");

  const handleIssueChange = (index, key, value) => {
    const updatedIssues = [...issues];
    updatedIssues[index][key] = value;
    setIssues(updatedIssues);
  };

  const handleRemoveIssue = (index) => {
    const updatedIssues = [...issues];
    updatedIssues.splice(index, 1);
    setIssues(updatedIssues);
  };

  const handleAddIssue = () => {
    setIssues([
      ...issues,
      { name: "", status_notes: "", staff: "", description: "" },
    ]);
  };

  const [verificationDateTime, setVerificationDateTime] = useState(
    item?.verification_eta ?? ""
  );
  const [assignedStaff, setAssignedStaff] = useState(item?.staff ?? "");
  const [releaseEntryDateTime, setReleaseEntryDateTime] = useState(
    item?.release_entry_eta ?? ""
  );
  const [totalExpenses, setTotalExpenses] = useState(
    item?.total_expenses ?? ""
  );
  const [pettyCashRequest, setPettyCashRequest] = useState(
    item?.petty_cash ?? ""
  );
  const [issueStatusNotes, setIssueStatusNotes] = useState(item?.notes ?? "");
  const [issue, setIssue] = useState(item?.issue ?? "No");
  // Initialize the photos state with parsed photos from the item prop
  const [photos, setPhotos] = useState(
    item?.photos ? JSON.parse(item.photos) : []
  );

  const addPhoto = () => {
    setPhotos([...photos, { photo: null, cost: "", description: "" }]);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleInputChange = (index, field, value) => {
    const updatedPhotos = photos.map((photo, i) =>
      i === index ? { ...photo, [field]: value } : photo
    );
    setPhotos(updatedPhotos);
  };

  const handleFileChange = (index, file) => {
    const updatedPhotos = photos.map((photo, i) =>
      i === index ? { ...photo, photo: file } : photo
    );
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("am here 1");

    const formData = new FormData();
    // Append data to formData
    formData.append("consignment_id", itemId);
    // Append non-dynamic data to formData
    formData.append("verification_eta", verificationDateTime);
    formData.append("staff", assignedStaff);
    formData.append("release_entry_eta", releaseEntryDateTime);
    formData.append("total_expenses", totalExpenses);
    formData.append("petty_cash", pettyCashRequest);
    formData.append("notes", issueStatusNotes);
    // Append dynamic photo data only if photo is uploaded
    photos.forEach((photo, index) => {
      if (photo.photo) {
        // TODO::Submit only when there is an uploaded file to avoid deleting previously uploaded files
        formData.append(`photos[${index}][photo]`, photo.photo);
        formData.append(
          `photos[${index}][description]`,
          photo.description || ""
        );
      }
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/field-verification`;

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
          message: "Field verification updated successful!",
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

  useEffect(() => {
    // Update the photos state if the item prop changes
    if (item?.photos) {
      setPhotos(JSON.parse(item.photos));
    }
  }, [item]);

  //Manage Expenses
  const reqStatus = useSelector(
    (state) => state.accounts.getExpenseTypesStatus
  );

  const requirements = useSelector((state) => state.accounts.getExpenseTypes);

  const isLoading = reqStatus === "loading";
  const branch_id = useSelector((state) => state.branches.branch_id);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getExpenseTypes(params));
  }, [session, status]);

  console.log(requirements);

  //Expenses

  const [products, setProducts] = useState([]);

  const productsList = requirements;

  useEffect(() => {
    const productsData =
      productsList?.map((item) => ({
        value: item?.type,
        label: "" + item?.type,
      })) ?? [];

    if (!productsData) {
      return;
    }

    setProducts(productsData);
  }, [productsList]);

  //UseStates
  const [items, setItems] = useState([
    { product: "", description: "", quantity: 1, price: "", tax: "" },
  ]);
  const [posNumber, setPosNumber] = useState("");
  const [description, setDescription] = useState("");
  const [signature, setSignature] = useState("");
  const [estimateDate, setEstimateDate] = useState("");

  function handleItemChange(index, key, value) {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  }

  function handleAddItem() {
    setItems((prevItems) => [
      ...prevItems,
      { product: "", description: "", quantity: 1, price: "", tax: "" },
    ]);
  }

  function handleRemoveItem(index) {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }

  const handleSaveExpenseType = async (newItem) => {
    setLoading(true);

    const formdata = new FormData();
    formdata.append("expense_type", newItem.value);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/expenses/create-expense-type`;

    const accessToken = session.user.accessToken;

    const response = fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
      body: formdata,
    }).then(async (response) => {
      const data = await response.json();
      console.log("Response Data", data);
      console.log(response);

      if (response?.status !== 422 && response?.status === 201) {
        showNotification({
          title: "Success",
          message: "Expense type created Successfully",
          color: "green",
        });
        setLoading(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getExpenseTypes(params));
      } else {
        // error occurred
        let message = "";
        for (let field in data.errors) {
          message += data.errors[field][0] + ", ";
        }
        message = message.slice(0, -2); // remove last comma and space
        showNotification({
          title: "Error",
          message: message + response?.statusText,
          color: "red",
        });

        setLoading(false);
      }
    });
  };

  //

  return (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <Typography variant="h5" mb={1}>
          Update Field Verification
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
          <Select
            label="Is COC there?"
            placeholder="Is COC there?"
            value={cocPaymentStatus}
            onChange={(value) => setCocPaymentStatus(value)}
            data={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
            ]}
            clearable
            searchable
            withAsterisk
          />
          {cocPaymentStatus === "Yes"  && (
            <FileInput
            label="Upload COC"
            placeholder="Upload COC"
            // onChange={(file) => setPaymentProof(file)}
          />
          )}
          {cocPaymentStatus === "No"  && (
            <>
            <TextInput
              label="COC Amount"
              placeholder="COC Amount"
              value={cocAmount}
              onChange={(e) => setCocAmount(e.target.value)}
            />

<Select
            label="Payment Method"
            placeholder="Payment Method"
            // value={paymentMethod}
            // onChange={(value) => setPaymentMethod(value)}
            data={[
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Cheque', label: 'Cheque' },
              { value: 'M-Pesa', label: 'M-Pesa' },
            ]}
            clearable
            searchable
          />

            <Select
            label="Paid By"
            placeholder="Paid By"
            // value={paidBy}
            // onChange={(value) => setPaidBy(value)}
            data={[
              { value: 'Merchant', label: 'Merchant' },
              { value: 'Client', label: 'Client' },
            ]}
            clearable
            searchable
          />

          

          </>

          )}

          <TextInput
            label="Field Verification Date & Time"
            placeholder="Field Verification Date & Time"
            type="datetime-local"
            value={verificationDateTime}
            onChange={(e) => setVerificationDateTime(e.target.value)}
          />
          <Select
            label="Select Assigned Staff"
            placeholder="Select Staff"
            data={[
              { value: "Staff Maggie", label: "Staff Maggie" },
              { value: "Steve Owuor", label: "Steve Owuor" },
            ]}
            value={assignedStaff}
            onChange={setAssignedStaff}
          />
          <TextInput
            label="Release Entry Date & Time"
            placeholder="Release Entry Date & Time"
            type="datetime-local"
            value={releaseEntryDateTime}
            onChange={(e) => setReleaseEntryDateTime(e.target.value)}
          />
          {/* <TextInput 
            label="Total Verification Expenses"
            placeholder="Total Verification Expenses"
            value={totalExpenses}
            onChange={(e) => setTotalExpenses(e.target.value)}
          /> */}
          <Select
            label="Select Currency"
            placeholder="Select Currency"
            data={[
              { value: "kes", label: "KES" },
              { value: "usd", label: "USD" },
            ]}
            clearable
            searchable
            // value={currency}
            // onChange={setCurrency}
          />
          <Select
            label="Request for Petty Cash"
            placeholder="Request for Petty Cash"
            data={[
              { value: "No", label: "No" },
              { value: "Yes", label: "Yes" },
            ]}
            value={pettyCashRequest}
            onChange={setPettyCashRequest}
          />
          <Select
            label="Is there any issue?"
            placeholder="Is there any issue?"
            data={[
              { value: "No", label: "No" },
              { value: "Yes", label: "Yes" },
            ]}
            value={issue}
            onChange={setIssue}
          />
          {/* <Textarea 
            label="Update Issue Status Notes"
            placeholder="Update Issue Status Notes"
            value={issueStatusNotes}
            onChange={(e) => setIssueStatusNotes(e.target.value)}
            autosize 
            minRows={2} 
          /> */}
        </SimpleGrid>

        {issue === "Yes" && (
          <>
            <Typography variant="h5" mt={2} mb={1}>
              Update Issue Status
            </Typography>
            {issues.map((item, index) => (
              <SimpleGrid key={index} mb="xs" cols={5} spacing="xs">
                <TextInput
                  className="w-full sm:w-auto"
                  placeholder="Issue"
                  value={item.name}
                  onChange={(event) =>
                    handleItemChange(index, "name", event.currentTarget.value)
                  }
                />
                <TextInput
                  className="w-full sm:w-auto"
                  placeholder="Issue Description"
                  value={item.description}
                  onChange={(event) =>
                    handleItemChange(
                      index,
                      "description",
                      event.currentTarget.value
                    )
                  }
                />
                <Select
                  placeholder="Assign Staff"
                  data={[
                    { value: "Staff Maggie", label: "Staff Maggie" },
                    { value: "Steve Owuor", label: "Steve Owuor" },
                  ]}
                  value={item.staff}
                  onChange={(event) =>
                    handleIssueChange(index, "staff", event)
                  }
                />
                <TextInput
                  className="w-full sm:w-auto"
                  placeholder="Status Notes"
                  value={item.status_notes}
                  onChange={(event) =>
                    handleIssueChange(
                      index,
                      "status_notes",
                      event.currentTarget.value
                    )
                  }
                />
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  color="red"
                  leftIcon={<IconTrash />}
                  onClick={() => handleRemoveIssue(index)}
                >
                  Remove
                </Button>
              </SimpleGrid>
            ))}
            <Group position="left" className="mb-5 mt-5">
              <Button
                variant="outline"
                color="primary"
                onClick={handleAddIssue}
                leftIcon={<IconPlus size={18} />}
              >
                Add Issue
              </Button>
              {issues.length > 0 && (
                <>
                  <Badge variant="filled" color="primary">
                    {issues.length} Issue{issues.length > 1 ? "s" : ""}
                  </Badge>
                </>
              )}
            </Group>
          </>
        )}

        <Typography variant="h5" mt={2} mb={1}>
          Add Field Expenses
        </Typography>

        {items.map((item, index) => (
          <SimpleGrid key={index} mb="xs" cols={5} spacing="xs">
            <Select
              className="w-full sm:w-auto"
              placeholder="Select Expense Type"
              searchable
              clearable
              creatable
              getCreateLabel={(query) => `+ Create ${query} Expense`}
              onCreate={(query) => {
                const newItem = { value: query, label: query };
                setProducts((current) => [...current, newItem]);
                handleSaveExpenseType(newItem); // Save item to database
                return newItem;
              }}
              data={products}
              value={item.product}
              onChange={(value) => handleItemChange(index, "product", value)}
            />
            <TextInput
              className="w-full sm:w-auto"
              placeholder="Description"
              value={item.description}
              onChange={(event) =>
                handleItemChange(
                  index,
                  "description",
                  event.currentTarget.value
                )
              }
            />
            <TextInput
              className="w-full sm:w-auto"
              placeholder="Quantity"
              defaultValue={1}
              value={item.quantity}
              onChange={(event) =>
                handleItemChange(index, "quantity", event.currentTarget.value)
              }
            />
            <TextInput
              className="w-full sm:w-auto"
              placeholder="Price"
              value={item.price}
              onChange={(event) =>
                handleItemChange(index, "price", event.currentTarget.value)
              }
            />
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              color="red"
              leftIcon={<IconTrash />}
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </Button>
          </SimpleGrid>
        ))}
        <Group position="left" className="mb-5 mt-5">
          <Button
            variant="outline"
            color="primary"
            onClick={handleAddItem}
            leftIcon={<IconPlus size={18} />}
          >
            Add Expense
          </Button>
          <CreateExpenseTypeModal />
          {items.length > 0 && (
            <>
              <Badge variant="filled" color="primary">
                {items.length} Expense{items.length > 1 ? "s" : ""}
              </Badge>
            </>
          )}
        </Group>

        <Typography variant="h5" mt={2} mb={1}>
          Upload Field Photos
        </Typography>
        {photos.map((photo, index) => (
          <SimpleGrid key={index} cols={3} spacing="xs">
            <Stack>
              <FileInput
                label="Upload Photo"
                placeholder="Upload Image File"
                onChange={(file) => handleFileChange(index, file)}
              />
              {/* TODO::Fix preview to only appear when the item is fully uploaded to avoid showing null photo */}
              {photo?.photo && typeof photo.photo === "string" && (
                <Link href={photo?.photo} target="_blank">
                  <Image
                    alt=""
                    src={photo?.photo}
                    radius="sm"
                    mt="xs"
                    height={50}
                    width={50}
                  />
                </Link>
              )}
            </Stack>
            <TextInput
              label="Description"
              placeholder="Description"
              value={photo.description}
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
            />
            <Button
              mt="xl"
              variant="outline"
              color="red"
              onClick={() => removePhoto(index)}
            >
              Remove
            </Button>
          </SimpleGrid>
        ))}
        <SimpleGrid cols="3">
          <Button variant="outline" mt="md" onClick={addPhoto}>
            Add More Photos
          </Button>
        </SimpleGrid>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >
          <Button loading={loading} onClick={handleSubmit} variant="outline">
            Update Field Verification
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default FieldVerification;
