import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "../../../src/store/merchants/inventory/inventory-slice";
import store from "../../../src/store/Store";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { Button, Menu, TextInput } from "@mantine/core";
import Card from "../../../components/ui/layouts/card";
import { Table, Thead, Trow } from "../../../components/ui/layouts/scrolling-table";
import {
  IconChevronDown,
  IconPencil,
  IconUsers,
  IconCashBanknote,
  IconMathSymbols,
  IconTrash,
  IconFile,
  IconFileInvoice,
} from "@tabler/icons-react";
import { debounce } from "lodash";
import { formatDate } from "../../../lib/shared/data-formatters";
import CreateLinkButton from "../../../components/ui/actions/create-link-button";
import BackButton from "../../../components/ui/actions/back-button";
import DeleteVendorModal from "../../../components/partners/vendors/del-vendor-modal";
import { IconFileAnalytics } from "@tabler/icons-react";

const BCrumb = [
    {
      to: "/dashboard",
      title: "Dashboard",
    },
    {
      title: "Vendors",
    },
  ];

function Vendors() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentVendor, setCurrentVendor] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const vendorStatus = useSelector((state) => state.inventory.getVendorStatus);

  const vendors = useSelector((state) => state.inventory.getVendors);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = vendorStatus === "loading";

  const dispatch = useDispatch();

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(getVendors(params));
  }, [branch_id, session, status]);

  // Avoid recreating the function on every state change
  // https://stackoverflow.com/a/67266725/7450617
  // https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks
  const debouncedSearchRequest = useMemo(
    () =>
      debounce((term) => {
        if (!session || status !== "authenticated") {
          return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["branch_id"] = branch_id;
        if (term) {
          params["filter"] = term;
        }

        dispatch(getVendors(params));
      }, 500),
    [session, status, branch_id, dispatch]
  );

  const sendSearchRequest = useCallback(
    (term) => debouncedSearchRequest(term),
    [debouncedSearchRequest]
  );

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getVendors(params));
  }

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Vendors" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            <Link href={`/reports/purchases/companies`}>
              <Button size="xs" variant="outline" leftIcon={<IconFileInvoice size={18} />}>Vendor Reports</Button>
            </Link>
            <CreateLinkButton href="/partners/vendors/create-vendor" />
          </div>
        </header>

      <Card>
        <div className="flex w-full justify-end">
          <TextInput
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              sendSearchRequest(e.target.value);
            }}
          />
        </div>
        <Table>
          <Thead className="bg-gray-100">
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                EMAIL
              </th>
              {/* <th scope="col" className="th-primary">
                ADDRESS
              </th>
              <th scope="col" className="th-primary">
                CITY
              </th> */}
              <th scope="col" className="th-primary">
                TAX ID
              </th>
              <th scope="col" className="th-primary">
                CREATED AT
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase text-right"
              >
                Actions
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              vendors?.data?.map((item) => (
                <Trow className="border-b" key={item.id}>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-center">
                    {item.id}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.name ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.email ?? "-"}
                  </td>
                  {/* <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.address ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.city ?? "-"}
                  </td> */}
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.tax_id ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.updated_at ? formatDate(item.updated_at) : "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right gap-2 flex">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="outline"
                      >
                        <Menu.Target>
                          <Button
                          variant="outline"
                            rightIcon={<IconChevronDown size={14} />}
                            size="xs"
                          >
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>#{item.id}</Menu.Label>

                          <Link
                            href={`/partners/vendors/edit-vendor/${item.id}`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconPencil size={15} />}
                            >
                              Edit
                            </Menu.Item>
                          </Link>

                          <Link
                            href={`/partners/vendors/contacts?vendorId=${item.id}`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconUsers size={15} />}
                            >
                              Contacts
                            </Menu.Item>
                          </Link>
                          <Link href={`/reports/purchases/${item.id}/`}>
                          <Menu.Item
                              color="blue"
                              icon={<IconFileAnalytics size={15} />}
                            >
                              Statement
                            </Menu.Item>
                          </Link>
                          <Link href={`/partners/vendors/files-summary/${item.id}/`}>
                          <Menu.Item
                              color="blue"
                              icon={<IconFile size={15} />}
                            >
                              Files Summary
                          </Menu.Item>
                          </Link>

                          <Menu.Item
                            icon={<IconTrash size={15} />}
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setCurrentVendor(item);
                            }}
                            color="red"
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </span>
                  </td>
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
          paginatedData={vendors}
          onLinkClicked={onPaginationLinkClicked}
        />

        <DeleteVendorModal
          vendor={currentVendor}
          opened={deleteModalOpen}
          setOpened={setDeleteModalOpen}
        />
      </Card>
      </Box>
    </PageContainer>
  );
}

export default Vendors;
