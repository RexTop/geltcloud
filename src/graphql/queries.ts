// tslint:disable
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
        owner
      }
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
          owner
        }
        owner
      }
      nextToken
    }
  }
`;
