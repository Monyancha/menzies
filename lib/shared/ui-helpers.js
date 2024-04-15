import { useRouter } from "next/router";

const darkModePages = [
  "/merchants/transactions/v3",
  "/merchants/transactions/v3/new",
  "/merchants/transactions/v3/suspended",
  "/merchants/transactions/v3/credited",
  "/merchants/transactions/v3/voided",

  "/merchants/transactions/orders",
  "/merchants/transactions/suspended-transactions",

  "/merchants/transactions/tables",
  "/merchants/transactions/tables/[tableId]",
  "/merchants/transactions/tables/tables",
  "/merchants/transactions/tables/[tableId]/orders/[orderId]",
  "/merchants/transactions/view/[transactionId]",

  "/merchants/auto-kanban",
  "/merchants/auto-kanban/list",
  "/merchants/auto-kanban/form_definition",
  "/merchants/auto-kanban/edit/[autoTransactionId]",
];

export const isThemeDark = ({ path = null } = {}) => {
  // Dark unless specified otherwise
  if (typeof window === "undefined") {
    return true;
  }

  const isDarkModeV1 = darkModePages.findIndex((item) => item === path) !== -1;

  return (
    (path === null || isDarkModeV1) && localStorage.getItem("theme") !== "light"
  );
};
