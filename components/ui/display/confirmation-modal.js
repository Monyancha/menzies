import { Button, Modal } from "@mantine/core";

export default function ConfirmationModal({
  title = "",
  text = "",
  proceedText = "Proceed",
  proceedColor = "red",
  loading = false,
  cancelText = "Back",

  opened = false,
  setOpened = () => {},

  onProceed = () => {},
  onCancel = () => {},
} = {}) {
  function onCloseModal() {
    onCancel();
    setOpened(false);
  }

  return (
    <Modal
      opened={opened}
      title={title}
      onClose={onCloseModal}
      padding="xs"
      overflow="inside"
    >
      <section className="flex flex-col space-y-2  p-3 rounded-lg">
        {text}
      </section>

      <section className="flex justify-end items-end gap-2 space-y-2 rounded-lg my-3">
        <Button
          color="gray"
          variant="outline"
          loading={loading}
          onClick={onCloseModal}
        >
          {cancelText}
        </Button>

        <Button
          variant="filled"
          color={proceedColor}
          loading={loading}
          onClick={() => {
            onProceed();
            setOpened(false);
          }}
        >
          {proceedText}
        </Button>
      </section>
    </Modal>
  );
}
