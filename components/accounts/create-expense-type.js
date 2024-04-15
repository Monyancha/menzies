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
import store from "../../src/store/Store";
import { getExpenseTypes } from "../../src/store/accounts/accounts-slice";
import { IconPlus } from "@tabler/icons-react";

function CreateExpenseTypeModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [expenseType, setExpenseType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateExpenseType = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formdata = new FormData();
    formdata.append("expense_type", expenseType);

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

      if (data?.statusCode !== 422 && response?.status === 201) {
        showNotification({
          title: "Success",
          message: "Expense Category created Successfully",
          color: "green",
        });
        setLoading(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getExpenseTypes(params));
        setExpenseType("");
        setOpened(false);
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

  return (
    <>
      <Modal
        opened={opened}
        title="Add Expense Category"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2  p-3 rounded-lg">

          <TextInput
            placeholder="Type of Expense"
            label="Type of Expense"
            withAsterisk
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 p-3 rounded-lg ">
          <Button variant="outline" onClick={handleCreateExpenseType} loading={loading}>
            Create Expense Category
          </Button>
        </section>
      </Modal>

      <Button leftIcon={<IconPlus size={18} />} variant="outline" onClick={() => setOpened(true)}>
        Add Expense Type
      </Button>
    </>
  );
}

export default CreateExpenseTypeModal;
