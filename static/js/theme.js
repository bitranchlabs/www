const setTheme = themeName => {
  const r = document.querySelector(':root');
  ['icon', 'text', 'background', 'foreground', 'accent-1', 'accent-2', 'link-hl'].forEach(s => {
    r.style.setProperty('--default-' + s, 'var(--' + themeName + '-' + s + ')')
    localStorage.setItem('theme', themeName);
  })

}

setTheme(localStorage.getItem('theme')
          ? localStorage.getItem('theme')
          : 'light');
