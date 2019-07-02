var mobx = require('mobx')

function createCrossTab (name, observable, target, key) {
  var isBoxed = mobx.isBoxedObservable(observable)
  var isPropObservable = mobx.isObservableProp(target || {}, key || '')
  var firstrun = true

  if (firstrun && localStorage[name]) {
    setValue(localStorage[name])
    firstrun = false
  }

  function setValue (value) {
    try {
      value = JSON.parse(value)

      if (isBoxed) {
        observable.set(value)
      } else if (isPropObservable) {
        target[key] = value
      } else {
        mobx.set(observable, value)
      }
    } catch (error) { }
  }

  mobx.autorun(function () {
    var value = isPropObservable ? target[key] : observable
    value = isBoxed ? observable.get() : value

    localStorage[name] = JSON.stringify(mobx.toJS(value))
  })

  window.addEventListener('storage', function (event) {
    if (event.key === name && event.newValue) {
      setValue(event.newValue)
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

function crossTab (arg1, arg2) {
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

module.exports = { crossTab: crossTab }
