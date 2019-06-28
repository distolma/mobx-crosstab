# MobX CrossTab

A tiny [MobX] module to synchronize state between browser tabs.

The size is only 249 bytes. It uses [Size Limit] to control size.

[mobx]:https://github.com/mobxjs/mobx
[size limit]: https://github.com/ai/size-limit

## Install
This module has peer dependencie of `mobx` which will has to be installed as well.
```sh
npm install mobx-crosstab
```

## How to use

By default `crossTab` function accept your state and apply it to `observable` function of `mobx` so you don't need to do it by yourself. This function return observable like `observable` function of `mobx` does

```javascript
import { observable } from 'mobx';
import crossTab from 'mobx-crosstab';

const store = crossTab('count', { count: 0 });
```

If you need to use another type of observation (ex. `deep`, `box`) you can create `observable` separately and pass it to the `crossTab` function

```javascript
import { observable } from 'mobx';
import crossTab from 'mobx-crosstab';

const store = observable.deep({ count: 0 });
crossTab('count', store);
```

Also, you can use `crossTab` functions with class properties

```javascript
import { observable } from 'mobx';
import crossTab from 'mobx-crosstab';

class TodoStore {
  todos = crossTab('todos', []);
}
```

```javascript
import { observable } from 'mobx';
import crossTab from 'mobx-crosstab';

class TodoStore {
  @crossTab('todos')
  @observable
  todos = [];
}
```

```javascript
import { observable } from 'mobx';
import crossTab from 'mobx-crosstab';

class TodoStore {
  @crossTab
  @observable
  todos = [];
}
```

## API Reference
