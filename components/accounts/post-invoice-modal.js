import {
    Modal,
    Button,
    Alert,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { IconInbox, IconAlertCircle, IconCircleCheck } from "@tabler/icons";
  import { getAllInvoices } from "@/store/merchants/accounts/acounts-slice";
  import {
    getDateFilterFrom,
    getDateFilterTo,
  } from "@/lib/shared/data-formatters";
  import { useRouter } from "next/router";

  function PostInvoiceModal({ item }) {
    const { data: session } = useSession();
    const [opened, setOpened] = useState(false);
    const router = useRouter();
  
    const itemId = item?.id;
  
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [startDate, setStartDate] = useState(getDateFilterFrom());
    const [endDate, setEndDate] = useState(getDateFilterTo());
  
    const submitDetails = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const endpoint = `${API_URL}/accounts/invoices/post/invoice/${itemId}`;
      
          const accessToken = session.user.accessToken;
      
          setIsSubmitting(true);
      
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
      
          const data = await response.json();
          console.log("Response Data", data);
          console.log(response);
      
          if (data.statusCode !== 201 && response.status === 200 && !data.error) {
            showNotification({
              title: "Success",
              message: "Invoice Posted Successfully!",
              color: "green",
            });
            setOpened(false);
            const params = {};
            params["accessToken"] = session.user.accessToken;
            if (startDate) {
              params["startDate"] = startDate;
            }
            if (endDate) {
              params["endDate"] = endDate;
            }
            store.dispatch(getAllInvoices(params));
            setIsSubmitting(false);
            router.push('/merchants/accounts/invoices/archives');
          } else {
            showNotification({
              title: "Error",
              message: "Error ): " + data.error,
              color: "red",
            });
            setIsSubmitting(false);
          }
        } catch (error) {
          // Handle any errors that occurred during fetch or JSON parsing
          console.error("Error occurred:", error);
          showNotification({
            title: "Error",
            message: "An error occurred while processing the request.",
            color: "red",
          });
          setIsSubmitting(false);
        }
      };
      
  
    return (
      <>
        <Modal
          opened={opened}
          title={`#${item?.id} Post Invoice`}
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Post Invoice"
            radius="md"
            color="red"
            withCloseButton
          >
           Once you post this invoice you wont be able to edit it!
          </Alert>

          </section>
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={submitDetails} loading={isSubmitting}>
              Confirm
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
          color="blue"
        >
          Post
        </Button>
      </>
    );
  }
  
  export default PostInvoiceModal;
  