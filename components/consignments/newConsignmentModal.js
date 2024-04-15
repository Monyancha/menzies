import {
    Button,
    Modal,
    Textarea,
    TextInput,
    useMantineTheme,
    Select,
    Alert,
    Grid,
    SimpleGrid,
  } from "@mantine/core";
  import { useSession } from "next-auth/react";
  import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
  import { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
import { getConsignments } from "../../src/store/consignments/consignments-slice";
import store from "../../src/store/Store";
import EnterClientModal from "../partners/enter-client-modal";
import EnterCustomerModal from "../partners/enter-customer-modal";

  function NewConsignmentModal() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    //
    const [code, setCode] = useState("");
    const [client, setClient] = useState("");
    const [origin, setOrigin] = useState("");

    function clearForm() {
        setCode("");
        setClient("");
        setOrigin("");
        setClientId("");
    }

    const [clientId, setClientId] = useState("");
    const [searchValue, onSearchChange] = useState("");
    const [options, setOptions] = useState([]);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    //setClientName //clientPhone //clientEmail
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
      
  
    const loadOptions = async (inputValue) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = `${API_URL}/partners/clients?filter=${inputValue}`;
  
      try {
        const accessToken = session.user.accessToken;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            Accept: "application/json",
          },
        });
  
        const data = await response.json();
  
        const results = data?.data?.map((item) => ({
          value: item?.id,
          label: item?.name,
        }));
  
        setOptions(results ?? []);
      } catch (error) {
        console.error(error);
        setOptions([]);
      }
    };

    //Fetch selected client
    const selectedClient = useSelector((state) =>
      state.accounts?.fetchClients?.data?.find((item) => item.id == clientId)
    );
    //
    const onCreateClient = (newClient) => {
      setClientId(newClient?.id);
      setClientName(newClient?.name);
      setClientPhone(newClient?.phone);
      setClientEmail(newClient?.email);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!clientId) {
        showNotification({
          title: "Error",
          message: "Client is required!",
          color: "red",
        });
        return;
      }
  
  
      const data = {
        code,
        client: clientId,
        origin,
      };
  
      const JSONdata = JSON.stringify(data);
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/store-consignment`;
  
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
  
      setLoading(true);
  
      const response = await fetch(endpoint, options);
      const result = await response.json();
  
      console.log(result);
  
      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Consignment created successfully!",
          color: "green",
        });
        clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getConsignments(params));
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result.message,
          color: "red",
        });
        setLoading(false);
      }
      setLoading(false);
    };
  
    return (
      <>
        <Modal
          opened={opened}
          title="New Consignment"
          onClose={() => setOpened(false)}
          padding="md"
          overflow="inside"
          overlayProps={{
            color: "white",
            opacity: 0.01,
            blur: 5,
          }}
        
        >
            <TextInput
              placeholder="Consignment No. E.g SL-00099384"
              description="Leave blank to auto generate."
              label="Consignment No."
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
            />
            <Select
                label="Select a client"
                placeholder="Select a client"
                searchable
                onSearchChange={(value) => {
                  onSearchChange(value);
                  setIsLoadingClients(true);
                  loadOptions(value).finally(() =>
                    setIsLoadingClients(false)
                  );
                }}
                onChange={(value) => setClientId(value)}
                value={clientId}
                searchValue={searchValue}
                data={options}
                clearable
                nothingFound="No clients found"
              />
            <SimpleGrid cols={2}>
              <EnterClientModal mt="sm" />
              <EnterCustomerModal mt="sm" />
            </SimpleGrid>
            <TextInput
              placeholder="Origin Country E.g China"
              label="Origin Country"
              value={origin}
              onChange={(e) => setOrigin(e.currentTarget.value)}
            />
                  

          <section className="flex justify-end rounded-lg mt-5">
            <Button variant="outline" onClick={handleSubmit} loading={loading}>
              Create Consignment
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
        >
          New Consignment
        </Button>
      </>
    );
  }
  
  export default NewConsignmentModal;
  