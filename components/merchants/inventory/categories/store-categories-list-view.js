import store from "../../../../store/store";
import { useEffect, useState } from "react";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import { Button, TextInput } from "@mantine/core";
import { useSelector } from "react-redux";
import { fetchStoreCategories } from "../../../../store/merchants/inventory/categories-slice";
import { formatDate } from "../../../../lib/shared/data-formatters";
import EditStoreCategory from "./edit-store-category-modal";
import Link from "next/link";
import DelTable from "../del-modals/del-table-modal";

function StoreCategoriesListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const storeCategoryStatus = useSelector(
    (state) => state.categories.storeCategoryStatus
  );
  const rawData = useSelector((state) => state.categories.storeCategoryList);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = storeCategoryStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }
    params["branch_id"] = branch_id;

    store.dispatch(fetchStoreCategories(params));
  }, [branch_id, session, status, searchTerm]);

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

    store.dispatch(fetchStoreCategories(params));
  }

  return (
    <Card>
      <div className="flex w-full justify-end">
        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
              SUB CATEGORIES
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
            rawData?.data?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td className="text-right">{item.sub_categories_count}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <EditStoreCategory category={item} />

                      <Link
                        href={`/merchants/inventory/store-categories/${item.id}`}
                      >
                        <Button variant="outline" size="xs">
                          View
                        </Button>
                      </Link>
                      <DelTable item={item} source="instore_categories" />
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

export default StoreCategoriesListView;
