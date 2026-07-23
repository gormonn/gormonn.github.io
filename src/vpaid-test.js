/**
 * Simple HTML-poll VPAID 2.0 creative — pizza taste survey with a
 * promo-code claim button at the end. Built for the sandbox harness
 * alongside test-creative.js (protocol fixture) and game-creative.js
 * (canvas game demo); this one is DOM/HTML instead of canvas.
 *
 * Click-through URL override via the creative's own script URL:
 * ?clickUrl=<url> (defaults to https://example.com/pizza-promo).
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var src = (script && script.src) || '';
  var clickUrlMatch = /[?&]clickUrl=([^&]+)/.exec(src);
  var CLICK_URL = clickUrlMatch
    ? decodeURIComponent(clickUrlMatch[1])
    : 'https://example.com/pizza-promo';

  var PROMO_CODE = 'PIZZA20';
  var RESULT_HOLD_MS = 2000;
  // How long the viewer must wait before the skip control becomes usable.
  // Not read from VAST skipoffset on purpose — VPAID creatives own their
  // own adSkippableState (see getAdSkippableState()), independently of any
  // host-side skip timer.
  var SKIPPABLE_AFTER_MS = 5000;
  // VPAID 2.0 spec, 3.2.6/3.2.7: -2 means "unknown", which the spec calls
  // out as the typical value once a user is actively engaged with the ad.
  // This creative is a poll from the very first frame — there is no
  // non-interactive segment with a real fixed length, so duration is
  // unknown for the entire ad lifetime, not just after the poll is
  // submitted.
  var DURATION_UNKNOWN = -2;

  var QUESTIONS = [
    {
      name: 'topping',
      question: 'Любимая начинка?',
      options: ['Пепперони', 'Маргарита', 'Гавайская', 'Четыре сыра'],
    },
    {
      name: 'crust',
      question: 'Какое тесто предпочитаешь?',
      options: ['Тонкое', 'Толстое', 'Не важно'],
    },
  ];

  function PizzaPollCreative() {
    this._listeners = {};
    this._root = null;
    this._pollScreen = null;
    this._promoScreen = null;
    this._submitBtn = null;
    this._claimBtn = null;
    this._width = 0;
    this._height = 0;
    this._skippable = false;
    this._finished = false;
    this._finishTimeoutId = null;
    this._skippableTimeoutId = null;
  }

  PizzaPollCreative.prototype._emit = function (name, args) {
    (this._listeners[name] || []).forEach(function (entry) {
      entry.fn.apply(entry.ctx || null, args || []);
    });
  };

  PizzaPollCreative.prototype.handshakeVersion = function () {
    return '2.0';
  };

  PizzaPollCreative.prototype._renderPoll = function () {
    var screen = document.createElement('div');
    screen.style.cssText =
      'display:flex;flex-direction:column;gap:12px;' +
      'max-width:280px;width:100%;';

    QUESTIONS.forEach(function (q) {
      var block = document.createElement('div');

      var title = document.createElement('div');
      title.textContent = q.question;
      title.style.cssText = 'font-weight:bold;margin-bottom:6px;';
      block.appendChild(title);

      q.options.forEach(function (option) {
        var label = document.createElement('label');
        label.style.cssText =
          'display:flex;align-items:center;gap:6px;' +
          'padding:2px 0;cursor:pointer;';

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = q.name;
        radio.value = option;
        radio.dataset.question = q.name;

        var text = document.createElement('span');
        text.textContent = option;

        label.appendChild(radio);
        label.appendChild(text);
        block.appendChild(label);
      });

      screen.appendChild(block);
    });

    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.textContent = 'Готово';
    submitBtn.disabled = true;
    submitBtn.style.cssText =
      'margin-top:8px;padding:10px;border:none;border-radius:6px;' +
      'background:#999;color:#fff;font:bold 14px sans-serif;' +
      'cursor:not-allowed;';
    screen.appendChild(submitBtn);

    this._submitBtn = submitBtn;
    this._pollScreen = screen;
    return screen;
  };

  PizzaPollCreative.prototype._renderPromo = function () {
    var screen = document.createElement('div');
    screen.style.cssText =
      'display:none;flex-direction:column;align-items:center;' +
      'gap:12px;text-align:center;';

    var thanks = document.createElement('div');
    thanks.textContent = 'Спасибо за участие!';
    thanks.style.cssText = 'font:bold 16px sans-serif;';
    screen.appendChild(thanks);

    var claimBtn = document.createElement('button');
    claimBtn.type = 'button';
    claimBtn.textContent = 'Забрать промокод на пиццу';
    claimBtn.style.cssText =
      'padding:12px 16px;border:none;border-radius:6px;' +
      'background:#ffd400;color:#111;font:bold 14px sans-serif;' +
      'cursor:pointer;';
    screen.appendChild(claimBtn);

    var codeLine = document.createElement('div');
    codeLine.style.cssText =
      'display:none;font:bold 18px monospace;color:#0a0;';
    codeLine.textContent = PROMO_CODE;
    screen.appendChild(codeLine);

    this._claimBtn = claimBtn;
    this._promoScreen = screen;
    this._codeLine = codeLine;
    return screen;
  };

  PizzaPollCreative.prototype._allAnswered = function () {
    return QUESTIONS.every(
      function (q) {
        return !!this._root.querySelector(
          'input[name="' + q.name + '"]:checked',
        );
      }.bind(this),
    );
  };

  PizzaPollCreative.prototype._handlePollChange = function () {
    var enabled = this._allAnswered();
    this._submitBtn.disabled = !enabled;
    this._submitBtn.style.cssText =
      'margin-top:8px;padding:10px;border:none;border-radius:6px;' +
      'font:bold 14px sans-serif;' +
      (enabled
        ? 'background:#ffd400;color:#111;cursor:pointer;'
        : 'background:#999;color:#fff;cursor:not-allowed;');
  };

  PizzaPollCreative.prototype._handleSubmit = function () {
    if (this._submitBtn.disabled) {
      return;
    }

    this._pollScreen.style.display = 'none';
    this._promoScreen.style.display = 'flex';
  };

  PizzaPollCreative.prototype._handleClaim = function () {
    this._claimBtn.disabled = true;
    this._claimBtn.style.cursor = 'default';
    this._codeLine.style.display = 'block';
    this._emit('AdClickThru', [CLICK_URL, 'pizza-poll-promo', true]);

    this._finishTimeoutId = setTimeout(
      function () {
        this._finish();
      }.bind(this),
      RESULT_HOLD_MS,
    );
  };

  PizzaPollCreative.prototype._finish = function () {
    if (this._finished) {
      return;
    }

    this._finished = true;

    if (this._skippableTimeoutId !== null) {
      clearTimeout(this._skippableTimeoutId);
      this._skippableTimeoutId = null;
    }

    this._emit('AdVideoComplete', []);
  };

  PizzaPollCreative.prototype.initAd = function (
    width,
    height,
    viewMode,
    desiredBitrate,
    creativeData,
    environmentVars,
  ) {
    this._width = width;
    this._height = height;

    this._root = document.createElement('div');
    this._root.style.cssText =
      'position:absolute;inset:0;display:flex;align-items:center;' +
      'justify-content:center;background:#333;color:#fff;' +
      'font:14px sans-serif;box-sizing:border-box;padding:16px;' +
      'overflow:auto;';

    this._root.appendChild(this._renderPoll());
    this._root.appendChild(this._renderPromo());

    this._root.addEventListener(
      'change',
      function (event) {
        if (event.target && event.target.dataset.question) {
          this._handlePollChange();
        }
      }.bind(this),
    );
    this._submitBtn.addEventListener(
      'click',
      function () {
        this._handleSubmit();
      }.bind(this),
    );
    this._claimBtn.addEventListener(
      'click',
      function () {
        this._handleClaim();
      }.bind(this),
    );

    environmentVars.slot.appendChild(this._root);
    this._emit('AdLoaded', []);
  };

  PizzaPollCreative.prototype.startAd = function () {
    this._emit('AdStarted', []);
    this._emit('AdVideoStart', []);
    this._emit('AdImpression', []);
    this._emit('AdSkippableStateChange', []);

    this._skippableTimeoutId = setTimeout(
      function () {
        this._skippableTimeoutId = null;
        this._skippable = true;
        this._emit('AdSkippableStateChange', []);
      }.bind(this),
      SKIPPABLE_AFTER_MS,
    );
  };

  PizzaPollCreative.prototype.stopAd = function () {
    if (this._finishTimeoutId !== null) {
      clearTimeout(this._finishTimeoutId);
      this._finishTimeoutId = null;
    }

    if (this._skippableTimeoutId !== null) {
      clearTimeout(this._skippableTimeoutId);
      this._skippableTimeoutId = null;
    }

    this._emit('AdStopped', []);
  };

  PizzaPollCreative.prototype.skipAd = function () {
    if (this._finishTimeoutId !== null) {
      clearTimeout(this._finishTimeoutId);
      this._finishTimeoutId = null;
    }

    if (this._skippableTimeoutId !== null) {
      clearTimeout(this._skippableTimeoutId);
      this._skippableTimeoutId = null;
    }

    this._emit('AdSkipped', []);
  };

  PizzaPollCreative.prototype.pauseAd = function () {
    this._emit('AdPaused', []);
  };

  PizzaPollCreative.prototype.resumeAd = function () {
    this._emit('AdPlaying', []);
  };

  PizzaPollCreative.prototype.expandAd = function () {};

  PizzaPollCreative.prototype.collapseAd = function () {};

  PizzaPollCreative.prototype.resizeAd = function (width, height) {
    this._width = width;
    this._height = height;
    this._emit('AdSizeChange', []);
  };

  PizzaPollCreative.prototype.setAdVolume = function () {
    this._emit('AdVolumeChange', []);
  };

  PizzaPollCreative.prototype.getAdVolume = function () {
    return 1;
  };

  PizzaPollCreative.prototype.getAdDuration = function () {
    return DURATION_UNKNOWN;
  };

  PizzaPollCreative.prototype.getAdRemainingTime = function () {
    return DURATION_UNKNOWN;
  };

  PizzaPollCreative.prototype.getAdLinear = function () {
    return true;
  };

  PizzaPollCreative.prototype.getAdExpanded = function () {
    return false;
  };

  PizzaPollCreative.prototype.getAdSkippableState = function () {
    return this._skippable;
  };

  PizzaPollCreative.prototype.getAdWidth = function () {
    return this._width;
  };

  PizzaPollCreative.prototype.getAdHeight = function () {
    return this._height;
  };

  PizzaPollCreative.prototype.getAdCompanions = function () {
    return '';
  };

  PizzaPollCreative.prototype.getAdIcons = function () {
    return false;
  };

  PizzaPollCreative.prototype.subscribe = function (fn, event, ctx) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push({ fn: fn, ctx: ctx });
  };

  PizzaPollCreative.prototype.unsubscribe = function (fn, event) {
    this._listeners[event] = (this._listeners[event] || []).filter(
      function (entry) {
        return entry.fn !== fn;
      },
    );
  };

  window.getVPAIDAd = function () {
    return new PizzaPollCreative();
  };
})();
