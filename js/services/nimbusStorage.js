(function() {

  Nimbus.angularService = function() {
    return function(name, attrs, sync_callback) {
      var store;
      store = Nimbus.Model.setup(name, attrs);
      store.sync_all(sync_callback);
      return store;
    };
  };

}).call(this);
