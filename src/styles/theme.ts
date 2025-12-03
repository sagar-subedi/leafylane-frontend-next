// LeafyLane Theme Configuration
export const theme = {
    colors: {
        primary: {
            main: '#2D6A4F',      // Deep forest green
            light: '#52B788',     // Fresh leaf green
            lighter: '#95D5B2',   // Soft mint
            dark: '#1B4332',      // Dark forest
        },
        secondary: {
            main: '#74C69D',      // Muted green
            light: '#B7E4C7',     // Very light green
        },
        background: {
            default: '#F8FBF9',   // Off-white with green tint
            paper: '#FFFFFF',
            subtle: '#F1F8F4',
        },
        text: {
            primary: '#1B4332',   // Dark forest
            secondary: '#52B788', // Fresh green
            muted: '#6B7280',     // Gray
        },
        accent: {
            warning: '#D8572A',   // Terracotta
            success: '#40916C',   // Medium green
            info: '#74C69D',
        },
        border: {
            light: '#E5E7EB',
            main: '#D1D5DB',
        }
    },

    typography: {
        fontFamily: {
            heading: '"Poppins", sans-serif',
            body: '"Inter", sans-serif',
            accent: '"Playfair Display", serif',
        },
        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '1.875rem',  // 30px
            '4xl': '2.25rem',   // 36px
            '5xl': '3rem',      // 48px
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
    },

    spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
    },

    borderRadius: {
        sm: '0.25rem',    // 4px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
        '2xl': '1.5rem',  // 24px
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        green: '0 10px 25px -5px rgba(45, 106, 79, 0.2)',
        hover: '0 15px 30px -5px rgba(45, 106, 79, 0.25)',
    },

    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

export default theme;
