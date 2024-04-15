import store from "../../../../store/store";
import { useEffect, useState } from "react";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import { TextInput } from "@mantine/core";
import { useSelector } from "react-redux";
import { fetchStoreSubCategories } from "../../../../store/merchants/inventory/categories-slice";
import { formatDate } from "../../../../lib/shared/data-formatters";
import { useRouter } from "next/router";
import EditStoreSubCategoryModal from "./edit-store-sub-category-modal";

function StoreSubCategoriesListView() {
  const router = useRouter();
  const storeCategoryId = router?.query?.storeCategoryId ?? "";

  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const storeSubCategoryStatus = useSelector(
    (state) => state.categories.storeSubCategoryStatus
  );
  const rawData = useSelector((state) => state.categories.storeSubCategoryList);

  const branch_id = useSelector((state) => state.branches.branch_id);

  const isLoading = storeSubCategoryStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated" || !router.isReady) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["storeCategoryId"] = storeCategoryId;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchStoreSubCategories(params));
  }, [branch_id, session, status, searchTerm, storeCategoryId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;
    params["storeCategoryId"] = storeCategoryId;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchStoreSubCategories(params));
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
              CREATED AT
            </th>
            <th scope="col" className="th-primary text-right">
              UPDATED AT
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
                  <td className="text-right">{formatDate(item.created_at)}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <EditStoreSubCategoryModal category={item} />
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

export default StoreSubCategoriesListView;
