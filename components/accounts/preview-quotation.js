import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "../../src/store/Store";
import { useRouter } from "next/router";
import { IconCircleX } from "@tabler/icons-react";
import { IconEye, IconCircleCheck, IconEdit } from "@tabler/icons-react";
import { Grid, Image, Textarea, Paper, Table } from "@mantine/core";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function PreviewQuotationModal({
  item,
  client,
  itemTotalTax,
  signature,
  description,
  merchant,
  due,
  po,
  date,
  items,
  totalPrice,
  totalTax,
  discount,
  quotation,
}) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const dateS = isNaN(Date.parse(date)) ? null : new Date(date);
  const dateD = isNaN(Date.parse(due)) ? null : new Date(due);

  console.log("Modal Quotation", quotation);

  const quotationDate = dateS?.toLocaleDateString("en-US") ?? "";
  const dueDate = dateD?.toLocaleDateString("en-US") ?? "";

  const itemId = item?.id;

  const styles = {
    container: {
      padding: 0,
    },
    companyLogo: {
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
    },

    companyInfo: {
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      marginLeft: "auto",
      marginRight: 2,
      textAlign: "right",
    },

    fromInfo: {
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      marginTop: 10,
      alignItems: "left",
    },
    billInfo: {
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      marginLeft: "auto",
      marginTop: 10,
      marginRight: 2,
      textAlign: "right",
    },

    itemTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 16,
    },
    itemHeader: {
      backgroundColor: "#f9f9f9",
    },
    itemCell: {
      borderBottom: "1px solid #ddd",
      padding: 8,
      textAlign: "center",
    },
    totalInfo: {
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      marginLeft: "auto",
      marginRight: 2,
      textAlign: "right",
    },
    notesInfo: {
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
    },
  };

  return (
    <>
      <Modal
        opened={opened}
        title={`Preview`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
        size="lg"
      >
        <section className="flex flex-col space-y-2 bg-light p-2 rounded-lg">
          <Paper shadow="sm" radius="lg" p="lg">
            <Grid style={styles.container} columns={12} justify="space-between">
              <Grid.Col span={6}>
                <div style={styles.companyLogo}>
                  <Image
                    src={`${BASE_URL}/storage/${merchant?.profile_photo}`}
                    width={100}
                    height={100}
                    radius={10}
                    alt={merchant?.name}
                  />
                </div>
              </Grid.Col>

              <Grid.Col span={6}>
                <div style={styles.companyInfo}>
                  <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                    Preview Info {quotation?.estimate_number ?? ""}
                  </div>
                  <div>P.O No. #:{po ?? ""}</div>
                  <div>Date: {dueDate ?? ""}</div>
                  <div>Due: {quotationDate ?? ""} </div>
                </div>
              </Grid.Col>

              <Grid.Col span={6}>
                <div style={styles.fromInfo}>
                  <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                    Bill From:
                  </div>
                  <div>{merchant?.name ?? ""}</div>
                  <div>{merchant?.phone ?? ""}</div>
                  <div>{merchant?.email ?? ""}</div>
                  <div>{merchant?.location ?? ""}</div>
                </div>
              </Grid.Col>

              <Grid.Col span={6}>
                <div style={styles.billInfo}>
                  <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                    Bill To:
                  </div>
                  <div>{client?.name ?? quotation?.client_name ?? ""}</div>
                  <div>{client?.phone ?? quotation?.client_phone ?? ""}</div>
                  <div>{client?.email ?? quotation?.client_email ?? ""}</div>
                </div>
              </Grid.Col>

              <Grid.Col span={12}>
                <Table style={styles.itemTable} highlightOnHover withBorder>
                  <thead style={styles.itemHeader}>
                    <tr>
                      <th style={styles.itemCell}>Item</th>
                      <th style={styles.itemCell}>Description</th>
                      <th style={styles.itemCell}>Quantity</th>
                      <th style={styles.itemCell}>Rate(Ksh)</th>
                      {/* <th style={styles.itemCell}>Tax(Ksh)</th> */}
                      <th style={styles.itemCell}>Total(Ksh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td style={styles.itemCell}>{item?.product ?? ""}</td>
                        <td style={styles.itemCell}>
                          {item?.description ?? ""}
                        </td>
                        <td style={styles.itemCell}>{item?.quantity ?? ""}</td>
                        <td style={styles.itemCell}>{item?.price ?? ""}</td>
                        {/* <td style={styles.itemCell}>{itemTotalTax ?? ""}</td> */}
                        <td style={styles.itemCell}>
                          {item.quantity * item?.price ?? ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid.Col>

              <Grid.Col span={12}>
                <div style={styles.totalInfo}>
                  <div>Total: Ksh. {totalPrice?.toFixed(2) ?? 0}</div>
                  <div>Tax: {totalTax?.toFixed(2) ?? 0}</div>
                  <div>Discount: {discount ?? 0}</div>
                  {/* <div>Payment Method: M-Pesa</div> */}
                </div>
              </Grid.Col>

              <Grid.Col span={12}>
                <div style={styles.notesInfo}>
                  <div>
                    <Textarea
                      placeholder="Notes"
                      label="Notes"
                      autosize
                      minRows={2}
                      readOnly
                      defaultValue={description}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Signature"
                      label="Signature"
                      autosize
                      minRows={2}
                      readOnly
                      defaultValue={signature}
                    />
                  </div>
                </div>
              </Grid.Col>
            </Grid>
          </Paper>
        </section>

        <section className="flex justify-end bg-light gap-2 p-3  my-3">
          <Button
            leftIcon={<IconEdit size={16} />}
            onClick={() => setOpened(false)}
          >
            Edit
          </Button>
          <Button
            leftIcon={<IconCircleCheck size={16} />}
            onClick={() => setOpened(false)}
          >
            Continue
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEye size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        className="mr-2"
      >
        Preview
      </Button>
    </>
  );
}

export default PreviewQuotationModal;
