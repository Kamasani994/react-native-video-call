import i18next from "i18next";
import english from './en.json';
import telugu from './tl.json';
import hindi from './hn.json';
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    resources: {
        en: english,
        tl: telugu,
        hn: hindi
    },
    react: {
        useSuspense: false
    }
})

export default i18next