import { ActionIcon, Badge, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { parseValidFloat } from "../../../../../lib/shared/data-formatters";
import KeyboardInput from "../../../../ui/forms/keyboard-input";
import Card from "../../../../ui/layouts/card";
import { IconTrash } from "@tabler/icons";
import { printRemotePdf } from "../../../../../lib/shared/printing-helpers";

function BillSplitsAction({ transaction }) {
  const [bills, setBills] = useState([
    {
      id: crypto.randomUUID(),
      amount: parseValidFloat(transaction.cost),
    },
  ]);

  const billTotal = bills.reduce((total, value) => total + value.amount, 0);

  function setBillAmount(billId, amount) {
    let allBills = [...bills];
    let principle = bills.slice(-1)[0];
    allBills = allBills.map((item) => {
      if (item.id === billId) {
        return {
          id: item.id,
          amount,
        };
      } else {
        return item;
      }
    });

    if (principle.id !== billId) {
      const billsWithoutPrinciple =
        allBills.filter((item) => item?.id !== principle.id) ?? [];
      const totalWithoutPrinciple = billsWithoutPrinciple?.reduce(
        (total, value) => total + value.amount,
        0
      );

      const remainder =
        parseValidFloat(transaction?.cost) - totalWithoutPrinciple;
      principle.amount = remainder > 0 ? remainder : 0;

      allBills = [...billsWithoutPrinciple, principle];
    }

    setBills(allBills);
  }

  function removeBill(billId) {
    const remainingBills = bills.filter((item) => item.id !== billId);

    setBills(remainingBills);
  }

  function addBill() {
    let allBills = [
      {
        id: crypto.randomUUID(),
        amount: 0,
      },
      ...bills,
    ];

    setBills(allBills);

    showNotification({
      title: "Info",
      message: "Added bill",
      color: "blue",
    });
  }

  function printBill(billId) {
    if (billTotal > parseValidFloat(transaction.cost)) {
      showNotification({
        title: "Warning",
        message: `The entered amounts(${billTotal}) are more than the transaction's value(${transaction.cost})`,
        color: "orange",
      });

      return;
    } else if (billTotal < parseValidFloat(transaction.cost)) {
      showNotification({
        title: "Warning",
        message: `The entered amounts(${billTotal}) are less than the transaction's value(${transaction.cost})`,
        color: "orange",
      });

      return;
    }

    const currentBill = bills.find((item) => item.id === billId);

    const url = `${transaction.receipt_address}?split_amount=${
      currentBill?.amount ?? 0
    }`;

    printRemotePdf(url);
  }

  return (
    <>
      <div className="flex justify-between items-end">
        <h3 className="text-base-content font-bold">
          <div>Split Bill by Amount</div>
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            <Badge color="blue" variant="light">
              <span className="normal-case">
                Expected Total: {transaction?.cost}
              </span>
            </Badge>
            <Badge
              color={
                billTotal == parseValidFloat(transaction?.cost)
                  ? "green"
                  : "red"
              }
              variant="filled"
            >
              <span className="normal-case">Entered Total: {billTotal}</span>
            </Badge>
          </div>
        </h3>

        <Button onClick={addBill} variant="filled" size="xs">
          Add Person
        </Button>
      </div>

      <section className="flex flex-col w-full space-y-2">
        {bills?.map((item, index) => (
          <div className="rounded mt-2 shadow" key={item.id}>
            <div className="w-full bg-base-300 shadow rounded-lg p-3 flex flex-col space-y-3 pt-5 pb-5">
              <BillAmount
                initialAmount={item.amount}
                splitId={item.id}
                index={index}
                updateAmount={setBillAmount}
                removeBill={removeBill}
                printBill={printBill}
              />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function BillAmount({
  initialAmount,
  splitId,
  index,
  updateAmount,
  removeBill,
  printBill,
}) {
  const [value, setValue] = useState(initialAmount);

  useEffect(() => setValue(initialAmount), [initialAmount]);

  function setAmount(event_value) {
    setValue(event_value);
    updateAmount(splitId, parseValidFloat(event_value));
  }

  return (
    <>
      <div className="w-full">
        <KeyboardInput
          type="number"
          label={`Person #${index + 1}`}
          placeholder="Enter amount"
          value={value}
          onChangeHandler={setAmount}
        />
      </div>

      <div className="w-full flex justify-end mt-2 space-x-2 items-center">
        <ActionIcon
          variant="outline"
          size="lg"
          color="red"
          onClick={() => removeBill(splitId)}
        >
          <IconTrash size={17} />
        </ActionIcon>

        <Button onClick={() => printBill(splitId)} disabled={value <= 0}>
          Print
        </Button>
      </div>
    </>
  );
}

export default BillSplitsAction;
