import { createContext, useState } from "react";
import getLogger from "../../../lib/shared/logger";

const PaymentsContext = createContext({
  payments: [],
  actions: {
    addCashPayment: () => {},
    setCashPaymentAmount: (index, amount) => {},
    addCardPayment: () => {},
    setCardPaymentAmount: (index, amount) => {},
    addCreditPayment: () => {},
    setCreditPaymentAmount: (index, amount) => {},
    addMpesaPayment: () => {},
    setMpesaPaymentAmount: (index, amount) => {},
    setMpesaPaymentPhone: (index, phone) => {},
    setMpesaPaymentCheckoutId: (index, checkout_id) => {},
    setMpesaPaymentCode: (index, transaction_code) => {},
    sendStkPush: (index) => {},
    deletePayment: (index) => {},
    addCreditedPayment: () => {},
    clearAllPayments: () => {},
    creditPaymentsSum: () => {},
    alreadyPaidSum: () => {},
  },
});

export const PaymentsContextProvider = (props) => {
  const [payments, setPayments] = useState([]);
  const logger = getLogger("PaymentsContext");

  function addCashPayment() {
    const payment = {
      type: "cash",
      amount: "",
      payment_type: "debit",
    };

    logger.log("addCashPayment", payment);

    setPayments([...payments, payment]);
  }

  function setCashPaymentAmount(index, amount) {
    const tmpPayments = [...payments];
    logger.log(`setCashPaymentAmount ${index} ${isNaN(index)}`, tmpPayments);

    tmpPayments[index].amount = parseInt(amount) ? parseInt(amount) : 0;

    setPayments(tmpPayments);
  }

  function addCardPayment() {
    const payment = {
      type: "card",
      amount: "",
      payment_type: "debit",
    };

    logger.log("addCardPayment", payment);

    setPayments([...payments, payment]);
  }

  function setCardPaymentAmount(index, amount) {
    const tmpPayments = [...payments];
    logger.log(`setCardPaymentAmount ${index} ${isNaN(index)}`, tmpPayments);

    tmpPayments[index].amount = parseInt(amount) ? parseInt(amount) : 0;

    setPayments(tmpPayments);
  }

  function addMpesaPayment() {
    const payment = {
      type: "mpesa",
      amount: "",
      phone: "",
      transaction_code: "",
      payment_type: "debit",
    };

    logger.log("addMpesaPayment", payment);

    setPayments([...payments, payment]);
  }

  function addCreditPayment() {
    const payment = {
      type: "credit",
      amount: "",
      payment_type: "credit",
    };

    logger.log("addCreditPayment", payment);

    setPayments([...payments, payment]);
  }

  function setCreditPaymentAmount(index, amount) {
    const tmpPayments = [...payments];

    tmpPayments[index].amount = parseInt(amount) ? parseInt(amount) : 0;

    setPayments(tmpPayments);
  }

  function setMpesaPaymentAmount(index, amount) {
    const tmpPayments = [...payments];

    tmpPayments[index].amount = parseInt(amount) ? parseInt(amount) : 0;

    setPayments(tmpPayments);
  }

  function setMpesaPaymentPhone(index, phone) {
    const tmpPayments = [...payments];

    tmpPayments[index].phone = phone;

    setPayments(tmpPayments);
  }

  function setMpesaPaymentCheckoutId(index, checkout_id) {
    const tmpPayments = [...payments];

    tmpPayments[index].checkout_Id = checkout_id;

    setPayments(tmpPayments);
  }

  function setMpesaPaymentCode(index, transaction_code) {
    const tmpPayments = [...payments];

    tmpPayments[index].transaction_code = transaction_code;

    setPayments(tmpPayments);
  }

  function sendStkPush(index) {
    return;
  }

  function deletePayment(i) {
    const remainingPayments = payments.filter((payment, index) => index !== i);

    setPayments(remainingPayments);
  }

  function clearAllPayments() {
    setPayments([]);
  }

  function creditPaymentsSum() {
    const sum = payments.reduce(
      (partialSum, item) =>
        partialSum + (item.type !== "credit" ? 0 : item.amount),
      0
    );
    return sum;
  }

  function alreadyPaidSum() {
    return 0;
  }

  const context = {
    payments,
    actions: {
      addCashPayment,
      setCashPaymentAmount,
      addCardPayment,
      setCardPaymentAmount,
      addCreditPayment,
      setCreditPaymentAmount,
      addMpesaPayment,
      setMpesaPaymentAmount,
      setMpesaPaymentPhone,
      setMpesaPaymentCheckoutId,
      setMpesaPaymentCode,
      deletePayment,
      clearAllPayments,
      creditPaymentsSum,
      alreadyPaidSum,
    },
  };

  return (
    <PaymentsContext.Provider value={context}>
      {props.children}
    </PaymentsContext.Provider>
  );
};

export default PaymentsContext;
