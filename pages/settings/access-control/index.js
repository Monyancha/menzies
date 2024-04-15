import { Box } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import AddAccessGroupModal from "../../../components/merchants/settings/access-control/add-access-group-modal";
import AccessGroupListView from "../../../components/merchants/settings/access-control/access-group-list-view";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    title: "Access Control",
  },
];

function AccessControlPage() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Access Control" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
      <header className="flex flex-wrap justify-between items-end w-full">
          <div className="flex w-full md:w-6/12 flex-wrap"></div>

          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
          <AddAccessGroupModal />
          </div>
        </header>

      <div className="w-full flex flex-wrap mt-2">
        <AccessGroupListView />
      </div>
      </Box>
    </PageContainer>
  );
}

export default AccessControlPage;
