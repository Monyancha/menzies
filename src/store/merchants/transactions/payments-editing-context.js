import { createContext, useState } from "react";
import getLogger from "../../../lib/shared/logger";

const PaymentsEditingContext = createContext({
  payments: [],
  actions: {
    addCashPayment: () => {},
    setCashPaymentAmount: (index, amount) => {},
    addCreditPayment: () => {},
    setCreditPaymentAmount: (index, amount) => {},
    addMpesaPayment: () => {},
    setMpesaPaymentAmount: (index, amount) => {},
    setMpesaPaymentPhone: (index, phone) => {},
    // Checkout id insertion
    setMpesaPaymentCheckoutId: (index, checkout_id) => {},
    setMpesaPaymentCode: (index, transaction_code) => {},
    sendStkPush: (index) => {},
    deletePayment: (index) => {},
    addCreditedPayment: () => {},
    clearAllPayments: () => {},
    preloadFromDb: (payments) => {},
    creditPaymentsSum: () => {},
    alreadyPaidSum: () => {},
  },
});

export const PaymentsEditingContextProvider = (props) => {
  const [payments, setPayments] = useState([]);
  const logger = getLogger("PaymentsEditingContext");

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

    tmpPayments[index].checkout_id = checkout_id;

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

  function preloadFromDb(payments) {
    // const tmpPayments = [...payments];
    const tmpPayments = payments.map((payment) => {
      const newPayment = {
        type: payment.type,
        amount: parseInt(payment.paymentable.amount)
          ? parseInt(payment.paymentable.amount)
          : 0,
        payment_type: payment.paymentable.type,
      };

      if (newPayment.type === "mpesa") {
        newPayment["phone"] = payment.paymentable.phone_number;
        newPayment["transaction_code"] = payment.paymentable.transaction_code;
      }

      return newPayment;
    });

    setPayments(tmpPayments);
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
    console.log("Rock my world", payments);
    const sum = payments.reduce(
      (partialSum, item) =>
        partialSum + (item.type === "credit" ? 0 : item.amount),
      0
    );
    return sum;
  }

  const context = {
    payments,
    actions: {
      addCashPayment,
      setCashPaymentAmount,
      addCreditPayment,
      setCreditPaymentAmount,
      addMpesaPayment,
      setMpesaPaymentAmount,
      setMpesaPaymentPhone,
      setMpesaPaymentCheckoutId,
      setMpesaPaymentCode,
      deletePayment,
      clearAllPayments,
      preloadFromDb,
      creditPaymentsSum,
      alreadyPaidSum,
    },
  };

  return (
    <PaymentsEditingContext.Provider value={context}>
      {props.children}
    </PaymentsEditingContext.Provider>
  );
};

export default PaymentsEditingContext;
