import { ref, computed } from 'vue';

// Site is dark mode only
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.classList.add('dark-theme');
document.documentElement.classList.remove('light-theme');

try {
    localStorage.removeItem('user_theme');
} catch (e) {}

const theme = ref('dark');

export const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
};

export function useTheme() {
    return {
        theme: computed(() => 'dark'),
        isDark: computed(() => true),
        toggleTheme: () => {},
        setTheme: () => {}
    };
}
