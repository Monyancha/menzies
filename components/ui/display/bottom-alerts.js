import { Fragment } from "react";
import { useSelector } from "react-redux";

function BottomAlerts() {
  const alert = useSelector((state) => state.bottomAlerts.alert);

  let component = alert && (
    <div className="w-full fixed bottom-5 flex justify-center pointer-events-none">
      <div
        className={`alert w-fit transition-all ease-out ignore
          ${alert.type == "success" && "alert-success"}
          ${alert.type == "warning" && "alert-warning"}
          ${alert.type == "error" && "alert-error"}
          `}
      >
        <div>
          <i
            className={`fa-solid
          ${alert.type == "success" && "fa-check-circle"}
          ${alert.type == "warning" && "fa-exclamation-triangle"}
          ${alert.type == "error" && "fa-times-circle"}
          `}
          ></i>
          <span>{alert.message}</span>
        </div>
      </div>
    </div>
  );

  return <Fragment>{alert && component}</Fragment>;
}

export default BottomAlerts;
