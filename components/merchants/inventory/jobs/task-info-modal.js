import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { Table } from "@/components/ui/layouts/scrolling-table";
import {
  formatDate,
  parseValidFloat,
  formatNumber,
} from "@/lib/shared/data-formatters";
import {
  submitEditBranch,
  fetchCategoriesList,
} from "../../../../store/merchants/settings/branches-slice";
import { IconUsers, IconEye } from "@tabler/icons";

function TaskInfoModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  //   const platformCategoryData =
  //     platformCategories?.map((item) => ({
  //       value: item.id,
  //       label: item.name,
  //     })) ?? [];

  //   const selectedPlatformCategory = platformCategories?.find(
  //     (item) =>
  //       item.id === psCategoryId ||
  //       item.sub_categories?.find((subItem) => subItem.id == psSubcategoryId)
  //   );

  //   const platformSubcategoryData =
  //     selectedPlatformCategory?.sub_categories?.map((item) => ({
  //       value: item.id,
  //       label: item.name,
  //     })) ?? [];

  return (
    <>
      <Modal
        opened={opened}
        title={`#${item?.name}`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="70%"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            {item?.name} Details
          </span>
          <Table>
            <thead className="">
              <tr>
                <th scope="col" className="th-primary text-darkest">
                  Cost
                </th>
                <th scope="col" className="th-primary text-darkest">
                  Charge Type
                </th>
                {item?.charge_type=="All" && (
                  <th scope="col" className="th-primary text-darkest">
                  Weight
                </th>
                )}
                <th scope="col" className="th-primary text-darkest">
                  No Of Staff Assigned
                </th>
                <th scope="col" className="th-primary text-darkest">
                  Start Date
                </th>
                <th scope="col" className="th-primary text-darkest">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.cost}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.charge_type}
                </td>
                {item?.charge_type=="All" && (<td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.weight_quantity} {item?.unit_of_measure ?? " "}
                </td>)}
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {item?.staff_tasks.length}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {formatDate(item?.start_date)}
                </td>
                <td className="py-3 px-6 text-sm whitespace-nowrap">
                  {formatDate(item?.end_date)}
                </td>
              </tr>
            </tbody>
          </Table>
        </section>

        {item?.staff_tasks.length > 0 && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <span className="text-dark text-sm font-bold">
              List Of Staff Assigned
            </span>
            <Table>
              <thead className="">
                <tr>
                  <th scope="col" className="th-primary text-darkest">
                    Name
                  </th>
                  <th scope="col" className="th-primary text-darkest">
                    Phone
                  </th>
                  <th scope="col" className="th-primary text-darkest">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {item?.staff_tasks.length > 0 &&
                  item?.staff_tasks?.map((it, index) => (
                    <tr className="border-b" key={index}>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {it?.staffs?.name}
                      </td>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {it?.staffs?.user?.phone ?? "-"}
                      </td>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {it?.staffs?.user?.email ?? "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </section>
        )}

        {item?.item_tasks.length > 0 && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <span className="text-dark text-sm font-bold">
              List Of Laundry Items
            </span>
            <Table>
              <thead className="">
                <tr>
                  <th scope="col" className="th-primary text-darkest">
                    Item
                  </th>
                  <th scope="col" className="th-primary text-darkest">
                    Quantity
                  </th>
                  <th scope="col" className="th-primary text-darkest">
                    Cost
                  </th>
                  <th scope="col" className="th-primary text-darkest">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {item?.item_tasks.length > 0 &&
                  item?.item_tasks?.map((it, index) => (
                    <tr className="border-b" key={index}>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {it?.items?.name}
                      </td>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {it?.quantity ?? "-"}
                      </td>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {formatNumber(
                          parseValidFloat(it?.total_cost) /
                            parseValidFloat(it?.quantity)
                        ) ?? "-"}
                      </td>
                      <td className="py-3 px-6 text-sm whitespace-nowrap">
                        {formatNumber(it?.total_cost) ?? "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Total : Kshs {formatNumber(item?.cost)}</td>
                </tr>
              </tfoot>
            </Table>
          </section>
        )}
      </Modal>
      <IconEye
        onClick={() => setOpened(true)}
        className="w-5 h-5 text-gray-500"
      />
      {/* <Button
        leftIcon={<IconPencil size={14} />}
        variant="outline"

        size="xs"
      >
        Edit
      </Button> */}
    </>
  );
}

export default TaskInfoModal;
