import { Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";

function ClientBioView() {
  const router = useRouter();

  const customerId = router?.query?.customerId;
  const currentCustomer = useSelector((state) =>
    state.accounts?.getAllCustomers?.data?.find((item) => item.id == customerId)
  );

  const custoemrListLoaded = useSelector(
    (state) => state.accounts?.getAllCustomersStatus === "fulfilled"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!custoemrListLoaded) {
      router.replace("/merchants/partners/clients");
    }
  }, [custoemrListLoaded, router]);

  const isAcCarWash = useSelector(isCarWash);

  return (
    <Card>
      <Table>
        <Thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </Thead>
        <tbody>
          {currentCustomer && (
            <>
              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Name
                  </td>
                  <td>{currentCustomer?.name}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Phone
                  </td>
                  <td>{currentCustomer.phone ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Email
                  </td>
                  <td>{currentCustomer.email ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Gender
                  </td>
                  <td>{currentCustomer.gender ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Date of Birth
                  </td>
                  <td>{currentCustomer.dob ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    House No
                  </td>
                  <td>{currentCustomer.house_no ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Street Name
                  </td>
                  <td>{currentCustomer.street_name ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    City
                  </td>
                  <td>{currentCustomer.city ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Estate
                  </td>
                  <td>{currentCustomer.estate ?? "-"}</td>
                </>
              </Trow>

              {isAcCarWash && (
                <>
                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Model
                      </td>
                      <td>{currentCustomer.car_model ?? "-"}</td>
                    </>
                  </Trow>

                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Plate
                      </td>
                      <td>{currentCustomer.car_plate ?? "-"}</td>
                    </>
                  </Trow>

                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Series
                      </td>
                      <td>{currentCustomer.car_series ?? "-"}</td>
                    </>
                  </Trow>

                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Year
                      </td>
                      <td>{currentCustomer.car_year ?? "-"}</td>
                    </>
                  </Trow>
                </>
              )}
            </>
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default ClientBioView;
