import { ref, computed } from 'vue';

// Default to 'dark' as requested by the user
const savedTheme = localStorage.getItem('user_theme');
const theme = ref(savedTheme || 'dark');

// Apply theme to document element
export const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    if (themeName === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
    } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
    }
};

// Initial run
applyTheme(theme.value);

export function useTheme() {
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        localStorage.setItem('user_theme', theme.value);
        applyTheme(theme.value);
    };

    const setTheme = (newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
            theme.value = newTheme;
            localStorage.setItem('user_theme', theme.value);
            applyTheme(theme.value);
        }
    };

    const currentTheme = computed(() => theme.value);
    const isDark = computed(() => theme.value === 'dark');

    return {
        theme: currentTheme,
        isDark,
        toggleTheme,
        setTheme
    };
}
