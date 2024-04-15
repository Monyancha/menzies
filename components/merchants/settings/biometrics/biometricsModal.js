import {
    Modal,
    useMantineTheme,
    Button,
    TextInput,
    Select,
    Textarea,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import { getBookingsList } from "../../../../store/merchants/bookings/bookings-slice";
  import { useRouter } from "next/router";
  import store from "../../../../store/store";
  import { IconPlus, IconCash } from "@tabler/icons";
  import { getAllWarehouses } from "../../../../store/merchants/settings/access-control-slice";
  import { getWarehouses } from "@/store/merchants/settings/access-control-slice";
  import { useSelector } from "react-redux";
import { getDevices } from "@/store/merchants/settings/security-slice";
  
  function BiometricsModal() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ipAddress, setIpAddress] = useState("");
    const [port, setPort] = useState("8090");
    const [macAddress, setMacAddress] = useState("");
    const [serialNo, setSerialNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
  
    const branch_id = useSelector((state) => state.branches.branch_id);
  
  
    function clearForm() {
        setIpAddress("");
        setMacAddress("");
        setSerialNo("");
        setLocation("");
        setDescription("");
        setVersion("");
        setPort("");
        setUsername("");
        setPassword("");
    }
  
    async function handleSubmit() {

    if(!ipAddress){
        showNotification({
            title: "Error!",
            message: "IP Address is required!",
            color: "red",
        });
        return;
    }

    if(!port){
        showNotification({
            title: "Error!",
            message: "Port No. is required!",
            color: "red",
        });
        return;
    }

    if(!username){
        showNotification({
            title: "Error!",
            message: "Username is required!",
            color: "red",
        });
        return;
    }

    if(!password){
        showNotification({
            title: "Error!",
            message: "Password is required!",
            color: "red",
        });
        return;
    }
      
      
    setLoading(true);
  
      const accessToken = session.user.accessToken;
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/settings/biometrics/store-device`;
  
      const data = {
        ip: ipAddress,
        port,
        mac: macAddress,
        serial: serialNo,
        location,
        username,
        password,
        version,
        description,
        branch_id: branch_id,
      };
  
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken} `,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create.");
        }
  
        showNotification({
          title: "Success!",
          message: "ZKteco Device Added Successfully!",
          color: "green",
        });
  
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["branch_id"] = branch_id;
        store.dispatch(getDevices(params));
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
          title="New ZKteco Device"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >

            <TextInput
              placeholder="IP Address Eg. 192.168.1.201"
              label="IP Address"
              withAsterisk
              value={ipAddress}
              onChange={(e) => setIpAddress(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Port No. Eg. 8090"
              label="Port No."
              withAsterisk
              value={port}
              onChange={(e) => setPort(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Username Eg. device1"
              label="Username"
              withAsterisk
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Password Eg. device@2024"
              label="Password"
              withAsterisk
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            
            <TextInput
              placeholder="Mac Address Eg. 00-B0-D0-63-C2-26"
              label="Mac Address"
              value={macAddress}
              onChange={(e) => setMacAddress(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Serial No. Eg. SN:AE9DIURI85JIT8"
              label="Serial No."
              value={serialNo}
              onChange={(e) => setSerialNo(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Device Version Eg. K40"
              label="Device Version"
              value={version}
              onChange={(e) => setVersion(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Location Eg. Moi Avenue, Nairobi"
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.currentTarget.value)}
            />
            <Textarea
              placeholder="Device Description Eg. Fingerprint and card only"
              label="Device Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />

          <section className="flex justify-end space-y-2 mt-3 rounded-lg">
            <Button onClick={handleSubmit} loading={loading}>
              Save Device
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          variant="filled"
          size="xs"

        >
          New Device
        </Button>
      </>
    );
  }
  
  export default BiometricsModal;
  