import {
  TheadDark,
  TrowDark,
} from "@/components/ui/layouts/scrolling-table-dark";
import { Accordion } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
} from "../../../../../lib/shared/data-formatters";
import Card from "../../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../../ui/layouts/scrolling-table";
import BillSplitsAction from "./bill-splits-actions";

function SplitBillView() {
  const router = useRouter();
  const orderId = router?.query?.orderId ?? -1;

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );

  const transactionList = useSelector(
    (state) => state.transactions.transactionList?.data ?? []
  );

  const transaction = transactionList.find(
    (item) => item.id == orderId && item.is_draft === "1"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const tableId = router?.query?.tableId ?? -1;
    const prevUrl = `/merchants/transactions/tables/${tableId}`;

    if (
      transactionListStatus === "idle" ||
      transactionList.length <= 0 ||
      !transaction
    ) {
      router.replace(prevUrl);
    }
  }, [transactionListStatus, transactionList, transaction, router]);

  return (
    <>
      {transaction && (
        <div className="w-full p-3 text-base-content">
          <Accordion defaultValue="items">
            <Accordion.Item value="summary">
              <div className="w-full bg-base-300 bg-opacity-50 rounded-t">
                <Accordion.Control>
                  <span className="text-primary font-bold">Summary</span>
                </Accordion.Control>
              </div>
              <Accordion.Panel>
                {/* <Card> */}
                <Table>
                  <table>
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </table>
                  <tbody>
                    <>
                      <tr>
                        <>
                          <td scope="row" className="text-primary font-bold">
                            ID
                          </td>
                          <td className="">{transaction.id}</td>
                        </>
                      </tr>

                      <tr>
                        <>
                          <td scope="row" className="text-primary font-bold">
                            COST
                          </td>
                          <td className="">{formatNumber(transaction.cost)}</td>
                        </>
                      </tr>

                      <tr>
                        <>
                          <td scope="row" className="text-primary font-bold">
                            PROVIDER
                          </td>
                          <td className="">{transaction.staff_provider}</td>
                        </>
                      </tr>

                      <tr>
                        <>
                          <td scope="row" className="text-primary font-bold">
                            CLIENT/TABLE
                          </td>
                          <td className="">
                            <span className="">
                              {transaction.restaurant_transaction?.table
                                ?.name ?? ""}
                              {" - "}
                            </span>
                            <span className="">
                              {transaction.client?.name ?? ""}
                            </span>
                          </td>
                        </>
                      </tr>

                      <tr>
                        <>
                          <td scope="row" className="text-primary font-bold">
                            DATE
                          </td>
                          <td className="">{formatDate(transaction.date)}</td>
                        </>
                      </tr>
                    </>
                  </tbody>
                </Table>
                {/* </Card> */}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="items">
              <div className="w-full bg-base-300 bg-opacity-50 rounded-t">
                <Accordion.Control>
                  <span className="text-primary font-bold">Items</span>
                </Accordion.Control>
              </div>

              <Accordion.Panel>
                {/* <Card> */}
                <Table>
                  <TheadDark>
                    <tr>
                      <th scope="col" className="th-primary">
                        ID NO
                      </th>

                      <th scope="col" className="th-primary">
                        ITEM
                      </th>

                      <th scope="col" className="th-primary text-right">
                        QUANTITY
                      </th>

                      <th scope="col" className="th-primary text-right">
                        COST
                      </th>
                    </tr>
                  </TheadDark>
                  <tbody>
                    {transaction?.titems?.map((item) => (
                      <TrowDark key={item.id}>
                        <>
                          <td>{item.id}</td>
                          <td>{item?.sellable?.sellable?.name ?? ""}</td>
                          <td className="text-right">
                            {formatNumber(item.quantity)}
                          </td>
                          <td className="text-right">
                            {formatNumber(item.cost)}
                          </td>
                        </>
                      </TrowDark>
                    ))}
                  </tbody>
                </Table>
                {/* </Card> */}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <div className="w-full mt-4">
            <BillSplitsAction transaction={transaction} />
          </div>
        </div>
      )}
    </>
  );
}

export default SplitBillView;
