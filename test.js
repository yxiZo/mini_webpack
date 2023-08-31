(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // amd 规范
      console.log('是AMD模块规范，如require.js')
      define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      console.log('是commonjs模块规范，nodejs环境')
      module.exports = factory();
    } else {
      root.mathLibrary = factory();
    }
  }(typeof self !== 'undefined' ? self : this, function () {
    // 实际的库代码
    function add(a, b) {
      return a + b;
    }
  
    return {
      add: add
    };
  }));