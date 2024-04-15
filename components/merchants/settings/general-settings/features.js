import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../../../store/store";
import { useState } from "react";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import { showNotification } from "@mantine/notifications";
import { Switch, Badge } from "@mantine/core";
import { getFeatureModules } from "../../../../store/merchants/settings/access-control-slice";

function FeatureSettings() {
  const { data: session, status } = useSession();
  //Booking
  const [bookingActive, setBookingActive] = useState("");
  //Staff
  const [staffActive, setStaffActive] = useState("");
  //SMS
  const [smsActive, setSmsActive] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const featureStatus = useSelector(
    (state) => state.accessControl.getFeatureModulesStatus
  );

  const features = useSelector(
    (state) => state.accessControl.getFeatureModules
  );

  const isLoading = featureStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getFeatureModules(params));
  }, [session, status]);

  const data = features;

  useEffect(() => {
    if (data) {
      setBookingActive(data.booking === "1");
      setStaffActive(data.staff === "1");
      setSmsActive(data.trans_sms === "1");
    }
  }, [data]);

  const handleBookingSwitch = async () => {
    try {
      const accessToken = session.user.accessToken;
      const endpoint = bookingActive
        ? `${API_URL}/settings/booking/de-activate`
        : `${API_URL}/settings/booking/activate`;

      console.log("Sending PATCH request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Error occurred while updating module status.");
      }
      const data = await response.json();

      setBookingActive(!bookingActive);

      showNotification({
        title: "Success!",
        message: data?.message,
        color: "green",
      });
    } catch (error) {
      console.error(`Error sending PATCH request: ${error}`);
    }
  };

  const handleStaffSwitch = async () => {
    try {
      const accessToken = session.user.accessToken;
      const endpoint = staffActive
        ? `${API_URL}/settings/staff/de-activate`
        : `${API_URL}/settings/staff/activate`;

      console.log("Sending PATCH request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Error occurred while updating module status.");
      }
      const data = await response.json();

      setStaffActive(!staffActive);

      showNotification({
        title: "Success!",
        message: data?.message,
        color: "green",
      });
    } catch (error) {
      console.error(`Error sending PATCH request: ${error}`);
    }
  };

  const handleSMSSwitch = async () => {
    try {
      const accessToken = session.user.accessToken;
      const endpoint = smsActive
        ? `${API_URL}/settings/sms/de-activate`
        : `${API_URL}/settings/sms/activate`;

      console.log("Sending PATCH request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Error occurred while updating module status.");
      }
      const data = await response.json();

      setSmsActive(!smsActive);

      showNotification({
        title: "Success!",
        message: data?.message,
        color: "green",
      });
    } catch (error) {
      console.error(`Error sending PATCH request: ${error}`);
    }
  };

  return (
    <>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4">
        <div className="flex flex-wrap justify-between items-end">
          <div className="flex w-full md:w-6/12 flex-wrap">
            <h2>Features</h2>
          </div>
        </div>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg">
              <table className="rounded-lg min-w-full" id="inventorySales">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      FEATURE
                    </th>
                    <th scope="col" className="th-primary ">
                      STATUS
                    </th>
                    <th scope="col" className="th-primary text-right">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      Staff Module
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      <span className="flex justify-start items-center w-full gap-2">
                        {staffActive ? (
                          <Badge color="lime">Active</Badge>
                        ) : (
                          <Badge color="red">InActive</Badge>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      <span className="flex justify-end items-center w-full gap-2">
                        <Switch
                          onLabel="ON"
                          offLabel="OFF"
                          size="lg"
                          checked={staffActive}
                          onChange={handleStaffSwitch}
                        />
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      Booking Module
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      <span className="flex justify-start items-center w-full gap-2">
                        {bookingActive ? (
                          <Badge color="lime">Active</Badge>
                        ) : (
                          <Badge color="red">InActive</Badge>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      <span className="flex justify-end items-center w-full gap-2">
                        <Switch
                          onLabel="ON"
                          offLabel="OFF"
                          size="lg"
                          checked={bookingActive}
                          onChange={handleBookingSwitch}
                        />
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3 px-6 text-sm whitespace-nowrap">
                      Transaction/ Visit SMS
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      <span className="flex justify-start items-center w-full gap-2">
                        {smsActive ? (
                          <Badge color="lime">Active</Badge>
                        ) : (
                          <Badge color="red">InActive</Badge>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm whitespace-nowrap ">
                      <span className="flex justify-end items-center w-full gap-2">
                        <Switch
                          onLabel="ON"
                          offLabel="OFF"
                          size="lg"
                          checked={smsActive}
                          onChange={handleSMSSwitch}
                        />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeatureSettings;
