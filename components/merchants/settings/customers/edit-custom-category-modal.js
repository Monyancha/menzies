import {
    Modal,
    useMantineTheme,
    Button,
    TextInput,
    Select,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import { getBookingsList } from "../../../../store/merchants/bookings/bookings-slice";
  import { useRouter } from "next/router";
  import store from "../../../../store/store";
  import { IconPlus, IconEdit } from "@tabler/icons";
  import { getCustomerCategories } from "@/store/merchants/partners/clients-slice";
  
  function EditCustomCategoryModal({item}) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(item?.name ?? "");
  
    function clearForm() {
      setName("");
    }
  
    async function handleSubmit() {
      setLoading(true);
  
      const accessToken = session.user.accessToken;
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/customer/categories/update/${item?.id}`;
  
      const data = {
        name: name,
      };
  
      try {
        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken} `,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update.");
        }
  
        showNotification({
          title: "Success!",
          message: "Category updated successfully.",
          color: "green",
        });
  
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getCustomerCategories(params));
        clearForm();
        setOpened(false);
      } catch (error) {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <>
        <Modal
          opened={opened}
          title="Update Category"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <TextInput
              placeholder="Category Name"
              label="Category Name"
              withAsterisk
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </section>
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={handleSubmit} loading={loading}>
              Update
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconEdit size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
        >
          Edit
        </Button>
      </>
    );
  }
  
  export default EditCustomCategoryModal;
  