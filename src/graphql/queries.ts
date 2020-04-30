/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCashAccount = /* GraphQL */ `
  query GetCashAccount($id: ID!) {
    getCashAccount(id: $id) {
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
export const listCashAccounts = /* GraphQL */ `
  query ListCashAccounts(
    $filter: ModelCashAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCashAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getFlowOperation = /* GraphQL */ `
  query GetFlowOperation($id: ID!) {
    getFlowOperation(id: $id) {
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
export const listFlowOperations = /* GraphQL */ `
  query ListFlowOperations(
    $filter: ModelFlowOperationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFlowOperations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getTransferOperation = /* GraphQL */ `
  query GetTransferOperation($id: ID!) {
    getTransferOperation(id: $id) {
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
export const listTransferOperations = /* GraphQL */ `
  query ListTransferOperations(
    $filter: ModelTransferOperationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransferOperations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTradeOperation = /* GraphQL */ `
  query GetTradeOperation($id: ID!) {
    getTradeOperation(id: $id) {
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
export const listTradeOperations = /* GraphQL */ `
  query ListTradeOperations(
    $filter: ModelTradeOperationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTradeOperations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
