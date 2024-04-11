const range = (size) =>
  Object.fromEntries(
    [...Array(size).keys()]
      .slice(1)
      .map((i) => [`${i}_${size}`, `${(i / size) * 100}%`])
  );

module.exports = {
  prefixer: false,
  separator: '_',
  compile: false,
  globalUtility: false,
  darkMode: 'media',
  corePlugins: {
    preflight: false,
    divideColor: false,
    divideOpacity: false,
    divideStyle: false,
    divideWidth: false,
    space: false,
    placeholderColor: false,
    placeholderOpacity: false,
    transitionProperty: false,
  },
  exclude: [/([0-9]{1,}[.][0-9]*)$/],
  theme: {
    extend: {
      colors: {
        primary: 'var(--nr-primary)',
        'module-bg': 'var(--nr-module-bg)',
        info: 'var(--info)',
        normal: 'var(--nr-normal)',
        main: 'var(--nr-main)',
        show: 'var(--nr-show)',
        danger: 'var(--nr-danger)',
        fff: 'var(--nr-fff)',
        second: 'var(--nr-second)',
        wallet: 'var(--nr-wallet)',
        fleet: 'var(--fleet)',
        g: '#9b9b9b',
      },
      lineHeight: {
        normal: '1.5',
        sm: '1.2',
      },
    },
    width: (theme) => ({
      auto: 'auto',
      full: '100%',
      screen: '100vw',
      ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
      ...theme('spacing'),
    }),
    height: (theme) => ({
      auto: 'auto',
      full: '100%',
      screen: '100vh',
      ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
      ...theme('spacing'),
    }),
    maxHeight: {
      full: '100%',
      screen: '100vh',
    },
  },
};
