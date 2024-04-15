import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import {
  TDateFilter,
  TSearchFilter,
  Table,
  Thead,
  Trow,
} from "../../../components/ui/layouts/scrolling-table";
import Card from "../../../components/ui/layouts/card";
import TableCardHeader from "../../../components/ui/layouts/table-card-header";
import NewConsignmentModal from "../../../components/consignments/newConsignmentModal";
import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../components/ui/layouts/pagination-links";
import { getConsignments } from "../../../src/store/consignments/consignments-slice";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { Menu, Button, Text, TextInput } from "@mantine/core";
import {
  IconChevronDown,
  IconUsers,
  IconUser,
  IconPlus,
  IconGift,
} from "@tabler/icons-react";
import Link from "next/link";
import ClientsView from "../../../components/partners/clients/clients-view";
import { useRouter } from "next/router";
import { useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import UploadClientsModal from "../../../components/partners/clients/upload-clients-modal";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Clients",
  },
];

function ClientListPage() {
  const { data: session, status } = useSession();


  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Clients" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <Fragment>
      <div className="btn-group">
        <UploadClientsModal />
        <Menu shadow="md" width={200} position="bottom-end" variant="outline">
          <Menu.Target>
            <Button
              leftIcon={<IconPlus size={14} />}
              rightIcon={<IconChevronDown size={14} />}
              variant="outline"
            >
              New
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Register a New Client</Menu.Label>

            <>
              <Link href={`/partners/clients/create`}>
                <Menu.Item
                  icon={<IconUser size={15} color="lime" />}
                  onClick={() => {}}
                >
                  <Text color="lime">Individual</Text>
                </Menu.Item>
              </Link>
              <Link href={`/accounts/customers/create`}>
                <Menu.Item
                  icon={<IconUsers size={15} color="lime" />}
                  onClick={() => {}}
                >
                  <Text color="lime">Company</Text>
                </Menu.Item>
              </Link>
            </>
          </Menu.Dropdown>
        </Menu>
      </div>
    </Fragment>
          </div>
        </header>

      <div className="w-full flex flex-wrap mt-2">
        {/* <ClientsListView /> */}
        <ClientsView />
      </div>
    </Box>
    </PageContainer>
  );
}

export default ClientListPage;
