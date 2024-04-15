import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { Box } from "@mui/material";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import { useSession } from "next-auth/react";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Dashboard",
  },
  {
    to: "/settings",
    title: "Settings",
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [showReceiptSettings, setShowReceiptSettings] = useState(false);
  const [showPrintingDownloads, setShowPrintingDownloads] = useState(false);
  const [showPosImageModal, setShowPosImageModal] = useState(false);
  const [showPosSessionMOdal, setShowPosSessionModal] = useState(false);

 
  const settingCards = useMemo(() => {
    const cards = [

      {
        title: "Tax Settings",
        element: (
          <SettingsCard title="Tax Settings">
            <SettingsLink
              title="Tax"
              subtitle="Set or update tax definitions"
              href="/settings/general-settings/tax"
            />
            {/* <SettingsLink
              title="Default Tax"
              subtitle="Set or update the default tax value"
              href="/settings/inventory/default_tax"
            /> */}
          </SettingsCard>
        ),
      },

      {
        title: "Currency Settings",
        element: (
          <SettingsCard title="Currency Settings">

            <SettingsLink
              title="Currency Exchange"
              subtitle="Manage USD currency exchange settings"
              href="/settings/currency"
            />

          </SettingsCard>
        ),
      },
    ];

    return cards.sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const leftLength = useMemo(
    () => Math.round(settingCards.length / 2),
    [settingCards]
  );

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Access Control" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>

      <div className="w-full flex flex-row flex-wrap">
        <section className="w-full lg:w-6/12 lg:pr-1 space-y-2">
          {settingCards?.slice(0, leftLength).map((card, idx) => (
            <Fragment key={idx}>{card.element}</Fragment>
          ))}
        </section>
        <section className="w-full lg:w-6/12 lg:pl-1 space-y-2">
          {settingCards?.slice(leftLength).map((card, idx) => (
            <Fragment key={idx}>{card.element}</Fragment>
          ))}
        </section>
      </div>


    </Box>
    </PageContainer>
  );
}

function SettingsCard({ title = "", children = null } = {}) {
  return (
    <section className={`w-full h-fit`}>
      <main className="w-full bg-white rounded">
        <div className="text-lg text-dark font-semibold p-4">{title}</div>

        <div className="w-full text-dark">{children}</div>
      </main>
    </section>
  );
}

function SettingsLink({
  title = null,
  subtitle = null,
  href = "/merchants/settings",
} = {}) {
  return (
    <Link href={href}>
      <section className="border-b border-info border-opacity-75 p-4 flex flex-row items-center cursor-pointer hover:bg-info hover:bg-opacity-75">
        <div className="grow">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs">{subtitle}</p>
        </div>
        <div className="flex-none">
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </section>
    </Link>
  );
}

function SettingsAction({
  title = null,
  subtitle = null,
  onClick = () => {},
} = {}) {
  return (
    <section
      className="border-b border-info border-opacity-75 p-4 flex flex-row items-center cursor-pointer hover:bg-info hover:bg-opacity-75"
      onClick={onClick}
    >
      <div className="grow">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs">{subtitle}</p>
      </div>
      <div className="flex-none">
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </section>
  );
}
