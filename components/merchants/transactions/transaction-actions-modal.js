import { Fragment, useContext, useState } from "react";
import InfoAlert from "../../ui/display/info-alert";
import TransactionListContext from "../../../store/merchants/transactions/transaction-list-context";
import { useSession } from "next-auth/react";
import { isMerchant, isRestaurant } from "@/lib/shared/roles_and_permissions";
import { Button, Text, Modal, useMantineTheme, TextInput } from "@mantine/core";
import {
  IconPrinter,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconLayout2,
} from "@tabler/icons";
import Link from "next/link";
import { printRemotePdf } from "../../../lib/shared/printing-helpers";
import TransactionDetailModal from "./transaction-detail-modal";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "../../../store/merchants/settings/access-control-slice";
import { showNotification } from "@mantine/notifications";

const TransactionActionsModal = ({ item, onClose }) => {
  const { data: session } = useSession();

  const [selectedTransactionId, setSelectedTransactionId] = useState(undefined);
  const [password, setPassword] = useState("");

  const transactionsListCtx = useContext(TransactionListContext);

  const isRestaurantAc = isRestaurant(session?.user);

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [shownTransaction, setShownTransaction] = useState(null);

  const canView = useSelector(hasBeenGranted("can_view_transaction"));
  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));
  const canVoid = useSelector(hasBeenGranted("can_void_transaction"));

  const canPrintWholeOrder = useSelector(
    hasBeenGranted("can_print_whole_order")
  );
  const canReprintOrder = useSelector(hasBeenGranted("can_reprint_order"));
  const canPrintOrderUpdates = useSelector(
    hasBeenGranted("can_print_order_updates")
  );

  function printReceiptWithPermission(receipt_address) {
    printRemotePdf(receipt_address);

    showNotification({
      title: "Info",
      message: "Printing receipt",
      color: "blue",
    });
  }

  function voidTransaction() {
    if (!selectedTransactionId || !password) {
      return;
    }

    transactionsListCtx.actions.void(selectedTransactionId, password);

    setSelectedTransactionId(undefined);
    setPassword("");
  }

  return (
    <>
      <Modal
        opened
        onClose={onClose}
        title={
          item.titems[0]?.sellable?.sellable?.name?.substr(0, 30) ?? "Gift Card"
        }
        padding="xs"
        overflow="inside"
      >
        <div className="grid grid-cols-1 gap-2">
          {!item.is_void && (
            <Fragment>
              {item.is_draft && canPrintOrderUpdates && (
                <Button
                  variant="light"
                  leftIcon={<IconPrinter size={15} />}
                  onClick={() => printRemotePdf(item.receipt_address_new_only)}
                >
                  Print Current Order
                </Button>
              )}

              {canPrintWholeOrder && (
                <Button
                  variant="light"
                  leftIcon={<IconPrinter size={15} />}
                  onClick={() => printRemotePdf(item.receipt_address)}
                >
                  {item.is_draft ? "Print Whole Order" : "Print"}
                </Button>
              )}

              <div className="inline md:hidden w-full flex flex-col">
                <Link href={item.receipt_address} className="w-full">
                  <a target="_blank" className="w-full flex flex-col">
                    <Button
                      variant="light"
                      leftIcon={<IconPrinter size={15} />}
                    >
                      Legacy Print
                    </Button>
                  </a>
                </Link>
              </div>

              {item.is_draft && isRestaurantAc && (
                <Button
                  variant="light"
                  leftIcon={<IconToolsKitchen2 size={15} />}
                  onClick={() => {
                    if (canReprintOrder) {
                      printRemotePdf(item.food_receipt_address);
                    } else {
                      setPinValidationOpen(true);
                      setPinValidationMessage("reprint order");
                      setPinValidationCallback({
                        callback: () =>
                          printReceiptWithPermission(item.food_receipt_address),
                      });
                    }
                  }}
                >
                  Food Receipt
                </Button>
              )}

              {item.is_draft && isRestaurantAc && (
                <Button
                  variant="light"
                  leftIcon={<IconGlassFull size={15} />}
                  onClick={() => {
                    if (canReprintOrder) {
                      printRemotePdf(item.drink_receipt_address);
                    } else {
                      setPinValidationOpen(true);
                      setPinValidationMessage("reprint order");
                      setPinValidationCallback({
                        callback: () =>
                          printReceiptWithPermission(
                            item.drink_receipt_address
                          ),
                      });
                    }
                  }}
                >
                  Drinks Receipt
                </Button>
              )}

              {canView && (
                <>
                  <Button
                    variant="light"
                    leftIcon={<IconListDetails size={15} />}
                    onClick={() => {
                      setShowTransactionDetails(true);
                      setShownTransaction(item);
                    }}
                  >
                    <Text>Summary</Text>
                  </Button>

                  <Link href={`/merchants/transactions/view/${item.id}`}>
                    <Button
                      variant="light"
                      leftIcon={<IconLayout2 size={15} />}
                    >
                      <Text>Detailed View</Text>
                    </Button>
                  </Link>
                </>
              )}

              {canEdit && item.can_be_edited && (
                <Link
                  href={`/merchants/transactions/v3/new?transaction_id=${item.id}`}
                >
                  <Button variant="light" leftIcon={<IconEdit size={15} />}>
                    <Text>Edit</Text>
                  </Button>
                </Link>
              )}

              {canVoid && (
                <a
                  href="#my-modal-2"
                  onClick={() => setSelectedTransactionId(item.id)}
                  className="w-full"
                >
                  <Button
                    variant="light"
                    leftIcon={<IconX size={15} />}
                    fullWidth
                  >
                    <Text>Void</Text>
                  </Button>
                </a>
              )}
            </Fragment>
          )}
        </div>
      </Modal>

      <div className="modal" id="my-modal-2">
        <div className="modal-box bg-v3-darkest">
          {selectedTransactionId && (
            <Fragment>
              <h3 className="font-bold text-lg">
                Void Transaction #{selectedTransactionId}
              </h3>

              <TextInput
                label="Password"
                type="password"
                placeholder="Enter your password to proceed"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </Fragment>
          )}
          {!selectedTransactionId && (
            <div className="flex justify-center">
              <InfoAlert
                title="No transaction selected"
                message="Click the BACK button"
              />
            </div>
          )}

          <div className="modal-action">
            <a href="#" className="btn btn-outline">
              Back
            </a>

            <a href="#" className="btn btn-error" onClick={voidTransaction}>
              Void
            </a>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        opened={showTransactionDetails}
        onCloseHandler={() => setShowTransactionDetails(false)}
        transaction={shownTransaction}
      />
    </>
  );
};

export default TransactionActionsModal;
