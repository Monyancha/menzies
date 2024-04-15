import { Fragment } from "react";
import TopHr from "./top-hr";
import TopHrDark from "./top-hr-dark";

function BreadCrumbsHeaderDark({ title, altTitle, children, actions }) {
  return (
    <Fragment>
      <div className="flex items-start pt-6 justify-between flex-wrap px-3">
        <div className="w-full md:w-6/12">
          <h1 className="w-full text-2xl font-bold text-base-content pb-1">
            {title} <span className="text-primary">{altTitle}</span>
          </h1>

          <div className="w-full text-xs px-1 text-grey-100 flex items-center">
            {children}
          </div>
        </div>

        <div className="w-full md:w-6/12 pt-3 md:pt-0 flex justify-start md:justify-end">
          {actions}
        </div>
      </div>

      <TopHrDark />
    </Fragment>
  );
}

export default BreadCrumbsHeaderDark;
