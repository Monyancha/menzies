import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Button, Select, Checkbox } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { submitAccessGroupUsers } from "../../../../src/store/merchants/settings/access-control-slice";

function AccessGroupUsersListView() {
  const { data: session, status } = useSession();
  const [staffAccessGrants, setStaffAccessGrants] = useState({});
  const [branch, setBranch] = useState();

  const dispatch = useDispatch();
  const router = useRouter();
  const accessGroupId = router?.query?.accessGroupId ?? "-1";

  const isSubmitting = useSelector(
    (state) => state.accessControl.submitAccessGroupUsersStatus === "loading"
  );
  
  const branch_id = useSelector((state) => state.branches.branch_id);

  const accessGroupListStatus = useSelector(
    (state) => state.accessControl.accessGroupListStatus
  );

  const isLoading = accessGroupListStatus === "loading";
  const staffList = useSelector((state) => state.staff.staffList ?? []);

  const currentAccessGroup = useSelector((state) =>
    state.accessControl.accessGroupList?.data?.find(
      (item) => item.id == accessGroupId
    )
  );

  useEffect(() => {
    const accessGroupUsers = currentAccessGroup?.access_group_users ?? [];
    let staffAccess = {};

    staffList.forEach((staff) => {
      if (!staff.user_id) {
        return;
      }
      const staffHasAccess = accessGroupUsers.find(
        (record) => record.user_id == staff.user_id
      );
      staffAccess[staff.user_id] = staffHasAccess ? true : false;
    });

    setStaffAccessGrants({ ...staffAccess });
  }, [staffList, currentAccessGroup]);

  async function submitRecords() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["accessGroupId"] = accessGroupId;
    params["accessGroupUsers"] = [];
    params["branch_id"] = branch_id;

    for (const key in staffAccessGrants) {
      if (staffAccessGrants[key]) {
        params["accessGroupUsers"].push(key);
      }
    }

    try {
      await dispatch(submitAccessGroupUsers(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Records saved successfully",
        color: "green",
      });

      router.push(
        `/settings/access-control/${accessGroupId}/permissions`
      );

      // TODO: The dispatch returns this updated access group update the redux list of access groups
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save records";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    }
  }

  return (
    <Card>
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-dark font-bold">{currentAccessGroup?.name}</h3>

        <Button
          loading={isSubmitting}
          leftIcon={<IconDeviceFloppy size={16} />}
          onClick={submitRecords}
          variant="outline"
        >
          Save
        </Button>
      </div>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              STAFF
            </th>
            <th scope="col" className="th-primary text-right">
              GRANT ACCESS
            </th>
          </tr>
        </Thead>
        <tbody>
          {staffList.map((item) => (
            <Trow key={item.id}>
              <>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td className="py-0 pl-14 2xl:pl-4">
                  <span className="flex justify-end items-center w-full gap-2">
                    <Checkbox
                      checked={staffAccessGrants[item.user_id] ?? false}
                      onChange={(event) => {
                        if (!item.user_id) {
                          return;
                        }

                        const accessGrants = { ...staffAccessGrants };

                        accessGrants[item.user_id] =
                          event.currentTarget.checked;

                        setStaffAccessGrants(accessGrants);
                      }}
                    />
                  </span>
                </td>
              </>
            </Trow>
          ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Card>
  );
}

export default AccessGroupUsersListView;
