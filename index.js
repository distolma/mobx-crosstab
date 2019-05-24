var mobx = require('mobx')

function createCrossTab () {
  var key = [].shift.call(arguments)
  var observableValue = mobx.observable.apply(null, arguments)

  mobx.autorun(function () {
    localStorage.setItem(key, JSON.stringify(mobx.toJS(observableValue)))
  })

  function handleStoreEvent (event) {
    if (event.key === key) {
      var newValue = JSON.parse(event.newValue)

      mobx.set(observableValue, newValue)
    }
  }

  window.addEventListener('storage', handleStoreEvent)

  return observableValue
}

function namedCrossTabDecorator (name) {
  return function (target, key) {
    var val = target[key]

    function getter () {
      return val
    }

    function setter (next) {
      val = createCrossTab(name, next)
    }

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    })
  }
}

module.exports = function crossTab (arg1, arg2) {
  // crossTab(state)
  if (arguments.length === 1 && typeof arg1 !== 'string') {
    return createCrossTab('default', arg1)
  }

  // crossTab('count', state)
  if (arguments.length === 2 && typeof arg1 === 'string') {
    return createCrossTab.apply(null, arguments)
  }

  // @crossTab('count') state
  if (arguments.length === 1 && typeof arg1 === 'string') {
    return namedCrossTabDecorator(arg1)
  }

  // @crossTab state
  return namedCrossTabDecorator(arg2).apply(null, arguments)
}
