const BASE_URL = import.meta.env.DEV ? '/api' : 'https://apinofudev.bengkelfajarjaya.com/api';

export const API_CONFIG = {
    customerApi: `${BASE_URL}/customer`,
    transactionApi: `${BASE_URL}/transaction`,
    productApi: `${BASE_URL}/product`,
};
