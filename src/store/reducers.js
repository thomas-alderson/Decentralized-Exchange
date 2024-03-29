// ---------------------------------------------------------
// PROVIDER

export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };
    default:
      return state;
  }
};

// ---------------------------------------------------------
// TOKENS

const DEFAULT_TOKENS_STATE = {
  loaded: false,
  contracts: [],
  symbols: [],
};

export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {
  switch (action.type) {
    case "TOKEN1_LOADED":
      return {
        ...state,
        loaded: true,
        contracts: [action.token],
        symbols: [action.symbol],
      };
    case "TOKEN2_LOADED":
      return {
        ...state,
        loaded: true,
        contracts: [...state.contracts, action.token],
        symbols: [...state.symbols, action.symbol],
      };
    case "TOKEN1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };
    case "TOKEN2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };
    default:
      return state;
  }
};

// ---------------------------------------------------------
// EXCHANGE

const DEFAULT_EXCHANGE_STATE = {
  loaded: false,
  contract: {},
  balances: {},
  feeBalances: {},
  cancelledOrders: {
    loaded: false,
    data: [],
  },
  filledOrders: {
    loaded: false,
    data: [],
  },
  allOrders: {
    loaded: false,
    data: [],
  },
  transaction: {
    transactionType: "",
    isPending: false,
    isSuccessful: false,
    isError: false,
  },
  transferInProgress: false,
  events: [],
};

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
  let index, data;

  switch (action.type) {
    case "EXCHANGE_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.exchange,
      };

    // ------------------------------------------------------------------------------
    // LOAD ORDERS (CANCELLED, FILLED & ALL)

    case "CANCELLED_ORDERS_LOADED":
      return {
        ...state,
        cancelledOrders: {
          loaded: true,
          data: action.cancelledOrders,
        },
        events: [...action.cancelStream],
      };

    case "FILLED_ORDERS_LOADED":
      return {
        ...state,
        filledOrders: {
          loaded: true,
          data: action.filledOrders,
        },
        events: [...action.filledStream],
      };

    case "ALL_ORDERS_LOADED":
      return {
        ...state,
        allOrders: {
          loaded: true,
          data: action.allOrders,
        },
        events: [...action.orderStream],
      };

    // ------------------------------------------------------------------------------
    // CANCELLING ORDERS

    case "ORDER_CANCEL_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Cancel",
          isPending: true,
          isSuccessful: false,
        },
      };
    case "ORDER_CANCEL_SUCCESS":
      // Don't add duplicate events
      index = state.events.findIndex(
        (event) => event.transactionHash === action.event.transactionHash
      );     
      if (index === -1) {
        data = [...state.events, action.event];
      } else {
        data = state.events;
      }
      return {
        ...state,
        transaction: {
          transactionType: "Cancel",
          isPending: false,
          isSuccessful: true,
        },
        cancelledOrders: {
          ...state.cancelledOrders,
          data: [...state.cancelledOrders.data, action.order],
        },
        events: data,
      };
    case "ORDER_CANCEL_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Cancel",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };

    // ------------------------------------------------------------------------------
    // FILLING ORDERS

    case "ORDER_FILL_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Fill order",
          isPending: true,
          isSuccessful: false,
        },
      };
    case "ORDER_FILL_SUCCESS":
      // Prevent duplicate orders
      index = state.filledOrders.data.findIndex(
        (order) => order.id.toString() === action.order.id.toString()
      );
      if (index === -1) {
        data = [...state.filledOrders.data, action.order];
      } else {
        data = state.filledOrders.data;
      }
      return {
        ...state,
        transaction: {
          transactionType: "Fill order",
          isPending: false,
          isSuccessful: true,
        },
        filledOrders: {
          ...state.filledOrders.data,
          data,
        },
        events: [action.event, ...state.events],
      };
    case "ORDER_FILL_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Fill order",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };

    // ------------------------------------------------------------------------------
    // BALANCE CASES

    case "EXCHANGE_TOKEN1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };
    case "EXCHANGE_TOKEN2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };
    case "EXCHANGE_TOKEN1_FEE_BALANCE_LOADED":
      return {
        ...state,
        feeBalances: [action.balance],
      };
    case "EXCHANGE_TOKEN2_FEE_BALANCE_LOADED":
      return {
        ...state,
        feeBalances: [...state.feeBalances, action.balance],
      };

    // ------------------------------------------------------------------------------
    // TRANSFER CASES (DEPOSIT & WITHDRAWS)

    case "TRANSFER_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: true,
          isSuccessful: false,
        },
        transferInProgress: true,
      };
    case "TRANSFER_SUCCESS":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: true,
        },
        transferInProgress: false,
        events: [action.event, ...state.events],
      };
    case "TRANSFER_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
        transferInProgress: false,
      };

    // ------------------------------------------------------------------------------
    // MAKING ORDERS CASES

    case "NEW_ORDER_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "New Order",
          isPending: true,
          isSuccessful: false,
        },
      };

    case "NEW_ORDER_SUCCESS":
      // Prevent duplicate orders
      index = state.allOrders.data.findIndex(
        (order) => order.id.toString() === action.order.id.toString()
      );

      if (index === -1) {
        data = [...state.allOrders.data, action.order];
      } else {
        data = state.allOrders.data;
      }

      return {
        ...state,
        allOrders: {
          ...state.allOrders,
          data,
        },
        transaction: {
          transactionType: "New Order",
          isPending: false,
          isSuccessful: true,
        },
        events: [action.event, ...state.events],
      };

    case "NEW_ORDER_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "New Order",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };

    default:
      return state;
  }
};
