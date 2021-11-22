const setTheme = themeName => {
  const r = document.querySelector(':root');
  ['icon', 'text', 'background', 'foreground', 'accent-1', 'accent-2', 'link-hl'].forEach(s => {
    r.style.setProperty('--default-' + s, 'var(--' + themeName + '-' + s + ')')
    localStorage.setItem('theme', themeName);
  })

}

// const themeSwitch = document.querySelector('.theme-switch');
// themeSwitch.checked = localStorage.getItem('switchedTheme') === 'true';
//
// themeSwitch.addEventListener('change', e => {
//   if(e.currentTarget.checked === true) {
//     localStorage.setItem('switchedTheme', 'true');
//   } else {
//     localStorage.removeItem('switchedTheme');
//   }
// });
//
