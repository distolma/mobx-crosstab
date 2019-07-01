var mobx = require('mobx')

function createCrossTab (name, observable, target, key) {
  var isBoxed = mobx.isBoxedObservable(observable)
  var isPropObservable = mobx.isObservableProp(target || {}, key || '')

  mobx.autorun(function () {
    var value = isPropObservable ? target[key] : observable
    value = isBoxed ? observable.get() : value

    localStorage[name] = JSON.stringify(mobx.toJS(value))
  })

  window.addEventListener('storage', function (event) {
    if (event.key === name && event.newValue) {
      var newValue = JSON.parse(event.newValue)

      if (isBoxed) {
        observable.set(newValue)
      } else if (isPropObservable) {
        target[key] = newValue
      } else {
        mobx.set(observable, newValue)
      }
    }
  })

  return observable
}

function namedCrossTabDecorator (name) {
  return function (target, key, descriptor) {
    mobx.spy(function (event) {
      if (event.type !== 'add') return
      if (event.key !== key) return
      if (!target.isPrototypeOf(event.object)) return

      createCrossTab(name, event.newValue, event.object, key)
    })

    return descriptor
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
