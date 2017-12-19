# vue-for-learning

Learning vue.js source code progressively and effectively

### what you will get

Totally understand how does vue actrually work with minimum cost

### stage-1

- use virtual dom to represent real dom 
- mount virtual dom to real dom

> learn `vnode`, `createElm`

### stage-2

- modify the previous code to make it looks more like Vue
- and prepare for next stage

> learn `proxy`

### stage-3

- make some change to the data and generate new vnode tree
- then diff the previous vnode tree and the current vnode tree
- finally patch those diffs to the real dom

> learn `diff`, `patch`

### stage-4

- make the data reactive so that rerender will excute automatically

> learn `Dep`, `Watcher`, `Getter`, `Setter`, `Subscribe/Publish`

### stage-5

- ...