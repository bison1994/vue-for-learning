(function () {

  /**
   * make data reactive
   */

  function vnode (tag, attr, children, text) {
    this.tag = tag;
    this.attr = attr;
    this.children = children;
    this.text = text;
  }

  function h (tag, attr, children, text) {
    var node = new vnode(tag, attr, children, text);
    return createElement(this, node);
  }

  function createElement (vm, vnode) {
    var $el;
    var tag = vnode.tag;
    var text = vnode.text;
    if (tag) {
      $el = document.createElement(tag)
    } else if (text) {
      return document.createTextNode(text)
    }

    var $attr = vnode.attr;
    if ($attr) {
      for (var key in $attr) {
        if (isDirective(key)) {
          handleDirective(vm, key.slice(2), $attr[key], $el)
          continue
        }
        $el.setAttribute(key, $attr[key])
      }
    }

    var $children = vnode.children;
    if ($children) {
      for (var i = 0; i < $children.length; i++) {
        $el.appendChild($children[i])
      }
    }
    return $el
  }

  function isDirective (key) {
    return key.indexOf('v-') > -1
  }

  function handleDirective (vm, type, exp, node) {
    if (type === 'text') {
      var watcher = {
        update: function () {
          console.log('update text');
          node.textContent = vm.$data[exp]
        }
      }
    }
    Dep.target = watcher;
    watcher.update();
    Dep.target = null;
  }

  function defineReactive (obj, key, val) {
    var dep = new Dep();
    Object.defineProperty(obj, key, {
      get: function () {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set: function (newVal) {
        if (newVal === val) return;
        val = newVal;
        console.log('emit change');
        dep.notify();
      }
    })
  }

  function initState (obj) {
    for (var key in obj) {
      defineReactive(obj, key, obj[key])
    }
  }

  function Dep () {
    this.subs = [];
  }

  Dep.target = null;

  Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
  }

  Dep.prototype.notify = function () {
    var subs = this.subs;
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }

  function Vue (options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data;
    initState(this.$data);

    h = h.bind(this);

    var app = options.render.call(this);
    this.mount(app)
  }

  Vue.prototype.mount = function (dom) {
    this.$el.appendChild(dom)
  }

  var vm = new Vue({
    el: '#app',
    data: {
      name: ''
    },
    render: function () {
      return h('div',
        { class: 'wrapper' },
        [
          h('p',
            { class: 'inner', 'v-text': 'name' }
          )
        ]
      )
    }
  })

  // test
  var arr = 'hello world'.split('');
  var id = setInterval(function () {
    if (arr.length === 0) {
      clearInterval(id);
      return;
    }
    vm.$data.name += arr.shift();
  }, 500)

})();