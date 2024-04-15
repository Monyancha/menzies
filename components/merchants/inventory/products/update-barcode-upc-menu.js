import { Button, Menu } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { IconChevronDown, IconBarcode, IconPrinter } from "@tabler/icons";
import { useMemo, useState } from "react";
import { submitUIForm } from "@/lib/shared/form-helpers";

export default function UpdateBarcodeUPCMenu() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const productId = router?.query?.productId;
  const next_url = router?.query?.productId;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUPC = async ({ print = "no" } = {}) => {
    const url = `/sellables/product_inventories/${productId}/upc`;

    const body = { print };

    setIsSubmitting(true);

    await submitUIForm({
      accessToken,
      url,
      body,
      onSuccess: () => {
        const next = `/merchants/inventory/products?next_url=${next_url}`;
        router.replace(next);
      },
    });

    setIsSubmitting(false);
  };

  return (
    <Menu shadow="md" width={200} size="xs">
      <Menu.Target>
        <Button
          variant="outline"
          rightIcon={<IconChevronDown size={16} />}
          loading={isSubmitting}
        >
          Generate UPC
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<IconBarcode size={18} />}
          color="blue"
          onClick={() => generateUPC({ print: "no" })}
        >
          Generate &amp; Save
        </Menu.Item>
        <Menu.Item
          icon={<IconPrinter size={18} />}
          color="blue"
          onClick={() => generateUPC({ print: "yes" })}
        >
          Generate, Save &amp; Print
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
