const cross = require('..');
const {observable, autorun} = require('mobx');

// const a = observable({ count: 0, box: 1 });
// const a = observable.box(0)

// const o = cross('count', { count: 0, box: 1 })

class Store {
  @cross
  @observable
  count = 0;
}

const store = new Store();

console.log(store)
// store.count.lol = 1

autorun(function() {
    console.log(store.count);
})

document.getElementById('inc').addEventListener('click', function() {
  store.count++
})
