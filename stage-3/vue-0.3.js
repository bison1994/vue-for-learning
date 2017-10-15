/**
 * make some change to data
 * then diff the previous vnode tree and the current vnode tree
 * finally patch those diff to real dom
 */

;(function () {
  /**
   * tag { String }
   * attr { Object }
   * children { Array } real dom nodes
   * text { String }
   */
  function vnode (tag, attr, children, text) {
    this.tag = tag;
    this.attr = attr;
    this.children = children;
    this.text = text;
  }

  function h (tag, attr, children, text) {
    return new vnode(tag, attr, children, text);
  }

  function createElement (vnode) {
    var el;
    var tag = vnode.tag;
    var text = vnode.text;
    var attr = vnode.attr;
    var children = vnode.children;
    
    if (tag) {
      el = document.createElement(tag)
    } else if (typeof text === 'string') {
      return document.createTextNode(text)
    }

    if (attr) {
      for (var key in attr) {
        el.setAttribute(key, attr[key])
      }
    }

    if (children) {
      for (var i = 0; i < children.length; i++) {
        var child = createElement(children[i]);
        el.appendChild(child)
      }
    }

    return el
  }

  function diff (oldNode, newNode, el) {
    var parent = el;
    if (newNode.text !== oldNode.text) {
      patch({
        type: 'updateText',
        node: newNode
      }, parent)
    }

    var children = newNode.children;
    var oldchildren = oldNode.children;
    if (children) {
      for (var i = 0; i < children.length; i++) {
        diff(oldchildren[i], children[i], parent.childNodes[i])
      }
    }
  }

  function patch (patch, parent) {
    switch (patch.type) {
      case 'updateText':
        parent.textContent = patch.node.text;
        break;
    }
  }

  function Vue (options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data;
    this.$render = options.render;
    this._vnode = this.$render();
    var app = createElement(this._vnode);
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
            { class: 'inner' },
            [
              h(undefined, undefined, undefined, this.$data.name)
            ]
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
    var oldNode = vm._vnode;
    vm.$data.name += arr.shift();
    var newNode = vm.$render();
    vm._vnode = newNode;
    diff(oldNode, newNode, vm.$el)
  }, 500)

})();