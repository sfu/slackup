const React = require('react')
const ReactDOM = require('react-dom')
const a11y = require('react-a11y')
if (process.env.NODE_ENV === 'development') {
  a11y(React)
}
const App = require('./app')

ReactDOM.render(<App />, document.getElementById('app'))
