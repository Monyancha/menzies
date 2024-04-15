import { Box } from "@mui/material";
import Breadcrumb from "../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../src/components/container/PageContainer";
import AccessGroupPermissionsListView from "../../../../components/merchants/settings/access-control/access-group-permissions-list-view";

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
    title: "Permissions",
  },
];

function AccessGroupPermissionsPage() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Access Control" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <div className="w-full flex flex-wrap mt-2">
        <AccessGroupPermissionsListView />
      </div>
      </Box>
    </PageContainer>
  );
}

export default AccessGroupPermissionsPage;
