(function() {

  Nimbus.angularService = function() {
    var all_models, makeWatcher, setup;
    all_models = {};
    setup = function(name, attrs, sync_callback) {
      var store;
      store = Nimbus.Model.setup(name, attrs);
      store.sync_all(sync_callback);
      all_models['name'] = store;
      return store;
    };
    makeWatcher = function(name) {
      return function() {
        return localStorage[name];
      };
    };
    return {
      'setup': setup,
      'makeWatcher': makeWatcher
    };
  };

}).call(this);
