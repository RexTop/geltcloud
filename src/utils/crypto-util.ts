import {AES, enc} from 'crypto-js';

export const LOCALSTORAGE_PREFIX = 'cloud.gelt-';
export const SECRET_PASSPHRASE_LOCALSTORAGE_KEY = LOCALSTORAGE_PREFIX + btoa('SECRET_PASSPHRASE_LOCALSTORAGE_KEY');

export const getSecretPassphrase = () => {
    return localStorage.getItem(SECRET_PASSPHRASE_LOCALSTORAGE_KEY) || '';
};

export const setSecretPassphrase = (value: string) => {
    return localStorage.setItem(SECRET_PASSPHRASE_LOCALSTORAGE_KEY, value);
};

export const encrypt = (message: string) => {
    return AES.encrypt(message, getSecretPassphrase()).toString();
};

export const decrypt = (encryptedMessage: string) => {
    return AES.decrypt(encryptedMessage, getSecretPassphrase()).toString(enc.Utf8);
};
