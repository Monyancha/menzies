import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Menu } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextInput } from "@mantine/core";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import store from "../../../src/store/Store";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import BackButton from "../../../components/ui/actions/back-button";
import CreateLinkButton from "../../../components/ui/actions/create-link-button";
import { Table, Trow } from "../../../components/ui/layouts/scrolling-table";
import { debounce } from "lodash";
import { fetchContacts } from "../../../src/store/merchants/inventory/inventory-slice";
import { IconChevronDown, IconPencil, IconTrash } from "@tabler/icons-react";
import Card from "../../../components/ui/layouts/card";
import DeleteContactModal from "../../../components/partners/vendors/del-contact-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/partners/vendors",
    title: "Vendors",
  },
  {
    title: "contacts",
  },
];

function Contacts() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const vendorId = router?.query?.vendorId ?? "";

  const dataStatus = useSelector((state) => state.inventory.contactListStatus);

  const contactList = useSelector((state) => state.inventory.contactList);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = dataStatus === "loading";

  const [currentRecord, setCurrentRecord] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["vendorId"] = vendorId;

    store.dispatch(fetchContacts(params));
  }, [session, status, vendorId]);

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
        params["vendorId"] = vendorId;
        if (term) {
          params["filter"] = term;
        }

        dispatch(fetchContacts(params));
      }, 500),
    [session, status, dispatch, branch_id, vendorId]
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
    params["vendorId"] = vendorId;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    dispatch(fetchContacts(params));
  }


  return (
    <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Contacts" items={BCrumb} />
    {/* end breadcrumb */}
    <Box>

    <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <CreateLinkButton
            href={`/partners/vendors/add-contact?vendorId=${vendorId}`}
            withIcon={false}
          />
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
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="th-primary">
                ID
              </th>
              <th scope="col" className="th-primary">
                NAME
              </th>
              <th scope="col" className="th-primary">
                COMPANY
              </th>
              <th scope="col" className="th-primary">
                EMAIL
              </th>
              <th scope="col" className="th-primary">
                ADDRESS
              </th>
              <th scope="col" className="th-primary">
                CITY
              </th>
              <th scope="col" className="th-primary">
                ID NUMBER
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase text-right"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              contactList?.data?.map((item) => (
                <Trow className="border-b" key={item.id}>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-center">
                    {item.id}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.name}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item?.company?.name ?? "-"}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.email}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.address}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.city}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap ">
                    {item.id_number}
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
                            rightIcon={<IconChevronDown size={14} />}
                            size="xs"
                            variant="outline"
                          >
                            Actions
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>#{item.id}</Menu.Label>

                          <Link
                            href={`/partners/vendors/edit-contact/${item.id}?vendorId=${vendorId}`}
                          >
                            <Menu.Item
                              color="blue"
                              icon={<IconPencil size={15} />}
                            >
                              Edit
                            </Menu.Item>
                          </Link>

                          <Menu.Item
                            icon={<IconTrash size={15} />}
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setCurrentRecord(item);
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
          paginatedData={contactList}
          onLinkClicked={onPaginationLinkClicked}
        />

        <DeleteContactModal
          record={currentRecord}
          opened={deleteModalOpen}
          setOpened={setDeleteModalOpen}
        />
      </Card>
      </Box>
    </PageContainer>
  );
}

export default Contacts;
