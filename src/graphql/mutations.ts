// tslint:disable
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
