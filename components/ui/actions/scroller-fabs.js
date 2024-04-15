import WhatsappSupportAction from "@/components/layouts/whatsapp-support-action";
import { ActionIcon } from "@mantine/core";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons";

function ScrollerFabs() {
  return (
    <div className="fixed bottom-0 right-0 p-4 gap-2 flex flex-col items-end z-50">
      <WhatsappSupportAction />

      <div className="flex gap-2 xl:hidden">
        <ActionIcon
          variant="outline"
          size="lg"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollBy(0, 100);
            }
          }}
        >
          <IconChevronsDown size={16} />
        </ActionIcon>
        <ActionIcon
          variant="outline"
          size="lg"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollBy(0, -100);
            }
          }}
        >
          <IconChevronsUp size={16} />
        </ActionIcon>
      </div>
    </div>
  );
}

export default ScrollerFabs;
