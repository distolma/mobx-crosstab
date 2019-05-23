const cross = require('..');
const {observable, autorun} = require('mobx');

const a = observable({ count: 0, box: 1 });
// const a = observable.box(0)

const o = cross('count')(a)

autorun(function() {
    console.log(o.count);
})

document.getElementById('inc').addEventListener('click', function() {
    a.count++
})
