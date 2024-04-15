import { useState } from "react";
import { formatNumber, parseValidInt } from "@/lib/shared/data-formatters";
import store from "@/store/store";
import {
  isTransactionItemAService,
  removeTransactionItem,
  setTransactionItemCost,
  setTransactionItemDiscount,
  setTransactionItemQuantity,
  setTransactionItemStaff,
  isTransactionItemACombo,
  setTransactionComboItems,
  setTransactionAccompItems,
  fetchSellableComboItems,
} from "@/store/merchants/transactions/transaction-slice";
import { fetchMenuItemsAccomp } from "@/store/merchants/inventory/inventory-slice";
import { isRestaurant } from "@/lib/shared/roles_and_permissions";
import { Select, TextInput, MultiSelect } from "@mantine/core";
import CalculatedInput from "@/components/ui/forms/calculated-input";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import { useEffect, useMemo } from "react";
import TitemMultipleStaffList from "./titem-multiple-staff-list";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import ValidateWithPinModal from "@/components/merchants/settings/security/validate-with-pin-modal";
import { useRouter } from "next/router";

export default function TitemCard({ item, staffList, index }) {
  const [discount, setDiscount] = useState(item.discount);
  const [quantity, setQuantity] = useState(item.quantity);
  const [cost, setCost] = useState(item.cost);
  const [staffId, setStaffId] = useState(parseValidInt(item?.staff_id));
  const [combo_data, setComboData] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const router = useRouter();
  const transactionId = router.query?.transaction_id;

  const itemId = useMemo(() => {
    return item?.sellable?.sellable?.id;
  }, [item]);

  const onDiscountChanged = (event) => {
    setDiscount(event.target.value);
    const params = {
      itemId: item.id,
      discount: event.target.value,
    };
    store.dispatch(setTransactionItemDiscount(params));
  };

  function updateWholeSaleCost(event) {
    const updatedCost = event.target.value;
    const wQty = item?.sellable?.sellable?.min_wholesale_qty ?? 0;
    console.log("Updated Cost 1111", item?.cost);
    console.log("Updated Quantity", quantity);
    console.log("Updated wholesale quantity", wQty);

    if (!wQty && wQty < 1) {
      return;
    }

    if (updatedCost >= wQty || wQty === 0) {
      setCost(item?.sellable?.sellable?.wholesale_price);
      console.log(
        "Updated Cost Wholesale",
        item?.sellable?.sellable?.wholesale_price
      );
      store.dispatch(
        setTransactionItemCost({
          itemId: item.id,
          cost: item?.sellable?.sellable?.wholesale_price,
        })
      );
    } else {
      setCost(item?.sellable?.sellable?.cost);
      console.log("Updated Cost Aiden", item?.sellable?.sellable?.cost);
      store.dispatch(
        setTransactionItemCost({
          itemId: item.id,
          cost: item?.sellable?.sellable?.cost,
        })
      );
    }
  }

  const onQuantityChanged = (event_value) => {
    // Validate the local state
    let quantityInt = parseValidInt(event_value);
    if (quantityInt <= 0) {
      setQuantity(1);
    } else {
      setQuantity(event_value);
    }

    // Redux will handle its own validation
    const params = {
      itemId: item.id,
      quantity: event_value,
    };
    store.dispatch(setTransactionItemQuantity(params));

    // Update the cost based on quantity and wholesale minimum quantity
    updateWholeSaleCost({ target: { value: cost } });
  };

  // const onQuantityChanged = (event_value) => {
  //   // Validate the local state
  //   let quantityInt = parseValidInt(event_value);
  //   if (quantityInt <= 0) {
  //     setQuantity(1);
  //   } else {
  //     setQuantity(event_value);
  //   }

  //   // Redux will handle its own validation
  //   const params = {
  //     itemId: item.id,
  //     quantity: event_value,
  //   };
  //   store.dispatch(setTransactionItemQuantity(params));
  // };

  const combo_sellable_list = useSelector(
    (state) => state.posTransaction.comboSellableList
  );

  const menu_item_accomps = useSelector(
    (state) => state.inventory.menuAccompsList
  );

  //Remove Duplicates
  const combo_new = combo_sellable_list.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

  //Remove Duplicates
  const menu_item_accomps_new = menu_item_accomps;

  useEffect(() => {
    if (!itemId || !accessToken) {
      return;
    }
    const pars = {};
    pars["accessToken"] = accessToken;
    pars["id"] = itemId;
    const getComboItems = async () => {
      await store.dispatch(fetchSellableComboItems(pars));
    };
    getComboItems();
    const pas = {};
    pas["accessToken"] = accessToken;
    pas["id"] = itemId;

    store.dispatch(fetchMenuItemsAccomp(pas));
  }, [item, itemId, accessToken]);

  const handleItemChange = (e, itemId) => {
    store.dispatch(setTransactionComboItems({ itemId: itemId, item_ids: e }));
  };

  const handleItemChangeTwo = (e, itemId) => {
    store.dispatch(setTransactionAccompItems({ itemId: itemId, item_ids: e }));
  };

  const canRemoveExistingItemFromTransaction = useSelector(
    hasBeenGranted("can_remvove_existing_item_from_transaction")
  );

  const canDoDiscounts = useSelector(
    hasBeenGranted("can_do_transaction_discounts")
  );

  const [pinValidationOpen, setPinValidationOpen] = useState(false);
  const isNewTitem = isNaN(`${item?.id}`);

  function onDeleteTitem() {
    if (canRemoveExistingItemFromTransaction || !transactionId || isNewTitem) {
      store.dispatch(removeTransactionItem({ itemId: item.id }));
    } else {
      setPinValidationOpen(true);
    }
  }

  function deleteWithPermission() {
    store.dispatch(removeTransactionItem({ itemId: item.id }));

    showNotification({
      title: "Info",
      message: "Removing item from transaction",
      color: "blue",
    });
  }

  function setTitemStaff(selectedId) {
    setStaffId(selectedId);
    store.dispatch(
      setTransactionItemStaff({ itemId: item.id, staffId: selectedId })
    );
  }

  const canEditPrice = useSelector(
    hasBeenGranted("can_adjust_selling_price_on_pos")
  );

  function updateCost(event) {
    if (!canEditPrice) {
      return;
    }

    setCost(event.target.value);

    store.dispatch(
      setTransactionItemCost({ itemId: item.id, cost: event.target.value })
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="pt-2.5">
        <i
          className="fa-solid fa-times h-fit hover:cursor-pointer mx-1 text-lg text-error flex-none"
          onClick={onDeleteTitem}
        ></i>
      </div>
      <div className="w-full border-b border-grey-50 border-opacity-50 py-3">
        <section
          className={`grid grid-cols-3 md:grid-cols-4 ${
            isTransactionItemAService(item) && "xl:grid-cols-4 2xl:grid-cols-5"
          } gap-2`}
        >
          {item?.sellable?.gift_card?.title && (
            <TextInput
              value={item?.sellable?.gift_card?.title}
              label="Gift Card Title"
              onChange={() => {}}
            />
          )}

          <TextInput
            value={
              item?.sellable?.sellable?.name ?? item?.sellable?.unique_code
            }
            label="Item"
            onChange={() => {}}
          />

          <CalculatedInput
            label="Qtt"
            placeholder="Enter amount"
            onChangeHandler={onQuantityChanged}
            value={quantity === 0 ? "" : quantity}
          />

          {item?.delivery_fee > 0 && (
            <TextInput
              value={item.delivery_fee ?? 0}
              type="number"
              label="Delivery Fee"
              readOnly
            />
          )}

          <TextInput
            value={item.cost ?? ""}
            type="number"
            label="Adjust Price"
            onChange={updateCost}
          />

          {canDoDiscounts && (
            <div className="w-full">
              <TextInput
                type="number"
                label="Discount"
                placeholder="Enter amount"
                onChange={onDiscountChanged}
                value={discount === 0 ? "" : discount}
              />
            </div>
          )}

          <TextInput
            value={formatNumber(item.sub_total)}
            label="Total"
            onChange={() => {}}
          />
          {isRestaurant(session?.user) &&
            menu_item_accomps_new?.filter((value) => {
              return value.menu_item_id === item.sellable.sellable_id;
            }).length > 0 && (
              <div className="w-full">
                <MultiSelect
                  label="Accompaniments"
                  onChange={(e) => handleItemChangeTwo(e, item.id)}
                  data={
                    menu_item_accomps_new
                      ?.filter((value) => {
                        return value.menu_item_id === item.sellable.sellable_id;
                      })
                      .map((y, index) => ({
                        value: y?.id,
                        label: y?.name ?? "No Name",
                      })) ?? []
                  }
                  defaultValue={item.accomps_defaults}
                  options
                  searchable
                  clearable
                />
              </div>
            )}
          {isTransactionItemACombo(item) && (
            <div className="w-full">
              <MultiSelect
                placeholder="Combo Items "
                label="Select Items"
                maxSelectedValues={item.sellable.sellable.max_count}
                onChange={(e) => handleItemChange(e, item.id)}
                data={
                  combo_new
                    ?.filter((value) => {
                      return (
                        value.combo_sellable_id === item?.sellable?.sellable?.id
                      );
                    })
                    .map((y, index) => ({
                      value: y?.sellable?.sellable?.id,
                      label: y?.sellable?.sellable?.name ?? "No Name",
                    })) ?? []
                }
                options
                searchable
                clearable
              />
            </div>
          )}

          {isTransactionItemAService(item) && (
            <>
              <div className="w-full">
                <Select
                  placeholder="Staff"
                  label="Staff"
                  data={staffList}
                  value={staffId}
                  onChange={setTitemStaff}
                  searchable
                  clearable
                />
              </div>
            </>
          )}
        </section>

        {isTransactionItemAService(item) && (
          <section className="w-full">
            <TitemMultipleStaffList item={item} />
          </section>
        )}
      </div>

      <ValidateWithPinModal
        opened={pinValidationOpen}
        setOpened={setPinValidationOpen}
        message={`remove item from transaction`}
        onFail={(message) => {
          showNotification({
            title: "Warning",
            message,
            color: "orange",
          });
        }}
        onSuccess={deleteWithPermission}
      />
    </div>
  );
}
