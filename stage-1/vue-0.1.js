/**
 * apply virtual dom to real dom
 */

;(function () {
  /**
   * tag { String }
   * attr { Object }
   * children { Array }
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

  function mount (selector, dom) {
    document.querySelector(selector).appendChild(dom)
  }

  var app = h('div',
              { class: 'wrapper' },
              [
                h('p',
                  { class: 'inner' },
                  [
                    h(undefined, undefined, undefined, 'hello world')
                  ]
                )
              ]
            )

  mount('#app', createElement(app))

})();
