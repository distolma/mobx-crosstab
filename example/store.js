var { observable, autorun } = require('mobx')
var crossTab = require('..')

function $ (selector) {
  return document.querySelector(selector)
}

$('#dec').addEventListener('click', function () {
  store.count--
})
$('#inc').addEventListener('click', function () {
  store.count++
})

class Store {
  @crossTab
  @observable
  count = 0
}

var store = new Store()

autorun(function () {
  $('#count').innerText = store.count;
})
