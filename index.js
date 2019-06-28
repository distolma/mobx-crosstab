var mobx = require('mobx')

function createCrossTab (key, observable) {
  // let skip = true;
  mobx.autorun(function () {
    localStorage.setItem(key, JSON.stringify(mobx.toJS(observable)))
  })

  function handleStoreEvent (event) {
    if (event.key === key) {
      // if (!skip) {
      var newValue = JSON.parse(event.newValue)

      mobx.set(observable, newValue)
      // }
      // else {
      //   skip = false
      // }
    }
  }

  window.addEventListener('storage', handleStoreEvent)

  return observable
}

function namedCrossTabDecorator (name) {
  return function (target, key, descriptor) {
    mobx.spy(function (event) {
      if (event.type !== 'add') return
      if (event.key !== key) return
      if (!target.isPrototypeOf(event.object)) return

      createCrossTab(name, event.newValue)
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
