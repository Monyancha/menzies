import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

function CreateTableForm() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chairs, setChairs] = useState("");

  const router = useRouter();

  const branch_id = useSelector((state) => state.branches.branch_id);

  console.log(session);

  const submitTable = async (event) => {
    event.preventDefault();

    if (!name) {
      showNotification({
        title: "Error",
        message: "Table Name is required!",
        color: "red",
      });
      return;
    }

    if (!chairs) {
      showNotification({
        title: "Error",
        message: "No. of Chairs is required!",
        color: "red",
      });
      return;
    }

    const data = {
      name: name,
      description: description,
      no_of_chairs: chairs,
      merchant_id: session.user.id,
      branch_id: branch_id,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/restaurant-tables`;

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

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log("Response Status", response);

    setName("");
    setDescription("");
    setChairs("");

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Your table has been added Successfully",
        color: "green",
      });
      router.push("/merchants/inventory/restaurant");
    } else {
      showNotification({
        title: "Error",
        message: "Error " + result.statusText,
        color: "error",
      });
    }
  };

  return (
    <Fragment>
      <div className="min-h-96 h-fit w-100 mx-6">
        <form type="submit">
          <div className="h-full w-full bg-white rounded-t-xl px-6 py-4 pb-8">
            <h3>Table Information</h3>
            <div className="flex flex-wrap justify-between items-stretch">
              <div className="basis-full md:basis-6/12 flex flex-col justify-between flex-wrap h-auto">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Name</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="input-primary h-12 text-sm"
                    placeholder="Table 1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Description</span>
                  </div>
                  <input
                    type="text"
                    name="description"
                    className="input-primary h-12 text-sm"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="basis-full md:basis-6/12 flex flex-col justify-start flex-wrap">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>No of Chairs</span>
                  </div>
                  <input
                    type="text"
                    name="no_of_chairs"
                    className="input-primary h-12 text-sm"
                    placeholder="No of Chairs"
                    value={chairs}
                    onChange={(e) => setChairs(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-full bg-white rounded-b-xl px-6 py-4 mt-1">
            <div className="flex justify-start mx-2 space-x-2">
              <button
                type="submit"
                onClick={submitTable}
                className="btn btn-primary gap-2"
              >
                <i className="fa-solid fa-save" />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default CreateTableForm;
