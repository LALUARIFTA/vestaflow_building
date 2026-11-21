module.exports = {
  content: ['./frontend/index.html', './frontend/assets/js/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        canvas: '#E7E7E2',
        shell: '#F5F5F2',
        recessed: '#F6F6F3',
        obsidian: '#181A2A',
        indigoPrimary: '#4F46E5',
        indigoSoft: '#EEF2FF',
        citron: '#E2F87B',
        citronHover: '#D6F259',
        borderSubtle: '#E6E6E0',
        mutedText: '#7C7E85',
      },
      boxShadow: {
        card: '0 1px 2px rgba(24, 26, 42, 0.03), 0 4px 14px rgba(24, 26, 42, 0.02)',
        cardHover: '0 6px 20px rgba(24, 26, 42, 0.06)',
        shell: '0 24px 60px -15px rgba(24, 26, 42, 0.12)',
      }
    }
  }
};
