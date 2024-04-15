import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";

export default function TransactionPrinterDownloads({
  opened = null,
  setOpened = () => {},
} = {}) {
  return (
    <>
      <Modal
        opened={opened}
        title="Download Printing Client"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <div className="flex flex-col w-full items-center mb-4 space-y-2">
          <div className="flex flex-col w-full items-center space-y-2 bg-light p-3">
            <span className="text-dark text-left w-full">
              Windows 10 64 bit Downloads
            </span>
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/media/installers/printing_client_installer-1.1.0.exe`}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button variant="outline" fullWidth>
                Windows 10 x86_64(64 bit) v1.0.2
              </Button>
            </a>

            <a
              href={`https://www.openlogic.com/openjdk-downloads?field_java_parent_version_target_id=416&field_operating_system_target_id=436&field_architecture_target_id=391&field_java_package_target_id=396`}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button variant="outline" fullWidth>
                Java 8u362-b09 x86 64-bit JDK msi
              </Button>
            </a>
          </div>

          <div className="flex flex-col w-full items-center space-y-2 bg-light p-3">
            <span className="text-dark text-left w-full">
              Windows 7 32 bit Downloads
            </span>
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/media/installers/printing_client_installer-1.0.1-win7_x86.exe`}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button variant="outline" fullWidth>
                Windows 7 x86(32 bit) v1.0.1
              </Button>
            </a>

            <a
              href={`https://www.openlogic.com/openjdk-downloads?field_java_parent_version_target_id=416&field_operating_system_target_id=436&field_architecture_target_id=386&field_java_package_target_id=396`}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button variant="outline" fullWidth>
                Java 8u362-b09 x86 32-bit JDK msi
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
