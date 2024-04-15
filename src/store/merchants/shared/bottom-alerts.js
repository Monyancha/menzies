import { createContext, useRef, useState } from "react";
import getLogger from "../../../../lib/shared/logger";

const BottomAlertsContext = createContext({
  alert: undefined,
  show: {
    success: (message, time = 5000) => {},
    warning: (message, time = 5000) => {},
  },
});

export function BottomAlertsContextProvider(props) {
  const logger = getLogger("BottomAlertsContext");
  const [alert, setAlert] = useState();
  const [latestTimeout, setLatestTimeout] = useState(undefined);

  function removeAlert() {
    setAlert(undefined);
  }

  function successAlert(message, time = 5000) {
    removeAlert();

    if (latestTimeout) {
      clearTimeout(latestTimeout);
    }

    const alert = {
      message,
      type: "success",
    };

    setAlert(alert);

    const timeout = setTimeout(() => removeAlert(), time);
    setLatestTimeout(() => timeout);
  }

  function warningAlert(message, time = 5000) {
    removeAlert();

    if (latestTimeout) {
      clearTimeout(latestTimeout);
    }

    const alert = {
      message,
      type: "warning",
    };

    setAlert(alert);

    const timeout = setTimeout(() => removeAlert(), time);
    setLatestTimeout(() => timeout);
  }

  const context = {
    alert: alert,
    show: {
      success: successAlert,
      warning: warningAlert,
    },
  };

  return (
    <BottomAlertsContext.Provider value={context} displayName="Bottom Alerts">
      {props.children}
    </BottomAlertsContext.Provider>
  );
}

export default BottomAlertsContext;
