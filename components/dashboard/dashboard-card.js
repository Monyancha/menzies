import React from 'react';

function DashboardCard({ title, value, color }) {
  return (
    <div className="w-full md:w-3/12 md:pr-1 md:h-full mb-1">
      <div style={{ background: color }} className={`h-full w-full rounded-xl px-6 py-4 flex flex-col justify-between items-start text-white`}>
        <div className="flex w-full">
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <div className="w-full">
          <span className="text-4xl font-thin tracking-widest">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
