import {AES, enc} from 'crypto-js';

const secretPassphrase = () => {
    return 'Secret passphrase';
};

export const encrypt = (message: string) => {
    return AES.encrypt(message, secretPassphrase()).toString();
};

export const decrypt = (encryptedMessage: string) => {
    return AES.decrypt(encryptedMessage, secretPassphrase()).toString(enc.Utf8);
};
