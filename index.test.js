var mobx = require('mobx')

var crossTab = require('.')

var storageCallback
jest.spyOn(window, 'addEventListener')
  .mockImplementation(function (event, callback) {
    if (event === 'storage') {
      storageCallback = callback
    }
  })
jest.spyOn(Storage.prototype, 'setItem')

beforeEach(function () {
  localStorage.clear()
  storageCallback = function () {}
})

describe('function', function () {
  it.todo('should set observable name as defaults')

  it('should set to the storage boxed value', function () {
    var boxStore = crossTab('box', mobx.observable.box(0))

    expect(localStorage.setItem).toBeCalledWith('box', '0')

    boxStore.set(10)

    expect(localStorage.setItem).toBeCalledWith('box', '10')
  })

  it('should set to the storage object value', function () {
    var objectStore = crossTab('foo', mobx.observable({ foo: 'baz' }))

    expect(localStorage.setItem)
      .toBeCalledWith('foo', JSON.stringify({ foo: 'baz' }))

    objectStore.foo = 'buz'

    expect(localStorage.setItem)
      .toBeCalledWith('foo', JSON.stringify({ foo: 'buz' }))
  })

  it('should change value when storage event emitted', function () {
    var key = 'foo'
    var store = crossTab(key, mobx.observable({ count: 1 }))

    storageCallback({
      key: key,
      newValue: JSON.stringify({ count: 2 })
    })

    expect(store.count).toBe(2)
  })

  it('should ignore other storege event', function () {
    var store = crossTab('baz', mobx.observable({ count: 1 }))

    storageCallback({
      key: 'foo',
      newValue: JSON.stringify({ count: 2 })
    })

    expect(store.count).toBe(1)
  })
})

// xdescribe('dectorator', function() {
//   class Store {
//     @crossTab
//     @mobx.observable
//     box = 0

//     @mobx.computed
//     get boxCalc() {
//       this.box++;
//       return this.box
//     }

//     @crossTab('')
//     @mobx.observable
//     namedBox = 0

//     @crossTab
//     @mobx.observable
//     object = { foo: 1 }

//     @crossTab('')
//     @mobx.observable
//     namedObject = { baz: 1 }
//   }

//   let store;

//   beforeEach(() => store = new Store());

// })
