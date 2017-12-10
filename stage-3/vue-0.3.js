/**
 * make some change to the data and rerender the virtual dom
 * then diff the previous vnode tree and the current vnode tree
 * finally patch those diffs to the real dom
 */

;(function () {

  function vnode (tag, data, children, text, elm) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
  }

  function normalizeChildren (children) {
    if (typeof children === 'string') {
      return [createTextVNode(children)]
    }
    return children
  }

  function createTextVNode (val) {
    return new vnode(undefined, undefined, undefined, String(val))
  }

  function createElement (tag, data, children) {
    return new vnode(tag, data, normalizeChildren(children), undefined, undefined);
  }

  function createElm (vnode) {
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;

    if (tag !== undefined) {
      vnode.elm = document.createElement(tag);

      if (data.attrs !== undefined) {
        var attrs = data.attrs;
        for (var key in attrs) {
          vnode.elm.setAttribute(key, attrs[key])
        }
      }

      if (children) {
        createChildren(vnode, children)
      }
    } else {
      vnode.elm = document.createTextNode(vnode.text);
    }

    return vnode.elm;
  }

  function createChildren (vnode, children) {
    for (var i = 0; i < children.length; ++i) {
      vnode.elm.appendChild(createElm(children[i]));
    }
  }

  function sameVnode (vnode1, vnode2) {
    return vnode1.tag === vnode2.tag
  }

  function emptyNodeAt (elm) {
    return new vnode(elm.tagName.toLowerCase(), {}, [], undefined, elm)
  }

  function patchVnode (oldVnode, vnode) {
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;

    if (!vnode.text) {
      if (oldCh && ch) {
        updateChildren(oldCh, ch);
      }
    } else if (oldVnode.text !== vnode.text) {
      elm.textContent = vnode.text;
    }
  }

  function updateChildren (oldCh, newCh) {
    // assume that every element node has only one child to simplify our diff algorithm
    if (sameVnode(oldCh[0], newCh[0])) {
      patchVnode(oldCh[0], newCh[0])
    } else {
      patch(oldCh[0], newCh[0])
    }
  }

  function patch (oldVnode, vnode) {
    var isRealElement = oldVnode.nodeType !== undefined; // virtual node has no `nodeType` property
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode);
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode);
      }
      var elm = oldVnode.elm;
      var parent = elm.parentNode;
      
      createElm(vnode);

      parent.insertBefore(vnode.elm, elm);
      parent.removeChild(elm);
    }

    return vnode.elm
  }

  function initData (vm) {
    var data = vm.$data = vm.$options.data;
    var keys = Object.keys(data);
    var i = keys.length
    // proxy data so you can use `this.key` directly other than `this.$data.key`
    while (i--) {
      proxy(vm, keys[i])
    }
  }

  function proxy (vm, key) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return vm.$data[key]
      },
      set: function (val) {
        vm.$data[key] = val
      }
    })
  }

  function Vue (options) {
    var vm = this;
    vm.$options = options;
    
    initData(vm);
    vm.mount(document.querySelector(options.el))
  }

  Vue.prototype.mount = function (el) {
    var vm = this;
    vm.$el = el;
    vm.update(vm.render())
  }

  Vue.prototype.update = function (vnode) {
    var vm = this;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      vm.$el = vm.patch(vm.$el, vnode);
    } else {
      vm.$el = vm.patch(prevVnode, vnode);
    }
  }

  Vue.prototype.patch = patch;

  Vue.prototype.render = function () {
    var vm = this;
    return vm.$options.render.call(vm)
  }

  var vm = new Vue({
    el: '#app',
    data: {
      message: 'Hello world',
      isShow: true
    },
    render () {
      return createElement(
        'div',
        {
          attrs: {
            'class': 'wrapper'
          }
        },
        [
          this.isShow
          ? createElement(
            'p',
            { 
              attrs: {
                'class': 'inner'
              }
            },
            this.message
          )
          : createElement(
            'h1',
            { 
              attrs: {
                'class': 'inner'
              }
            },
            'Hello world'
          )
        ]
      )
    }
  })

  // test
  setTimeout(function () {
    vm.message = 'Hello';
    vm.update(vm.render())
  }, 1000)

  setTimeout(function () {
    vm.isShow = false;
    vm.update(vm.render())
  }, 2000)
})();