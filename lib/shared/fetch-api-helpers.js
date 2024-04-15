import getLogger from "./logger";

const logger = getLogger("fetch-api-helpers");

export const getData = async ({
  url = null,
  accessToken = null,
  logKey = "getData",
} = {}) => {
  logger.log(`${logKey}::BEGIN`);
  const startTime = new Date();

  return await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken} `,
      Accept: "application/json",
    },
  }).then(async (response) => {
    const data = await response.json();
    const endTime = new Date();
    const seconds = endTime.getTime() - startTime.getTime();
    logger.log(`${logKey}::END`, { took: seconds, data });

    if (!response.ok) {
      throw data;
    }

    return data;
  });
};
