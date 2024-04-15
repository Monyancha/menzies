import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TitemCard from "./titem-card";

function TitemList() {
  const transactionItems = useSelector(
    (state) => state.posTransaction.transactionItems
  );

  const staffList = useSelector((state) => state.staff.staffList);

  const options = staffList?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));

  return transactionItems.map((item, index) => (
    <div className="w-full" key={item.id}>
      <TitemCard item={item} staffList={options} index={index} />
    </div>
  ));
}

export default TitemList;
