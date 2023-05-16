import { SmaragdConfig } from 'smaragd/app.config'

export default defineAppConfig({
  smaragd: {
    colors: {
      themeMint: '#CADFD8',
      themeMintHov: '#CADFD8bb',
      themeMintContrast: '#000000',
      themeForrest: '#85ADA1',
      themeForrestHov: '#85ADA1bb',
      themeForrestContrast: '#ffffff',
      themeForrest40: '#85ADA140',
      themeSecondary: '#eeeeee',
      themeSecondaryHov: '#dddddd',
      themeSecondaryContrast: '#000000',

      backgroundRegular: '#293038',
      backgroundDark: '#22262b',
      backgroundDarker: '#11191e',
      backgroundLight: '#3a434c',
      backgroundLighter: '#666c72',
      border: '#495154',

      textHeader: '#ffffff',
      textMajor: '#ffffff',
      textRegular: '#eeeeee',
      textMinor: '#a6acb1',
      textSub: '#71797e',
    },
    fonts: {
      header: '"Montserrat 900", "Roboto", sans-serif',
      major: '"Montserrat 700", "Roboto", sans-serif',
      regular: '"Montserrat 500", "Roboto", sans-serif',
      minor: '"Montserrat 500", "Roboto", sans-serif',
      sub: '"Montserrat 500", "Roboto", sans-serif',
    },
    spacing: {
      tight: '10pt',
      regular: '20pt',
      loose: '50pt',
      contentHeight: '35pt',
      pageWidth: '600pt'
    },
    look: {
      borderRadiusRegular: '12pt',
      borderRadiusLoose: '100vw'
    }
  } satisfies SmaragdConfig
})
