import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  myOpenOrdersSelector,
  myFilledOrdersSelector,
} from "../store/selectors";

import sort from "../assets/sort.svg";

import Banner from "./Banner";

const Transactions = () => {
  const [showMyOrders, setShowMyOrders] = useState(true);
  const symbols = useSelector((state) => state.tokens.symbols);
  const myOpenOrders = useSelector(myOpenOrdersSelector);
  const myFilledOrders = useSelector(myFilledOrdersSelector);

  const orderRef = useRef(null);
  const tradeRef = useRef(null);

  const tabHandler = (event) => {
    console.log(event.target.id);
    if (event.target.id === "orders") {
      orderRef.current.className = "tab tab--active";
      tradeRef.current.className = "tab";
      setShowMyOrders(true);
    }
    if (event.target.id === "trades") {
      orderRef.current.className = "tab";
      tradeRef.current.className = "tab tab--active";
      setShowMyOrders(false);
    }
  };

  return (
    <div className="component exchange__transactions">
      {/*Show orders else show trades (always show buttons)*/}
      {showMyOrders ? (
        <div>
          <div className="component__header flex-between">
            <h2>My Orders</h2>

            <div className="tabs">
              <button
                onClick={tabHandler}
                ref={orderRef}
                id="orders"
                className="tab tab--active"
              >
                Orders
              </button>
              <button
                onClick={tabHandler}
                ref={tradeRef}
                id="trades"
                className="tab"
              >
                Trades
              </button>
            </div>
          </div>

          {/*Check for open/make orders*/}
          {!myOpenOrders || myOpenOrders.length === 0 ? (
            <Banner text="No Open Orders" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    {symbols && symbols[0]}
                    <img src={sort} alt="Sort" />
                  </th>
                  <th>
                    {symbols && symbols[0]}/{symbols && symbols[1]}
                    <img src={sort} alt="Sort" />
                  </th>
                  <th>CANCEL</th>
                </tr>
              </thead>
              <tbody>
                {myOpenOrders &&
                  myOpenOrders.map((order, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ color: `${order.orderTypeClass}` }}>
                          {order.token0Amount}
                        </td>
                        <td>{order.tokenPrice}</td>
                        <td>CANCEL</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          {/*Show trades/filled orders TBC*/}
          <div className="component__header flex-between">
            <h2>My Transactions</h2>

            <div className="tabs">
              <button
                onClick={tabHandler}
                ref={orderRef}
                id="orders"
                className="tab tab--active"
              >
                Orders
              </button>
              <button
                onClick={tabHandler}
                ref={tradeRef}
                id="trades"
                className="tab"
              >
                Trades
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  Time
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  {symbols && symbols[0]}
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  {symbols && symbols[0]}/{symbols && symbols[1]}
                  <img src={sort} alt="Sort" />
                </th>
              </tr>
            </thead>
            <tbody>
              {myFilledOrders &&
                myFilledOrders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.formattedTimestamp}</td>
                      <td style={{ color: `${order.orderClass}` }}>
                        {order.orderSign}
                        {order.token0Amount}
                      </td>
                      <td>{order.tokenPrice}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;