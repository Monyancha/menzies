import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "../../ui/layouts/card";
import {
  Table,
  Thead,
  Trow,
  TSearchFilter,
} from "../../ui/layouts/scrolling-table";
import { formatDate } from "../../../lib/shared/data-formatters";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../src/store/Store";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { Menu, Button, Text } from "@mantine/core";
import { IconChevronDown, IconEye, IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import TableCardHeader from "../../ui/layouts/table-card-header";
import { fetchCompanies } from "../../../src/store/accounts/accounts-slice";
import UploadCompaniesModal from "./upload-companies-modal";

export default function CompaniesListView() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const [searchTerm, setSearchTerm] = useState("");

  const companyListStatus = useSelector(
    (state) => state.accounts.companyListStatus
  );
  const companyList = useSelector((state) => state.accounts.companyList);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = companyListStatus === "loading";

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchCompanies(params));
  }, [accessToken, searchTerm, branch_id]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;
    params["page"] = page;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchCompanies(params));
  }

  const actions = (
    <div className="flex items-end gap-2">
      <UploadCompaniesModal />
    </div>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <TSearchFilter onChangeSearchTerm={setSearchTerm} />
      </TableCardHeader>

      <Table>
        <Thead>
          <tr>
            {/* <th scope="col" className="th-primary">
              ID NO
            </th> */}
            <th scope="col" className="th-primary">
              NAME
            </th>
            {/* <th scope="col" className="th-primary">
              CONTACT NAME
            </th> */}
            <th scope="col" className="th-primary">
              CONTACT EMAIL
            </th>
            <th scope="col" className="th-primary">
              CONTACT PHONE
            </th>
            <th scope="col" className="th-primary text-right">
              CREATED AT
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            companyList &&
            companyList?.data.map((item) => (
              <Trow key={item.id}>
                <>
                  {/* <td>{item.id}</td> */}
                  <td>{item.name}</td>
                  {/* <td>{item.contact_name ?? "-"}</td> */}
                  <td>{item.contact_email ?? "-"}</td>
                  <td>{item.contact_phone ?? "-"}</td>

                  <td className="text-right">
                    {item?.created_at ? formatDate(item?.created_at) : "-"}
                  </td>

                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="outline"
                      >
                        <Menu.Target>
                          <Button
                            rightIcon={<IconChevronDown size={14} />}
                            size="xs"
                            variant="outline"
                          >
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>
                            #{item.id + " - " + item.name}
                          </Menu.Label>

                          <>
                            <Link
                              href={`/accounts/customers/${item.id}`}
                            >
                              <Menu.Item
                                icon={<IconEye size={15} color="lime" />}
                                onClick={() => {}}
                              >
                                <Text color="lime">View</Text>
                              </Menu.Item>
                            </Link>
                            <Link
                              href={`/accounts/customers/${item.id}/edit`}
                            >
                              <Menu.Item
                                icon={<IconPencil size={15} color="blue" />}
                                onClick={() => {}}
                              >
                                <Text color="blue">Edit</Text>
                              </Menu.Item>
                            </Link>
                          </>
                        </Menu.Dropdown>
                      </Menu>
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
        paginatedData={companyList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}
