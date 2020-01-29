// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateCashAccount = /* GraphQL */ `
  subscription OnCreateCashAccount($owner: String!) {
    onCreateCashAccount(owner: $owner) {
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
export const onUpdateCashAccount = /* GraphQL */ `
  subscription OnUpdateCashAccount($owner: String!) {
    onUpdateCashAccount(owner: $owner) {
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
export const onDeleteCashAccount = /* GraphQL */ `
  subscription OnDeleteCashAccount($owner: String!) {
    onDeleteCashAccount(owner: $owner) {
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
export const onCreateFlowOperation = /* GraphQL */ `
  subscription OnCreateFlowOperation($owner: String!) {
    onCreateFlowOperation(owner: $owner) {
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
export const onUpdateFlowOperation = /* GraphQL */ `
  subscription OnUpdateFlowOperation($owner: String!) {
    onUpdateFlowOperation(owner: $owner) {
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
export const onDeleteFlowOperation = /* GraphQL */ `
  subscription OnDeleteFlowOperation($owner: String!) {
    onDeleteFlowOperation(owner: $owner) {
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
export const onCreateTransferOperation = /* GraphQL */ `
  subscription OnCreateTransferOperation($owner: String!) {
    onCreateTransferOperation(owner: $owner) {
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
export const onUpdateTransferOperation = /* GraphQL */ `
  subscription OnUpdateTransferOperation($owner: String!) {
    onUpdateTransferOperation(owner: $owner) {
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
export const onDeleteTransferOperation = /* GraphQL */ `
  subscription OnDeleteTransferOperation($owner: String!) {
    onDeleteTransferOperation(owner: $owner) {
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
