// Generated by CoffeeScript 1.3.3
(function() {
  var Highlight, auto_detect_option, highlightNewMessages;

  window.bayes = new classifier.Bayesian();

  if (this['classifier_info']) {
    bayes.fromJSON(classifier_info);
  }

  auto_detect_option = false;

  GTalkSyntax.auto_detect_option(function(value) {
    return auto_detect_option = value;
  });

  Highlight = (function() {

    function Highlight() {}

    Highlight.prototype.highlighted_text = function() {
      var text;
      text = $('<div/>').html(this.data('original_html').replace(/<br>/g, "\n")).text();
      text = hljs.highlightAuto(text).value.replace(/\n/g, '<br>');
      return "<pre style='overflow-x: auto;'><code style='overflow-x: auto;'>" + text + "</code></pre>";
    };

    Highlight.prototype.baysian_data = function() {
      return this.text().split(' ');
    };

    Highlight.prototype.setDisplay = function(category) {
      var original_html;
      if (category === 'text') {
        original_html = this.data('original_html');
        original_html = original_html.replace(/`(.+?)`/g, function(match, text, urlId) {
          return " <pre style='overflow-x: auto; display: inline-block;'><code>" + text + "</code></pre> ";
        });
        this.html(original_html);
      } else if (category === 'code') {
        this.html(this.highlighted_text());
      }
      this.add_hud();
      return this.find(".GTalkSyntax-" + category).addClass('current');
    };

    Highlight.prototype.setCategory = function(category) {
      this.setDisplay(category);
      bayes.train(this.baysian_data(), category);
      if (GTalkSyntax.host) {
        console.log('training', GTalkSyntax.url('/classifiers/1/train'));
        return $.post(GTalkSyntax.url('/classifiers/1/train'), {
          cat: category,
          doc: this.baysian_data()
        });
      }
    };

    Highlight.prototype.guess = function() {
      var original_text;
      original_text = this.text();
      if (auto_detect_option === false || original_text.indexOf('`') !== -1) {
        return this.setDisplay('text');
      } else {
        return this.setDisplay(bayes.classify(original_text));
      }
    };

    Highlight.prototype.add_hud = function() {
      var _this = this;
      this.append("      <div class='GTalkSyntax-HUD'>        <span class='GTalkSyntax-text'>text</span> |        <span class='GTalkSyntax-code'>code</span>        <span class='GTalkSyntax-caret'>          <b></b>        </span>        <ul class='dropdown-menu'>          <li class='GTalkSyntax-copy'>            Copy Code          </li>          <li class='GTalkSyntax-share'>            Share Plugin          </li>        </ul>     </div>      ");
      this.code_button().click(function() {
        _this.setCategory('code');
        return GTalkSyntax.track('click', 'code');
      });
      this.text_button().click(function() {
        _this.setCategory('text');
        return GTalkSyntax.track('click', 'text');
      });
      this.find(".GTalkSyntax-caret").click(function(e) {
        _this.dropdown().toggle();
        return GTalkSyntax.track('toggle', 'dropdown');
      });
      this.share_link().click(function(e) {
        _this.text_area().concat(' https://chrome.google.com/webstore/detail/gtalk-syntax-highlighting/okpdnaeoefggpaccmolhoaiffmmdoool ');
        return GTalkSyntax.track('click', 'share plugin');
      });
      return this.copy_link().click(function(e) {
        GTalkSyntax.track('click', 'copy contents');
        return chrome.extension.sendMessage({
          command: "copy",
          content: $("<span>" + (_this.data('original_html')) + "</span>").text()
        }, function(response) {
          return console.log('Message Response', response);
        });
      });
    };

    Highlight.prototype.hud = function() {
      return this.find(".GTalkSyntax-HUD:first");
    };

    Highlight.prototype.menu = function() {
      return this.find('ul.dropdown-menu');
    };

    Highlight.prototype.share_link = function() {
      return this.find(".GTalkSyntax-share");
    };

    Highlight.prototype.copy_link = function() {
      return this.find(".GTalkSyntax-copy");
    };

    Highlight.prototype.dropdown = function() {
      return this.find(".dropdown-menu");
    };

    Highlight.prototype.text_area = function() {
      return this.closest('[role=dialog]').find('textarea:first');
    };

    Highlight.prototype.code_button = function() {
      return this.find(".GTalkSyntax-code");
    };

    Highlight.prototype.text_button = function() {
      return this.find(".GTalkSyntax-text");
    };

    return Highlight;

  })();

  $.fn.highlight = function() {
    return this.each(function(index, element) {
      var el, key, value, _ref;
      el = $(element);
      _ref = Highlight.prototype;
      for (key in _ref) {
        value = _ref[key];
        el[key] = value;
      }
      el.css({
        position: 'relative'
      }).data({
        original_html: el.html()
      }).guess();
      el.on('mouseenter', function(e) {
        return el.hud().show();
      });
      return el.on('mouseleave', function(e) {
        return el.hud().hide();
      });
    });
  };

  highlightNewMessages = function() {
    $('[role=log] .kl, [role=log] .kk [id]').filter(function() {
      return $(this).find('.GTalkSyntax-HUD').length < 1;
    }).highlight();
    return setTimeout(highlightNewMessages, 150);
  };

  setTimeout(highlightNewMessages, 1000);

  console.log('Loaded gTalk Highlighter');

}).call(this);
