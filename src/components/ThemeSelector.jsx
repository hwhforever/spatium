function ThemeSelector({ currentTheme, onThemeChange }) {
  const themes = [
    { id: 'dark', name: 'Dark', color: '#1f2937' },
    { id: 'space', name: 'Space', color: '#1e1b4b' },
    { id: 'bloomberg', name: 'Bloomberg', color: '#000000' },
    { id: 'ocean', name: 'Ocean', color: '#1e3a8a' },
    { id: 'forest', name: 'Forest', color: '#166534' }
  ];

  return (
    <div className="theme-selector">
      <div className="flex flex-col space-y-2">
        {themes.map(theme => (
          <button
            key={theme.id}
            className={`theme-button ${currentTheme === theme.id ? 'active' : ''}`}
            style={{ backgroundColor: theme.color }}
            onClick={() => onThemeChange(theme.id)}
            title={`${theme.name} Theme`}
          />
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
