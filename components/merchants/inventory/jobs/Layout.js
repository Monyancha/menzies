import MerchantBaseLayout from "../../../../components/layouts/merchant-base-layout";
import { Fragment } from "react";
import AnchorButton from "../../../../components/ui/actions/anchor-button";
import LinkCrumb from "../../../../components/ui/actions/link-crumb";
import MutedCrumb from "@/components/ui/actions/muted-crumb";
import BreadCrumbsHeader from "@/components/ui/layouts/breadcrumbs-header";
import TopBar from "pages/merchants/inventory/jobs/TopBar";
import SideBar from "pages/merchants/inventory/jobs/SideBar";
import BackButton from "@/components/ui/actions/back-button";
import { IconListDetails,IconPlus } from "@tabler/icons";
import Link from "next/link";
import { Button } from "@mantine/core";

function Layout({children}) {
  const breadCrumbActions=  (
   
     <Fragment>
     <div className="space-x-1">
     <BackButton href="/merchants/inventory/jobs" />
       <Link href="/merchants/inventory/jobs/tabular">
         <Button variant="outline" leftIcon={<IconListDetails size={14} />} size="xs">
         Tabular View
         </Button>
       </Link>
       <Link href="/merchants/inventory/jobs/new-job">
         <Button leftIcon={<IconPlus size={14} />} size="xs">
           New Job
         </Button>
       </Link>
     </div>
   </Fragment>
  );
    return (
        <MerchantBaseLayout>
      <BreadCrumbsHeader title="Job Cards List" actions={breadCrumbActions}>
        <LinkCrumb title="Home" href="/" />
        <MutedCrumb title="Jobs" />
      </BreadCrumbsHeader>

      <div className="w-full flex flex-wrap mt-2">
                {children}
                </div>
    </MerchantBaseLayout>
    );
}

export default Layout;