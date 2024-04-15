import { useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { formatDate } from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../src/store/Store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { fetchAccessGroups } from "../../../../src/store/access/access-control-slice";
import { Menu, Button, Text } from "@mantine/core";
import { IconChevronDown, IconUsers, IconLockAccess } from "@tabler/icons-react";
import Link from "next/link";
import DeleteAccessGroupModal from "./delete-access-group-modal";

function AccessGroupListView() {
  const { data: session, status } = useSession();

  const rawData = useSelector((state) => state.accessControl.accessGroupList);
  const accessGroupListStatus = useSelector(
    (state) => state.accessControl.accessGroupListStatus
  );
  const isLoading = accessGroupListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    //TODO::Allow refreshing
    store.dispatch(
      fetchAccessGroups({ accessToken: session.user.accessToken })
    );
  }, [session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(fetchAccessGroups(params));
  }

  return (
    <Card>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary text-right">
              UPDATED AT
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData &&
            rawData.data.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td className="text-right">{formatDate(item?.updated_at)}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="outline"
                      >
                        <Menu.Target>
                          <Button variant="outline" rightIcon={<IconChevronDown size={14} />}>
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>
                            #{item.id + " - " + item.name}
                          </Menu.Label>

                          <>
                            <Link
                              href={`/settings/access-control/${item.id}/staff`}
                            >
                              <Menu.Item
                                icon={<IconUsers size={15} color="blue" />}
                                onClick={() => {}}
                              >
                                <Text color="blue">
                                  Staff
                                  <span className="text-xs">
                                    {` (${item.access_group_users?.length})`}
                                  </span>
                                </Text>
                              </Menu.Item>
                            </Link>

                            <Link
                              href={`/settings/access-control/${item.id}/permissions`}
                            >
                              <Menu.Item
                                icon={<IconLockAccess size={18} color="lime" />}
                                onClick={() => {}}
                              >
                                <Text color="lime">
                                  Permissions
                                  <span className="text-xs">
                                    {` (${item.access_group_pages?.length})`}
                                  </span>
                                </Text>
                              </Menu.Item>
                            </Link>
                          </>
                        </Menu.Dropdown>
                      </Menu>

                      <DeleteAccessGroupModal itemId={item.id} />
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

      <PaginationLinks
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default AccessGroupListView;
