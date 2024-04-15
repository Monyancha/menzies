import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Button, Checkbox } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { IconChecks } from "@tabler/icons-react";
import {
  fetchPermissions,
  submitAccessGroupPages,
} from "../../../../src/store/merchants/settings/access-control-slice";
import store from "../../../../src/store/Store";

function AccessGroupPermissionsListView() {
  const { data: session, status } = useSession();

  const [permissionAccessGrants, setPermissionAccessGrants] = useState({});
  const [pageAccessGrants, setPageAccessGrants] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  const accessGroupId = router?.query?.accessGroupId ?? "-1";

  const isSubmitting = useSelector(
    (state) => state.accessControl.submitAccessGroupPagesStatus === "loading"
  );

  const currentAccessGroup = useSelector((state) =>
    state.accessControl.accessGroupList?.data?.find(
      (item) => item.id == accessGroupId
    )
  );

  const permissionsList = useSelector(
    (state) => state.accessControl.permissionsList
  );

  const permissionListStatus = useSelector(
    (state) => state.accessControl.permissionsListStatus
  );

  const isLoading = permissionListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    //TODO::Allow refreshing
    if (permissionListStatus === "idle") {
      store.dispatch(
        fetchPermissions({ accessToken: session.user.accessToken })
      );
    }
  }, [session, status, permissionListStatus]);

  useEffect(() => {
    if (!permissionsList) {
      return;
    }

    const accessGroupPages = currentAccessGroup?.access_group_pages ?? [];
    const accessGroupPermissions =
      currentAccessGroup?.access_group_permissions ?? [];

    let pageAccess = {};
    let grantedPermissions = {};

    permissionsList.forEach((permission_page) => {
      const hasPageAccess = accessGroupPages.find(
        (record) => record.accessible_page_id == permission_page.id
      );
      pageAccess[permission_page.id] = hasPageAccess ? true : false;

      permission_page?.grantable_permissions?.forEach(
        (grantable_permission) => {
          const hasPermission = accessGroupPermissions.find(
            (record) =>
              record.grantable_permission_id == grantable_permission?.id
          );

          grantedPermissions[grantable_permission.id] = hasPermission
            ? true
            : false;
        }
      );
    });

    setPageAccessGrants({ ...pageAccess });
    setPermissionAccessGrants({ ...grantedPermissions });
  }, [permissionsList, currentAccessGroup]);

  function updatePermissionAccessGrant(permission_id) {
    return (event) => {
      const permissionGrants = { ...permissionAccessGrants };
      permissionGrants[permission_id] = event.currentTarget.checked;

      setPermissionAccessGrants(permissionGrants);
    };
  }

  function updatePageAccessGrant(accessible_page_id) {
    return (event) => {
      const pageGrants = { ...pageAccessGrants };
      pageGrants[accessible_page_id] = event.currentTarget.checked;

      setPageAccessGrants(pageGrants);
    };
  }

  function grantAllPermissions() {
    const pageGrants = { ...pageAccessGrants };
    for (const key in pageGrants) {
      pageGrants[key] = true;
    }

    setPageAccessGrants(pageGrants);
  }

  async function submitRecords() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["accessGroupId"] = accessGroupId;
    params["accessGroupPages"] = [];
    params["accessGroupPermissions"] = [];

    for (const key in pageAccessGrants) {
      if (pageAccessGrants[key]) {
        params["accessGroupPages"].push(key);
      }
    }

    for (const key in permissionAccessGrants) {
      if (permissionAccessGrants[key]) {
        params["accessGroupPermissions"].push(key);
      }
    }

    try {
      await dispatch(submitAccessGroupPages(params)).unwrap();

      showNotification({
        title: "Success",
        message: "Records saved successfully",
        color: "green",
      });

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
        <h3 className="text-dark font-bold">
          {currentAccessGroup?.name}{" "}
          <span className="text-primary">Permissions</span>
        </h3>
        <div className="flex justify-end gap-2 items-center">
          <Button
            variant="outline"
            color="green"
            leftIcon={<IconChecks />}
            onClick={grantAllPermissions}
          >
            Grant All
          </Button>

          <Button
            loading={isSubmitting}
            leftIcon={<IconDeviceFloppy size={16} />}
            onClick={submitRecords}
            variant="outline"
          >
            Save
          </Button>
        </div>
      </div>

      {!isLoading && (
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                PAGES
              </th>
              <th scope="col" className="th-primary">
                GRANT ACCESS
              </th>
              <th scope="col" className="th-primary">
                SUB-PERMISSIONS
              </th>
            </tr>
          </Thead>
          <tbody>
            {permissionsList?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td className="capitalize">{item.name.replace(/_/g, " ")}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-start items-center w-full gap-2">
                      <Checkbox
                        checked={pageAccessGrants[item.id] ?? false}
                        onChange={updatePageAccessGrant(item.id)}
                      />
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-64 lg:w-full">
                      {item.grantable_permissions.map((permission) => (
                        <Checkbox
                          key={permission.name}
                          label={permission.name
                            .replace(/_/g, " ")
                            .replace("can", "")}
                          checked={
                            permissionAccessGrants[permission.id] ?? false
                          }
                          onChange={updatePermissionAccessGrant(permission.id)}
                        />
                      ))}
                    </span>
                  </td>
                </>
              </Trow>
            ))}
          </tbody>
        </Table>
      )}

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}
    </Card>
  );
}

export default AccessGroupPermissionsListView;
