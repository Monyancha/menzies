import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import UserProfileReducer from './apps/userProfile/UserProfileSlice';
import { combineReducers } from 'redux';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import consignmentsReducer from './consignments/consignments-slice';
import accountsReducer from './accounts/accounts-slice';
import clientsReducer from './partners/clients-slice';
import staffReducer from './partners/staff-slice';
import accessControlReducer from './merchants/settings/access-control-slice';
import branchesReducer from './access/branches-slice';
import securityReducer from './access/security-slice';
import posTransactionReducer from './transactions/transaction-slice';
import reportsReducer from './reports/reports-slice';
import productsReducer from "./merchants/inventory/products-slice";
import transactionsReducer from "./merchants/transactions/transaction-list-slice";
import inventoryReducer from "./merchants/inventory/inventory-slice";
import purchasesReducer from "./merchants/inventory/purchases-slice";
import cargoReducer from './cargo/cargo-slice';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    chatReducer: ChatsReducer,
    userpostsReducer: UserProfileReducer,
    consignments: consignmentsReducer,
    accounts: accountsReducer,
    staff: staffReducer,
    clients: clientsReducer,
    inventory: inventoryReducer,
    purchases: purchasesReducer,
    accessControl: accessControlReducer,
    branches: branchesReducer,
    security: securityReducer,
    posTransaction: posTransactionReducer,
    reports: reportsReducer,
    products: productsReducer,
    transactions: transactionsReducer,
    cargo: cargoReducer,
  },
});

const rootReducer = combineReducers({
  customizer: CustomizerReducer,
  chatReducer: ChatsReducer,
  userpostsReducer: UserProfileReducer,
  consignments: consignmentsReducer,
  accounts: accountsReducer,
  staff: staffReducer,
  clients: clientsReducer,
  inventory: inventoryReducer,
  purchases: purchasesReducer,
  accessControl: accessControlReducer,
  branches: branchesReducer,
  security: securityReducer,
  posTransaction: posTransactionReducer,
  reports: reportsReducer,
  products: productsReducer,
  transactions: transactionsReducer,
  cargo: cargoReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;
