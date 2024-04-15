import getLogger from "./logger";
import { showNotification } from "@mantine/notifications";

const logger = getLogger("formHelpers");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const submitGenericForm = async ({
  accessToken = null,
  url = null,

  body = {},

  method = "POST",
} = {}) => {
  if (!accessToken || !url) {
    return;
  }

  let uri = `${API_URL}${url}`;

  logger.log("submitGenericForm::BEGIN", body);
  body = JSON.stringify(body);

  const startTime = new Date();
  const response = await fetch(uri, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  }).then(async (response) => {
    const data = await response.json();
    const endTime = new Date();
    const seconds = endTime.getTime() - startTime.getTime();
    logger.log("submitGenericForm::END", { took: seconds, data });

    if (!response.ok) {
      throw data;
    }

    return data;
  });

  return response;
};

const submitUIForm = async ({
  accessToken = null,
  url = null,
  body = {},
  method = "POST",

  onSuccess = () => {},
  onSuccessResponse = (response) => {},
  onError = () => {},
  successMessage = "Changes saved successfully",
  failedMessage = "Could not save changes",
} = {}) => {
  try {
    const response = await submitGenericForm({
      accessToken,
      body,
      url,
      method,
    });

    showNotification({
      title: "Success",
      message: successMessage,
      color: "green",
    });

    onSuccess();
    onSuccessResponse(response);
    return true;
  } catch (e) {
    showNotification({
      title: "Warning",
      message: e?.message ?? failedMessage,
      color: "orange",
    });

    onError();
    return false;
  }
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export { submitGenericForm, submitUIForm, toBase64 };
