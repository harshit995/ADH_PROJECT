const Table = (props) => {
  const { details } = props;

  return (
    <div className="transaction-details-table">
      <h4>Details related to id - {details.id} </h4>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(details).map((detail) => (
            <tr key={detail[0]}>
              <td>{detail[0] ? detail[0] : "-"}</td>
              <td>{detail[1] ? detail[1] : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
