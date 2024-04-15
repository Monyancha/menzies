export function StatsContainer({ children }) {
  return (
    <div className="stats stats-vertical lg:stats-horizontal bg-white rounded-lg w-full">
      {children}
    </div>
  );
}

export function Stat(props) {
  const { title, value, description, icon } = props;
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value text-darkest flex justify-between items-center">
        <span>{value}</span>
        {icon && (
          <div className="stat-figure text-darkest flex items-center">
            <i className={`${icon} text-2xl`}></i>
          </div>
        )}
      </div>
      <div className="stat-desc">{description}</div>
    </div>
  );
}
