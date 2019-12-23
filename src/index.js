import { c } from './deps/a'
import { hot } from './hot'

hot()
module.hot.accept('./hot', () => {
  hot()
})

window.onbeforeunload = () => {
  debugger
}
