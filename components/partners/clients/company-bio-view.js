import { Card } from "@mantine/core";
import { useSelector } from "react-redux";
import { Table, Thead, Trow } from "../../../components/ui/layouts/scrolling-table";
import {
  TheadDark,
  TrowDark,
} from "../../../components/ui/layouts/scrolling-table-dark";
import CardDark from "../../../components/ui/layouts/card-dark";

export default function CompanyBioView({ companyId }) {
  const record = useSelector((state) => state.accounts.companyDetails);

  return (
    <CardDark>
      <Table>
        <TheadDark>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </TheadDark>
        <tbody>
          {record && (
            <>
              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Name
                  </td>
                  <td>{record?.name}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Address
                  </td>
                  <td>{record.address ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    KRA Pin
                  </td>
                  <td>{record.kra_pin ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Contact Name
                  </td>
                  <td>{record.contact_name ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Contact Email
                  </td>
                  <td>{record.contact_email ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Contact Phone
                  </td>
                  <td>{record.contact_phone ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Contact Gender
                  </td>
                  <td>{record.contact_gender ?? "-"}</td>
                </>
              </TrowDark>
            </>
          )}
        </tbody>
      </Table>
    </CardDark>
  );
}
