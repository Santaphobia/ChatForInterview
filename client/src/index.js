import React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'
// styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'emoji-mart/css/emoji-mart.css'
// component
import { App } from './App'
// styles
const GlobalStyles = createGlobalStyle`
.card-header {
  padding: 0.25em 0.5em;
}
.card-body {
  padding: 0.25em 0.5em;
}
.card-text {
  margin: 0;
}
.emoji-mart {
    position: absolute;
    bottom: 85px
}
`


render(
    <>
        <GlobalStyles />
        <App />
    </>,
    document.getElementById('root')
)
