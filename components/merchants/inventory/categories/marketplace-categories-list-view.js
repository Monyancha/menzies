import store from "../../../../store/store";
import { useEffect, useState } from "react";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import { ActionIcon, Button, Menu, TextInput } from "@mantine/core";
import { useSelector } from "react-redux";
import {
  fetchMarketplaceCategories,
  fetchPlatformCategories,
} from "../../../../store/merchants/inventory/categories-slice";
import { formatDate } from "../../../../lib/shared/data-formatters";
import EditMarketplaceCategory from "./edit-marketplace-category-modal";
import Link from "next/link";
import { IconEye, IconChevronDown } from "@tabler/icons";
import DelTable from "../del-modals/del-table-modal";

function MarketplaceCategoriesListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const marketplaceCategoryStatus = useSelector(
    (state) => state.categories.marketplaceCategoryStatus
  );
  const branch_id = useSelector((state) => state.branches.branch_id);
  const rawData = useSelector(
    (state) => state.categories.marketplaceCategoryList
  );

  const isLoading = marketplaceCategoryStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    store.dispatch(fetchPlatformCategories(params));
  }, [branch_id, session, status]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["branch_id"] = branch_id;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchMarketplaceCategories(params));
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

    store.dispatch(fetchMarketplaceCategories(params));
  }

  function getReportParams(item) {
    let url = `/merchants/reports/sales/sellables?`;
    const params = {
      category_id: item.id,
      category_name: item.name,
      prev_url: `/merchants/inventory/marketplace-categories`,
    };

    url += new URLSearchParams(params);

    return url;
  }

  function getInventoryReportParams(item) {
    let url = `/merchants/reports/sellables/inventory/inventory-report?`;
    const params = {
      category_id: item.id,
      category_name: item.name,
      prev_url: `/merchants/inventory/marketplace-categories`,
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
                  <td className="text-right">
                    {item.product_sub_categories_count}
                  </td>
                  <td>{formatDate(item.created_at)}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <EditMarketplaceCategory category={item} />

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

                          <Link
                            href={`/merchants/inventory/marketplace-categories/${item.id}`}
                          >
                            <Menu.Item
                              color="blue"
                              size="xs"
                              icon={<IconEye size={14} />}
                            >
                              View
                            </Menu.Item>
                          </Link>

                          <Link href={getInventoryReportParams(item)}>
                            <Menu.Item>Inventory Report</Menu.Item>
                          </Link>

                          <Link href={getReportParams(item)}>
                            <Menu.Item>Sales Report</Menu.Item>
                          </Link>
                        </Menu.Dropdown>
                      </Menu>
                      <DelTable item={item} source="inventory_categories" />
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

export default MarketplaceCategoriesListView;
