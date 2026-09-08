/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'modern',
    themes: {
      modern: {
        dark: false,
        colors: {
          primary: '#00897B',
          secondary: '#455A64',
          accent: '#4DB6AC',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
          error: '#FF5252',
        }
      }
    }
  },
})
