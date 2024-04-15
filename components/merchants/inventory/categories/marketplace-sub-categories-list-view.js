import store from "../../../../store/store";
import { useEffect, useState } from "react";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import { ActionIcon, Button, Menu, TextInput } from "@mantine/core";
import { useSelector } from "react-redux";
import { fetchMarketplaceSubCategories } from "../../../../store/merchants/inventory/categories-slice";
import { formatDate } from "../../../../lib/shared/data-formatters";
import { useRouter } from "next/router";
import EditMarketplaceSubCategory from "./edit-marketplace-sub-category-modal";
import Link from "next/link";
import { IconChartInfographic, IconChevronDown } from "@tabler/icons";

function MarketplaceSubCategoriesListView() {
  const router = useRouter();
  const marketplaceCategoryId = router?.query?.marketplaceCategoryId ?? "";
  const categoryName = useSelector(
    (state) =>
      state.categories.marketplaceCategoryList?.data.find(
        (item) => item.id == marketplaceCategoryId
      )?.name ?? "-"
  );

  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const marketplaceSubCategoryStatus = useSelector(
    (state) => state.categories.marketplaceSubCategoryStatus
  );
  const rawData = useSelector(
    (state) => state.categories.marketplaceSubCategoryList
  );

  const isLoading = marketplaceSubCategoryStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated" || !router.isReady) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["marketplaceCategoryId"] = marketplaceCategoryId;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchMarketplaceSubCategories(params));
  }, [session, status, searchTerm, marketplaceCategoryId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["marketplaceCategoryId"] = marketplaceCategoryId;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchMarketplaceSubCategories(params));
  }

  function getReportParams(item) {
    let url = `/merchants/reports/sales/sellables?`;
    const params = {
      category_id: marketplaceCategoryId,
      category_name: categoryName,
      sub_category_id: item.id,
      sub_category_name: item.name,
      prev_url: `/merchants/inventory/marketplace-categories/${marketplaceCategoryId}`,
    };

    url += new URLSearchParams(params);

    return url;
  }

  function getInventoryReportParams(item) {
    let url = `/merchants/reports/sellables/inventory/inventory-report?`;
    const params = {
      category_id: marketplaceCategoryId,
      category_name: categoryName,
      sub_category_id: item.id,
      sub_category_name: item.name,
      prev_url: `/merchants/inventory/marketplace-categories/${marketplaceCategoryId}`,
    };

    url += new URLSearchParams(params);

    return url;
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
                      <EditMarketplaceSubCategory category={item} />

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
                          >
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>#{item.id}</Menu.Label>

                          <Link href={getInventoryReportParams(item)}>
                            <Menu.Item>Inventory Report</Menu.Item>
                          </Link>

                          <Link href={getReportParams(item)}>
                            <Menu.Item>Sales Report</Menu.Item>
                          </Link>
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
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default MarketplaceSubCategoriesListView;
