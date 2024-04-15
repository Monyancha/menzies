import { Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table, Thead, Trow } from "../../ui/layouts/scrolling-table";
import { useSession } from "next-auth/react";
import {
  TheadDark,
  TrowDark,
} from "../../ui/layouts/scrolling-table-dark";

function ClientBioView({ clientId }) {
  const { data: session } = useSession();
  const router = useRouter();

  const currentClient = useSelector((state) => state.clients.clientDetails);

  return (
    <Card>
      <Table>
        <TheadDark>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </TheadDark>
        <tbody>
          {currentClient && (
            <>
              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Name
                  </td>
                  <td>{currentClient?.name}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Phone
                  </td>
                  <td>{currentClient.phone ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Email
                  </td>
                  <td>{currentClient.email ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Gender
                  </td>
                  <td>{currentClient.gender ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Date of Birth
                  </td>
                  <td>{currentClient.dob ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    House No
                  </td>
                  <td>{currentClient.house_no ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Street Name
                  </td>
                  <td>{currentClient.street_name ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    City
                  </td>
                  <td>{currentClient.city ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Estate
                  </td>
                  <td>{currentClient.estate ?? "-"}</td>
                </>
              </TrowDark>
              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Allergies
                  </td>
                  <td>{currentClient.allergies ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Prior Medical Condition
                  </td>
                  <td>{currentClient.med_condition ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Previous Treatment Used
                  </td>
                  <td>{currentClient.prev_treatment ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Previous Procedure
                  </td>
                  <td>{currentClient.prev_procedure ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Blood Pressure
                  </td>
                  <td>{currentClient.blood_pressure ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Body Weight
                  </td>
                  <td>{currentClient.body_weight ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Hair Type
                  </td>
                  <td>{currentClient.hair_type ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Next of Kin Contact
                  </td>
                  <td>{currentClient.next_of_kin_contact ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Blood Type
                  </td>
                  <td>{currentClient.blood_type ?? "-"}</td>
                </>
              </TrowDark>

              <TrowDark>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Skin Type
                  </td>
                  <td>{currentClient.skin_type ?? "-"}</td>
                </>
              </TrowDark>
            </>
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default ClientBioView;
