import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import {
  getLoyaltyTemplates,
  getLoyaltyTemplatesTwo,
} from "../../../../store/merchants/settings/access-control-slice";
import { Switch, Badge, Radio, Group } from "@mantine/core";
import NewLoyaltyTemplateModal from "./new-template-modal";
import EditLoyaltyTemplateModal from "./edit-template-modal";
import DelTable from "../../inventory/del-modals/del-table-modal";
import EditTwoTemplateModal from "./edit-two-template-modal";

export default function LoyaltySettings() {
  const { data: session, status } = useSession();
  const [isLoyaltyOne, setLoyaltyOne] = useState(true);

  const loyaltyTemplatesStatus = useSelector(
    (state) => state.accessControl.getLoyaltyTemplatesStatus
  );

  const loyaltyTemplates = useSelector(
    (state) => state.accessControl.getLoyaltyTemplates
  );

  const loyaltyTemplatesTwo = useSelector(
    (state) => state.accessControl.getLoyaltyTemplatesTwo
  );

  const isLoading = loyaltyTemplatesStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getLoyaltyTemplates(params));
    store.dispatch(getLoyaltyTemplatesTwo(params));
  }, [session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(getLoyaltyTemplates(params));
    store.dispatch(getLoyaltyTemplatesTwo(params));
  }

  const data = loyaltyTemplates;

  const data_two = loyaltyTemplatesTwo;

  return (
    <>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4">
        <div className="flex flex-wrap justify-between items-end">
          <div className="flex w-full md:w-6/12 flex-wrap">
            <h2>Loyalty Points Template</h2>
          </div>

          <div className="flex w-full md:w-6/12 flex-wrap md:justify-end mt-2 md:mt-0 space-x-2 items-center">
            <NewLoyaltyTemplateModal />
          </div>
        </div>
        <section className="flex flex-row space-y-2 bg-light p-3 rounded-lg">
          <Radio.Group
            name="favoriteFramework"
            label="Select One Of The Following Templates"
            // description="This is anonymous"
          >
            <Group mt="xs">
              <Radio
                value="false"
                onClick={() => setLoyaltyOne(true)}
                label="Points Awarded Per Amount Spent"
              />
              <Radio
                value="true"
                onClick={() => setLoyaltyOne(false)}
                label="Points Awarded After No Of Visits"
              />
            </Group>
          </Radio.Group>
        </section>
        {isLoyaltyOne && (
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-lg">
                <table className="rounded-lg min-w-full" id="inventorySales">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="th-primary">
                        PER KSH. 1,000
                      </th>
                      <th scope="col" className="th-primary">
                        PER VISIT
                      </th>
                      <th scope="col" className="th-primary">
                        REDEMPTION RATE
                      </th>

                      <th scope="col" className="th-primary ">
                        STATUS
                      </th>
                      <th scope="col" className="th-primary text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoading &&
                      data?.data &&
                      data?.data
                        .filter((val) => val.template_status == null)
                        .map((item) => {
                          const toggleSwitch = (isChecked) => {
                            const accessToken = session.user.accessToken;
                            const API_URL = process.env.NEXT_PUBLIC_API_URL;
                            const endpoint = `${API_URL}/settings/template/${
                              item.active === "1" ? "suspend" : "activate"
                            }/${item?.id}`;

                            fetch(endpoint, {
                              method: "PATCH",
                              headers: {
                                Authorization: `Bearer ${accessToken}`,
                                "Content-Type": "application/json",
                                Accept: "application/json",
                              },
                            })
                              .then((response) => {
                                if (!response.ok) {
                                  throw new Error(
                                    "Error occurred while updating template status."
                                  );
                                }
                                const action = isChecked
                                  ? "activated"
                                  : "suspended";
                                showNotification({
                                  title: "Success!",
                                  message: `Template ${action} successfully.`,
                                  color: "green",
                                });

                                const params = { accessToken };
                                store.dispatch(getLoyaltyTemplates(params));
                                store.dispatch(getLoyaltyTemplatesTwo(params));
                              })
                              .catch((error) => {
                                console.error(error);
                              });
                          };

                          return (
                            <tr className="border-b" key={item.id}>
                              <td className="py-3 px-6 text-sm whitespace-nowrap">
                                {item?.per_spend}
                              </td>
                              <td className="py-3 px-6 text-sm whitespace-nowrap">
                                {item.per_visit}
                              </td>

                              <td className="py-3 px-6 text-sm whitespace-nowrap">
                                {item.redemption_rate}
                              </td>
                              <td className="py-3 px-6 text-sm whitespace-nowrap ">
                                <span className="flex justify-start items-center w-full gap-2">
                                  {item.status === "1" && (
                                    <Badge>Approved</Badge>
                                  )}
                                  {item.status !== "1" && (
                                    <Badge color="red">Rejected</Badge>
                                  )}
                                  {item.active === "1" && (
                                    <Badge color="lime">Active</Badge>
                                  )}
                                  {item.active !== "1" && (
                                    <Badge color="red">Suspended</Badge>
                                  )}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-sm whitespace-nowrap ">
                                <span className="flex justify-end items-center w-full gap-2">
                                  <Switch
                                    onLabel="ON"
                                    offLabel="OFF"
                                    size="lg"
                                    onChange={(isChecked) =>
                                      toggleSwitch(isChecked)
                                    }
                                    checked={item.active === "1"}
                                  />
                                  <EditLoyaltyTemplateModal item={item} />
                                  <DelTable source="templates" item={item} />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>

                {isLoading && (
                  <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                    <StatelessLoadingSpinner />
                  </div>
                )}

                <PaginationLinks
                  paginatedData={data}
                  onLinkClicked={onPaginationLinkClicked}
                />
              </div>
            </div>
          </div>
        )}

        {!isLoyaltyOne && (
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-lg">
                <table className="rounded-lg min-w-full" id="inventorySales">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="th-primary">
                        No Of Visits
                      </th>
                      <th scope="col" className="th-primary">
                        Points Awarded
                      </th>
                      <th scope="col" className="th-primary">
                        No Of Days To Expire If Not Redeemed
                      </th>

                      <th scope="col" className="th-primary ">
                        STATUS
                      </th>
                      <th scope="col" className="th-primary text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoading &&
                      data_two?.data &&
                      data_two?.data.map((item) => {
                        const toggleSwitch = (isChecked) => {
                          const accessToken = session.user.accessToken;
                          const API_URL = process.env.NEXT_PUBLIC_API_URL;
                          const endpoint = `${API_URL}/settings/template/${
                            item.active === "1" ? "suspend" : "activate"
                          }/${item?.id}`;

                          fetch(endpoint, {
                            method: "PATCH",
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              "Content-Type": "application/json",
                              Accept: "application/json",
                            },
                          })
                            .then((response) => {
                              if (!response.ok) {
                                throw new Error(
                                  "Error occurred while updating template status."
                                );
                              }
                              const action = isChecked
                                ? "activated"
                                : "suspended";
                              showNotification({
                                title: "Success!",
                                message: `Template ${action} successfully.`,
                                color: "green",
                              });
                              const params = { accessToken };
                              store.dispatch(getLoyaltyTemplates(params));
                              store.dispatch(getLoyaltyTemplatesTwo(params));
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        };

                        return (
                          <tr className="border-b" key={item.id}>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item?.per_visit}
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item.points_awarded_after_visits}
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              {item.no_of_days}
                            </td>

                            <td className="py-3 px-6 text-sm whitespace-nowrap ">
                              <span className="flex justify-start items-center w-full gap-2">
                                {item.status === "1" && <Badge>Approved</Badge>}
                                {item.status !== "1" && (
                                  <Badge color="red">Rejected</Badge>
                                )}
                                {item.active === "1" && (
                                  <Badge color="lime">Active</Badge>
                                )}
                                {item.active !== "1" && (
                                  <Badge color="red">Suspended</Badge>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-sm whitespace-nowrap ">
                              <span className="flex justify-end items-center w-full gap-2">
                                <Switch
                                  onLabel="ON"
                                  offLabel="OFF"
                                  size="lg"
                                  onChange={(isChecked) =>
                                    toggleSwitch(isChecked)
                                  }
                                  checked={item.active === "1"}
                                />
                                <EditTwoTemplateModal item={item} />
                                <DelTable source="templates" item={item} />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                {isLoading && (
                  <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                    <StatelessLoadingSpinner />
                  </div>
                )}

                <PaginationLinks
                  paginatedData={data_two}
                  onLinkClicked={onPaginationLinkClicked}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
