import { ref, computed } from 'vue';

const lang = ref(localStorage.getItem('user_lang') || 'pt');

export function useLanguage() {
    const toggleLanguage = () => {
        lang.value = lang.value === 'pt' ? 'en' : 'pt';
        localStorage.setItem('user_lang', lang.value);
    };

    const currentLang = computed(() => lang.value);

    // i18n logic helper
    const t = (ptText, enText) => {
        return lang.value === 'pt' ? ptText : enText;
    };

    return {
        lang: currentLang,
        toggleLanguage,
        t
    };
}
