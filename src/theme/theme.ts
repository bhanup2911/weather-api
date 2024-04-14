import { extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/open-sans'
import '@fontsource-variable/raleway'

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body:  `'Open Sans', sans-serif`,
  },
})

export default theme;