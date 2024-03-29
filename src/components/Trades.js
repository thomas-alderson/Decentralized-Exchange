import { useSelector } from "react-redux";
import { filledOrdersSelector } from "../store/selectors";
import sort from "../assets/sort.svg";
import Banner from "./Banner";

const Trades = () => {
  const symbols = useSelector((state) => state.tokens.symbols);
  const filledOrders = useSelector(filledOrdersSelector);

  return (
    <div className="component exchange__trades">
      <div className="component__header flex-between">
        <h2>Trades</h2>
      </div>

      {!filledOrders || filledOrders.length === 0 ? (
        <Banner text="No Transactions" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Times
                <img src={sort} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[0]}
                <img src={sort} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[1]}
                <img src={sort} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[1]}/{symbols && symbols[0]}
                <img src={sort} alt="Sort" />
              </th>
              <th>Fee</th>
            </tr>
          </thead>

          <tbody>
            {/* MAPPING OF ORDERS... */}

            {filledOrders &&
              filledOrders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{order.formattedTimestamp}</td>
                    <td>{order.token0Amount}</td>
                    <td>{order.token1Amount}</td>
                    <td style={{ color: `${order.orderClass}` }}>
                      {order.tokenPrice}
                    </td>
                    <td>{order.formattedFee}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Trades;
