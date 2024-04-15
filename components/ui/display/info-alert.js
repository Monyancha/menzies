function InfoAlert({ title, message }) {
  return (
    <main className="grow flex justify-center">
      <div className="alert alert-info w-fit transition-all ease-out ignore">
        <div>
          <i className="fa-solid fa-info-circle"></i>
          <div>
            <h3 className="font-bold">{title}</h3>
            <div className="text-sm">{message}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default InfoAlert;
