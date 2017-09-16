(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ngrx/effects'), require('rxjs/observable/defer')) :
	typeof define === 'function' && define.amd ? define(['exports', '@ngrx/effects', 'rxjs/observable/defer'], factory) :
	(factory((global.ngrx = global.ngrx || {}, global.ngrx.effects = global.ngrx.effects || {}, global.ngrx.effects.testing = global.ngrx.effects.testing || {}),global.ngrx.effects,global.Rx.Observable.defer));
}(this, (function (exports,_ngrx_effects,rxjs_observable_defer) { 'use strict';

function provideMockActions(factoryOrSource) {
    return {
        provide: _ngrx_effects.Actions,
        useFactory: function () {
            if (typeof factoryOrSource === 'function') {
                return new _ngrx_effects.Actions(rxjs_observable_defer.defer(factoryOrSource));
            }
            return new _ngrx_effects.Actions(factoryOrSource);
        },
    };
}

exports.provideMockActions = provideMockActions;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=effects-testing.umd.js.map
