import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

// Import Assets
import sort from "../assets/sort.svg";

// Import Selectors
import { orderBookSelector } from "../store/selectors";
import { fillOrder } from "../store/interactions";
import { loadBalances } from "../store/interactions";

const GREEN = "#25CE8F";
const RED = "#F45353";

const OrderBook = () => {
  const dispatch = useDispatch();

  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);

  const exchange = useSelector((state) => state.exchange.contract);
  const exchangeBalances = useSelector((state) => state.exchange.balances);

  const tokens = useSelector((state) => state.tokens.contracts);
  const symbols = useSelector((state) => state.tokens.symbols);
  const tokenBalances = useSelector((state) => state.tokens.balances);

  const orderBook = useSelector(orderBookSelector);

  const fillOrderHandler = (order) => {
    //console.log(order.id)
    fillOrder(provider, exchange, order, dispatch, tokens, account);
  };

  return (
    <div className="component exchange__orderbook">
      <div className="component__header flex-between">
        <h2>Order Book</h2>
      </div>

      <div className="flex">
        {!orderBook || orderBook.buyOrders.length === 0 ? (
          <p className="flex-center">No Buy Orders</p>
        ) : (
          <table className="exchange__orderbook--buy">
            <caption>Buying</caption>

            {/* COLUMN TITLES */}
            <thead>
              <tr>
                <th>
                  {symbols && symbols[0]}
                  <img src={sort} alt="Sort" />
                </th>
                 <th>
                  {symbols && symbols[1]}
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  Price
                  <img src={sort} alt="Sort" />
                </th>
              </tr>
            </thead>

            {/* ORDER BOOK */}
            <tbody>
              {orderBook &&
                orderBook.buyOrders.map((order, index) => {
                  return (
                    <tr key={index} onClick={() => fillOrderHandler(order)}>
                      <td>{order.token0Amount}</td>
                      <td>{order.token1Amount}</td>
                      <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}

        <div className="divider"></div>

        {!orderBook || orderBook.sellOrders.length === 0 ? (
          <p className="flex-center">No Sell Orders</p>
        ) : (
          <table className="exchange__orderbook--sell">
            <caption>Selling</caption>

            {/* COLUMN TITLES */}
            <thead>
              <tr>
                <th>
                  {symbols && symbols[0]}
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  {symbols && symbols[1]}
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  Price
                  <img src={sort} alt="Sort" />
                </th>
              </tr>
            </thead>

            {/* ORDER BOOK */}
            <tbody>
              {orderBook &&
                orderBook.sellOrders.map((order, index) => {
                  return (
                    <tr key={index} onClick={() => fillOrderHandler(order)}>
                      <td>{order.token0Amount}</td>
                      <td>{order.token1Amount}</td>
                      <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderBook;
