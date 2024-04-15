import { useSelector } from "react-redux";
import { hasActiveSubscription } from "@/store/merchants/settings/access-control-slice";
import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";

function SubscriptionExpiredAlert({ isActive = false } = {}) {
  const [opened, setOpened] = useState(true);
  const isSubscriptionActive = useSelector(hasActiveSubscription) || isActive;

  if (isSubscriptionActive || !opened) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 gap-2 flex z-50">
      <div className="w-fit shadow-lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Subscription Expired"
          color="yellow"
          variant="filled"
          withCloseButton
          onClose={() => setOpened(false)}
        >
          <span className="gap-1">
            <span>Your subscription has expired.</span>

            <Link href="/merchants/settings/billing">
              <span className="ml-2 underline cursor-pointer">
                Click here to renew
              </span>
            </Link>
          </span>
        </Alert>
      </div>
    </div>
  );
}

export default SubscriptionExpiredAlert;
