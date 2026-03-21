import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './locales/vi/common.json';
import viHome from './locales/vi/home.json';
import viProduct from './locales/vi/product.json';
import viCart from './locales/vi/cart.json';
import viCheckout from './locales/vi/checkout.json';
import viOrder from './locales/vi/order.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enProduct from './locales/en/product.json';
import enCart from './locales/en/cart.json';
import enCheckout from './locales/en/checkout.json';
import enOrder from './locales/en/order.json';

const resources = {
    vi: {
        common: viCommon,
        home: viHome,
        product: viProduct,
        cart: viCart,
        checkout: viCheckout,
        order: viOrder,
    },
    en: {
        common: enCommon,
        home: enHome,
        product: enProduct,
        cart: enCart,
        checkout: enCheckout,
        order: enOrder,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'vi',
        ns: ['common', 'home', 'product', 'cart', 'checkout', 'order'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;