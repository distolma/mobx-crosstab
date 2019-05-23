var mobx = require('mobx')

module.exports = function (key) {
  return function (value) {
    var observable = mobx.isObservable(value) ? value : mobx.observable(value)

    mobx.autorun(function () {
      localStorage.setItem(key, JSON.stringify(mobx.toJS(observable)))
    })

    function handleStoreEvent (event) {
      var newValue = JSON.parse(event.newValue)

      mobx.set(observable, newValue)
    }

    window.addEventListener('storage', handleStoreEvent)

    return observable
  }
}
