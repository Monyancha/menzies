import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Card from "../../../ui/layouts/card";
import { TextInput, Textarea, Button, Modal, Select, Menu, Checkbox } from "@mantine/core";

import store from "../../../../store/store";

import { setManufacturedProduct,setRequisition,setRequisitionService } from "@/store/merchants/inventory/requisition-slice";

import { getBookingsSelect } from "@/store/merchants/bookings/bookings-slice";

function AddJobCardService({ item }) {
  const { data: session, status } = useSession();



    const accessToken = session?.user?.accessToken;

    const router = useRouter();

    const branch_id = useSelector((state) => state.branches.branch_id);

    const [opened, setOpened] = useState(false);

    const [selected_service, setService] = useState("");

    const handleJobCard = (product, id) => {
      console.log(product)
      let index_pars = { product_id: product };
      let req_pars = {req_id: id};
      let service_pars = {service_id:selected_service}
      //console.log(req_pars);
      store.dispatch(setManufacturedProduct(index_pars));
      store.dispatch(setRequisition(req_pars));
      store.dispatch(setRequisitionService(service_pars))

      router.push(`/merchants/inventory/jobs/new-job`);
    }




const bookingsSelect = useSelector(
    (state) => state.bookings.getBookingsSelect
);


//Services
const services = bookingsSelect?.products;

const serviceList =
    services?.map((item) => ({
        value: item.id,
        label: item.name,
    })) ?? [];










  return (
    <>
      <Modal
        opened={opened}
        title={`Create Job For  #${item?.requistion_no} Requisition`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="70%"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Select Service For This Requisition
          </span>

          <div className="min-h-96 h-fit w-100 mx-6 mb-10">
                                        <div className="h-full w-full bg-white rounded-xl px-4 py-4 flex flex-col">

                                        <Select
                                placeholder=" "
                                label="Select Service"
                                value={selected_service}
                                onChange={setService}
                                data={serviceList}
                                searchable
                                clearable
                            />




                                            <div
                                                className={`mt-2 mb-2 grid grid-flow-col md:grid-flow-row grid-cols-2 gap-2 overflow-x-auto`}
                                            >
                                                <div className=""></div>

                                                <div className="">



                                                    <Button

                                                        size="md"
                                                        onClick={() => handleJobCard(item?.sellables?.sellable?.id, item?.id)}
                                                    >
                                                         <b>CREATE JOB CARD</b>

                                                    </Button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
        </section>

        {/* <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section> */}
      </Modal>

      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        Job Card
      </Button>
    </>
  );
}

export default AddJobCardService;
