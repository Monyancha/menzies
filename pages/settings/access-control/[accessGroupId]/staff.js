import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import AccessGroupUsersListView from "../../../../components/merchants/settings/access-control/access-group-users-list-view";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/settings/access-control",
    title: "Access Groups",
  },
  {
    title: "Staff",
  },
];

function AccessGroupStaffPage() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Access Control" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
      <div className="w-full flex flex-wrap mt-2">
        <AccessGroupUsersListView />
      </div>
      </Box>
    </PageContainer>
  );
}

export default AccessGroupStaffPage;
