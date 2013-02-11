// Generated by CoffeeScript 1.3.3
(function() {

  window.GTalkSyntax = (function() {

    function GTalkSyntax() {}

    GTalkSyntax.published = false;

    GTalkSyntax.host = null;

    GTalkSyntax.refresh_host = function() {
      var _this = this;
      return chrome.storage.sync.get('data_collection_option', function(items) {
        console.log('refresh host2', _this, arguments);
        return _this.host = (function() {
          switch (items.data_collection_option) {
            case 'on':
              return 'http://gtalksyntax.herokuapp.com';
            case 'off':
              return null;
            default:
              return items.data_collection_option;
          }
        })();
      });
    };

    GTalkSyntax.url = function(path) {
      if (!this.host) {
        throw "Highlight: data collection disabled, no host set";
      }
      return "" + this.host + "/" + (path.replace(/^\//, ''));
    };

    GTalkSyntax.attr_accessor = function(name, attr_default) {
      return this[name] = function(value, callback) {
        var options;
        if (_.isFunction(value) && !callback) {
          callback = value;
          value = void 0;
        }
        if (value !== void 0) {
          options = {};
          options[name] = value;
          return chrome.storage.sync.set(options, function() {
            return callback(this.args[1][name]);
          });
        } else {
          return chrome.storage.sync.get(name, function(items) {
            return callback(items[name] || attr_default);
          });
        }
      };
    };

    GTalkSyntax.track = function(verb, noun) {
      if (this.published) {
        return _gaq.push(['_trackEvent', noun, verb]);
      } else {
        return console.log("Faux tracking " + verb + " " + noun);
      }
    };

    GTalkSyntax.attr_accessor('data_collection_option', 'off');

    GTalkSyntax.attr_accessor('auto_detect_option', false);

    GTalkSyntax.refresh_host();

    return GTalkSyntax;

  })();

}).call(this);
