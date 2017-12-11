/**
 * apply virtual dom to real dom
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
    this.$options = options;
    
    initData(this);
    this.mount(document.querySelector(options.el))
  }

  Vue.prototype.mount = function (el) {
    this.$el = el;
    var vnode = this.$options.render.call(this)
    this.patch(this.$el, vnode)
  }

  Vue.prototype.patch = function (oldVnode, vnode) {
    var isRealElement = oldVnode.nodeType !== undefined; // virtual node has no `nodeType` property

    if (isRealElement) {
      createElm(vnode);
      var parent = oldVnode.parentNode;
      parent.insertBefore(vnode.elm, oldVnode);
      parent.removeChild(oldVnode);
    }

    return vnode.elm
  }

  new Vue({
    el: '#app',
    data: {
      message: 'Hello world'
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
          createElement(
            'p',
            { 
              attrs: {
                'class': 'inner'
              }
            },
            this.message
          )
        ]
      )
    }
  })

})();