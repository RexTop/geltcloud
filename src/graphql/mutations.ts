/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCashAccount = /* GraphQL */ `
  mutation CreateCashAccount(
    $input: CreateCashAccountInput!
    $condition: ModelCashAccountConditionInput
  ) {
    createCashAccount(input: $input, condition: $condition) {
      id
      name
      balance
      type
      credit
      closingDay
      paymentDay
      last4
      active
      currency
      precision
      owner
    }
  }
`;
export const updateCashAccount = /* GraphQL */ `
  mutation UpdateCashAccount(
    $input: UpdateCashAccountInput!
    $condition: ModelCashAccountConditionInput
  ) {
    updateCashAccount(input: $input, condition: $condition) {
      id
      name
      balance
      type
      credit
      closingDay
      paymentDay
      last4
      active
      currency
      precision
      owner
    }
  }
`;
export const deleteCashAccount = /* GraphQL */ `
  mutation DeleteCashAccount(
    $input: DeleteCashAccountInput!
    $condition: ModelCashAccountConditionInput
  ) {
    deleteCashAccount(input: $input, condition: $condition) {
      id
      name
      balance
      type
      credit
      closingDay
      paymentDay
      last4
      active
      currency
      precision
      owner
    }
  }
`;
export const createFlowOperation = /* GraphQL */ `
  mutation CreateFlowOperation(
    $input: CreateFlowOperationInput!
    $condition: ModelFlowOperationConditionInput
  ) {
    createFlowOperation(input: $input, condition: $condition) {
      id
      amount
      dateIssued
      description
      tags
      bankNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      owner
    }
  }
`;
export const updateFlowOperation = /* GraphQL */ `
  mutation UpdateFlowOperation(
    $input: UpdateFlowOperationInput!
    $condition: ModelFlowOperationConditionInput
  ) {
    updateFlowOperation(input: $input, condition: $condition) {
      id
      amount
      dateIssued
      description
      tags
      bankNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      owner
    }
  }
`;
export const deleteFlowOperation = /* GraphQL */ `
  mutation DeleteFlowOperation(
    $input: DeleteFlowOperationInput!
    $condition: ModelFlowOperationConditionInput
  ) {
    deleteFlowOperation(input: $input, condition: $condition) {
      id
      amount
      dateIssued
      description
      tags
      bankNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      owner
    }
  }
`;
export const createTransferOperation = /* GraphQL */ `
  mutation CreateTransferOperation(
    $input: CreateTransferOperationInput!
    $condition: ModelTransferOperationConditionInput
  ) {
    createTransferOperation(input: $input, condition: $condition) {
      id
      amount
      dateIssued
      dateAcquired
      description
      tags
      issuerBankNote
      acquirerBankNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      acquirerCashAccountID
      acquirerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      fee
      owner
    }
  }
`;
export const updateTransferOperation = /* GraphQL */ `
  mutation UpdateTransferOperation(
    $input: UpdateTransferOperationInput!
    $condition: ModelTransferOperationConditionInput
  ) {
    updateTransferOperation(input: $input, condition: $condition) {
      id
      amount
      dateIssued
      dateAcquired
      description
      tags
      issuerBankNote
      acquirerBankNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      acquirerCashAccountID
      acquirerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      fee
      owner
    }
  }
`;
export const deleteTransferOperation = /* GraphQL */ `
  mutation DeleteTransferOperation(
    $input: DeleteTransferOperationInput!
    $condition: ModelTransferOperationConditionInput
  ) {
    deleteTransferOperation(input: $input, condition: $condition) {
      id
      amount
      dateIssued
      dateAcquired
      description
      tags
      issuerBankNote
      acquirerBankNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      acquirerCashAccountID
      acquirerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      fee
      owner
    }
  }
`;
export const createTradeOperation = /* GraphQL */ `
  mutation CreateTradeOperation(
    $input: CreateTradeOperationInput!
    $condition: ModelTradeOperationConditionInput
  ) {
    createTradeOperation(input: $input, condition: $condition) {
      id
      note
      issuerNote
      acquirerNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      issuerCurrency
      acquirerCashAccountID
      acquirerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      acquirerCurrency
      amount
      price
      fee
      exchangeRate
      issuerExchangeRateInUsd
      acquirerExchangeRateInUsd
      dateIssued
      dateAcquired
      owner
    }
  }
`;
export const updateTradeOperation = /* GraphQL */ `
  mutation UpdateTradeOperation(
    $input: UpdateTradeOperationInput!
    $condition: ModelTradeOperationConditionInput
  ) {
    updateTradeOperation(input: $input, condition: $condition) {
      id
      note
      issuerNote
      acquirerNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      issuerCurrency
      acquirerCashAccountID
      acquirerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      acquirerCurrency
      amount
      price
      fee
      exchangeRate
      issuerExchangeRateInUsd
      acquirerExchangeRateInUsd
      dateIssued
      dateAcquired
      owner
    }
  }
`;
export const deleteTradeOperation = /* GraphQL */ `
  mutation DeleteTradeOperation(
    $input: DeleteTradeOperationInput!
    $condition: ModelTradeOperationConditionInput
  ) {
    deleteTradeOperation(input: $input, condition: $condition) {
      id
      note
      issuerNote
      acquirerNote
      issuerCashAccountID
      issuerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      issuerCurrency
      acquirerCashAccountID
      acquirerCashAccount {
        id
        name
        balance
        type
        credit
        closingDay
        paymentDay
        last4
        active
        currency
        precision
        owner
      }
      acquirerCurrency
      amount
      price
      fee
      exchangeRate
      issuerExchangeRateInUsd
      acquirerExchangeRateInUsd
      dateIssued
      dateAcquired
      owner
    }
  }
`;
