(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ngrx/store'), require('rxjs/observable/merge'), require('rxjs/operator/ignoreElements'), require('rxjs/operator/materialize'), require('rxjs/operator/map'), require('@angular/core'), require('rxjs/Observable'), require('rxjs/operator/filter'), require('rxjs/operator/groupBy'), require('rxjs/operator/mergeMap'), require('rxjs/operator/exhaustMap'), require('rxjs/operator/dematerialize'), require('rxjs/Subject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@ngrx/store', 'rxjs/observable/merge', 'rxjs/operator/ignoreElements', 'rxjs/operator/materialize', 'rxjs/operator/map', '@angular/core', 'rxjs/Observable', 'rxjs/operator/filter', 'rxjs/operator/groupBy', 'rxjs/operator/mergeMap', 'rxjs/operator/exhaustMap', 'rxjs/operator/dematerialize', 'rxjs/Subject'], factory) :
	(factory((global.ngrx = global.ngrx || {}, global.ngrx.effects = global.ngrx.effects || {}),global.ngrx.store,global.Rx.Observable,global.Rx.Observable.prototype,global.rxjs_operator_materialize,global.rxjs_operator_map,global.ng.core,global.Rx,global.Rx.Observable.prototype,global.rxjs_operator_groupBy,global.rxjs_operator_mergeMap,global.rxjs_operator_exhaustMap,global.rxjs_operator_dematerialize,global.rxjs_Subject));
}(this, (function (exports,_ngrx_store,rxjs_observable_merge,rxjs_operator_ignoreElements,rxjs_operator_materialize,rxjs_operator_map,_angular_core,rxjs_Observable,rxjs_operator_filter,rxjs_operator_groupBy,rxjs_operator_mergeMap,rxjs_operator_exhaustMap,rxjs_operator_dematerialize,rxjs_Subject) { 'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var METADATA_KEY = '@ngrx/effects';
var r = Reflect;
/**
 * @param {?} sourceType
 * @return {?}
 */
function hasStaticMetadata(sourceType) {
    return !!((sourceType)).propDecorators;
}
/**
 * @param {?} sourceType
 * @return {?}
 */
function getStaticMetadata(sourceType) {
    var /** @type {?} */ propDecorators = sourceType.propDecorators;
    return Object.keys(propDecorators).reduce(function (all, key) { return all.concat(getStaticMetadataEntry(propDecorators[key], key)); }, []);
}
/**
 * @param {?} metadataEntry
 * @param {?} propertyName
 * @return {?}
 */
function getStaticMetadataEntry(metadataEntry, propertyName) {
    return metadataEntry
        .filter(function (entry) { return entry.type === Effect; })
        .map(function (entry) {
        var /** @type {?} */ dispatch = true;
        if (entry.args && entry.args.length) {
            dispatch = !!entry.args[0].dispatch;
        }
        return { propertyName: propertyName, dispatch: dispatch };
    });
}
/**
 * @param {?} sourceProto
 * @return {?}
 */
function getEffectMetadataEntries(sourceProto) {
    if (hasStaticMetadata(sourceProto.constructor)) {
        return getStaticMetadata(sourceProto.constructor);
    }
    if (r.hasOwnMetadata(METADATA_KEY, sourceProto)) {
        return r.getOwnMetadata(METADATA_KEY, sourceProto);
    }
    return [];
}
/**
 * @param {?} sourceProto
 * @param {?} entries
 * @return {?}
 */
function setEffectMetadataEntries(sourceProto, entries) {
    r.defineMetadata(METADATA_KEY, entries, sourceProto);
}
/**
 * \@Annotation
 * @param {?=} __0
 * @return {?}
 */
function Effect(_a) {
    var dispatch = (_a === void 0 ? { dispatch: true } : _a).dispatch;
    return function (target, propertyName) {
        var /** @type {?} */ effects = getEffectMetadataEntries(target);
        var /** @type {?} */ metadata = { propertyName: propertyName, dispatch: dispatch };
        setEffectMetadataEntries(target, effects.concat([metadata]));
    };
}
/**
 * @param {?} instance
 * @return {?}
 */
function getSourceForInstance(instance) {
    return Object.getPrototypeOf(instance);
}
var getSourceMetadata = _ngrx_store.compose(getEffectMetadataEntries, getSourceForInstance);
var onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function isOnRunEffects(sourceInstance) {
    var /** @type {?} */ source = getSourceForInstance(sourceInstance);
    return (onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function');
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function mergeEffects(sourceInstance) {
    var /** @type {?} */ sourceName = getSourceForInstance(sourceInstance).constructor.name;
    var /** @type {?} */ observables = getSourceMetadata(sourceInstance).map(function (_a) {
        var propertyName = _a.propertyName, dispatch = _a.dispatch;
        var /** @type {?} */ observable = typeof sourceInstance[propertyName] === 'function'
            ? sourceInstance[propertyName]()
            : sourceInstance[propertyName];
        if (dispatch === false) {
            return rxjs_operator_ignoreElements.ignoreElements.call(observable);
        }
        var /** @type {?} */ materialized$ = rxjs_operator_materialize.materialize.call(observable);
        return rxjs_operator_map.map.call(materialized$, function (notification) { return ({
            effect: sourceInstance[propertyName],
            notification: notification,
            propertyName: propertyName,
            sourceName: sourceName,
            sourceInstance: sourceInstance,
        }); });
    });
    return rxjs_observable_merge.merge.apply(void 0, observables);
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function resolveEffectSource(sourceInstance) {
    var /** @type {?} */ mergedEffects$ = mergeEffects(sourceInstance);
    if (isOnRunEffects(sourceInstance)) {
        return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }
    return mergedEffects$;
}
var Actions = (function (_super) {
    __extends(Actions, _super);
    /**
     * @param {?=} source
     */
    function Actions(source) {
        var _this = _super.call(this) || this;
        if (source) {
            _this.source = source;
        }
        return _this;
    }
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    Actions.prototype.lift = function (operator) {
        var /** @type {?} */ observable = new Actions();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * @template V2
     * @param {...?} allowedTypes
     * @return {?}
     */
    Actions.prototype.ofType = function () {
        var allowedTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allowedTypes[_i] = arguments[_i];
        }
        return rxjs_operator_filter.filter.call(this, function (action) { return allowedTypes.some(function (type) { return type === action.type; }); });
    };
    return Actions;
}(rxjs_Observable.Observable));
Actions.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
Actions.ctorParameters = function () { return [
    { type: rxjs_Observable.Observable, decorators: [{ type: _angular_core.Inject, args: [_ngrx_store.ScannedActionsSubject,] },] },
]; };
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
function verifyOutput(output, reporter) {
    reportErrorThrown(output, reporter);
    reportInvalidActions(output, reporter);
}
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
function reportErrorThrown(output, reporter) {
    if (output.notification.kind === 'E') {
        var /** @type {?} */ errorReason = "Effect " + getEffectName(output) + " threw an error";
        reporter.report(errorReason, {
            Source: output.sourceInstance,
            Effect: output.effect,
            Error: output.notification.error,
            Notification: output.notification,
        });
    }
}
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
function reportInvalidActions(output, reporter) {
    if (output.notification.kind === 'N') {
        var /** @type {?} */ action = output.notification.value;
        var /** @type {?} */ isInvalidAction = !isAction(action);
        if (isInvalidAction) {
            var /** @type {?} */ errorReason = "Effect " + getEffectName(output) + " dispatched an invalid action";
            reporter.report(errorReason, {
                Source: output.sourceInstance,
                Effect: output.effect,
                Dispatched: action,
                Notification: output.notification,
            });
        }
    }
}
/**
 * @param {?} action
 * @return {?}
 */
function isAction(action) {
    return action && action.type && typeof action.type === 'string';
}
/**
 * @param {?} __0
 * @return {?}
 */
function getEffectName(_a) {
    var propertyName = _a.propertyName, sourceInstance = _a.sourceInstance, sourceName = _a.sourceName;
    var /** @type {?} */ isMethod = typeof sourceInstance[propertyName] === 'function';
    return "\"" + sourceName + "." + propertyName + (isMethod ? '()' : '') + "\"";
}
var IMMEDIATE_EFFECTS = new _angular_core.InjectionToken('ngrx/effects: Immediate Effects');
var ROOT_EFFECTS = new _angular_core.InjectionToken('ngrx/effects: Root Effects');
var FEATURE_EFFECTS = new _angular_core.InjectionToken('ngrx/effects: Feature Effects');
var CONSOLE = new _angular_core.InjectionToken('Browser Console');
var ErrorReporter = (function () {
    /**
     * @param {?} console
     */
    function ErrorReporter(console) {
        this.console = console;
    }
    /**
     * @param {?} reason
     * @param {?} details
     * @return {?}
     */
    ErrorReporter.prototype.report = function (reason, details) {
        this.console.group(reason);
        for (var /** @type {?} */ key in details) {
            this.console.error(key + ":", details[key]);
        }
        this.console.groupEnd();
    };
    return ErrorReporter;
}());
ErrorReporter.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
ErrorReporter.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [CONSOLE,] },] },
]; };
var EffectSources = (function (_super) {
    __extends(EffectSources, _super);
    /**
     * @param {?} errorReporter
     */
    function EffectSources(errorReporter) {
        var _this = _super.call(this) || this;
        _this.errorReporter = errorReporter;
        return _this;
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    EffectSources.prototype.addEffects = function (effectSourceInstance) {
        this.next(effectSourceInstance);
    };
    /**
     * @return {?}
     */
    EffectSources.prototype.toActions = function () {
        var _this = this;
        return rxjs_operator_mergeMap.mergeMap.call(rxjs_operator_groupBy.groupBy.call(this, getSourceForInstance), function (source$) { return rxjs_operator_dematerialize.dematerialize.call(rxjs_operator_filter.filter.call(rxjs_operator_map.map.call(rxjs_operator_exhaustMap.exhaustMap.call(source$, resolveEffectSource), function (output) {
            verifyOutput(output, _this.errorReporter);
            return output.notification;
        }), function (notification) { return notification.kind === 'N'; })); });
    };
    return EffectSources;
}(rxjs_Subject.Subject));
EffectSources.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
EffectSources.ctorParameters = function () { return [
    { type: ErrorReporter, },
]; };
var EffectsRunner = (function () {
    /**
     * @param {?} effectSources
     * @param {?} store
     */
    function EffectsRunner(effectSources, store) {
        this.effectSources = effectSources;
        this.store = store;
        this.effectsSubscription = null;
    }
    /**
     * @return {?}
     */
    EffectsRunner.prototype.start = function () {
        if (!this.effectsSubscription) {
            this.effectsSubscription = this.effectSources
                .toActions()
                .subscribe(this.store);
        }
    };
    /**
     * @return {?}
     */
    EffectsRunner.prototype.ngOnDestroy = function () {
        if (this.effectsSubscription) {
            this.effectsSubscription.unsubscribe();
            this.effectsSubscription = null;
        }
    };
    return EffectsRunner;
}());
EffectsRunner.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
EffectsRunner.ctorParameters = function () { return [
    { type: EffectSources, },
    { type: _ngrx_store.Store, },
]; };
var EffectsRootModule = (function () {
    /**
     * @param {?} sources
     * @param {?} runner
     * @param {?} rootEffects
     * @param {?} storeModule
     */
    function EffectsRootModule(sources, runner, rootEffects, storeModule) {
        this.sources = sources;
        runner.start();
        rootEffects.forEach(function (effectSourceInstance) { return sources.addEffects(effectSourceInstance); });
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    EffectsRootModule.prototype.addEffects = function (effectSourceInstance) {
        this.sources.addEffects(effectSourceInstance);
    };
    return EffectsRootModule;
}());
EffectsRootModule.decorators = [
    { type: _angular_core.NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsRootModule.ctorParameters = function () { return [
    { type: EffectSources, },
    { type: EffectsRunner, },
    { type: Array, decorators: [{ type: _angular_core.Inject, args: [ROOT_EFFECTS,] },] },
    { type: _ngrx_store.StoreModule, decorators: [{ type: _angular_core.Optional },] },
]; };
var EffectsFeatureModule = (function () {
    /**
     * @param {?} root
     * @param {?} effectSourceGroups
     * @param {?} storeModule
     */
    function EffectsFeatureModule(root, effectSourceGroups, storeModule) {
        this.root = root;
        effectSourceGroups.forEach(function (group) { return group.forEach(function (effectSourceInstance) { return root.addEffects(effectSourceInstance); }); });
    }
    return EffectsFeatureModule;
}());
EffectsFeatureModule.decorators = [
    { type: _angular_core.NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsFeatureModule.ctorParameters = function () { return [
    { type: EffectsRootModule, },
    { type: Array, decorators: [{ type: _angular_core.Inject, args: [FEATURE_EFFECTS,] },] },
    { type: _ngrx_store.StoreModule, decorators: [{ type: _angular_core.Optional },] },
]; };
var EffectsModule = (function () {
    function EffectsModule() {
    }
    /**
     * @param {?} featureEffects
     * @return {?}
     */
    EffectsModule.forFeature = function (featureEffects) {
        return {
            ngModule: EffectsFeatureModule,
            providers: [
                featureEffects,
                {
                    provide: FEATURE_EFFECTS,
                    multi: true,
                    deps: featureEffects,
                    useFactory: createSourceInstances,
                },
            ],
        };
    };
    /**
     * @param {?} rootEffects
     * @return {?}
     */
    EffectsModule.forRoot = function (rootEffects) {
        return {
            ngModule: EffectsRootModule,
            providers: [
                EffectsRunner,
                EffectSources,
                ErrorReporter,
                Actions,
                rootEffects,
                {
                    provide: ROOT_EFFECTS,
                    deps: rootEffects,
                    useFactory: createSourceInstances,
                },
                {
                    provide: CONSOLE,
                    useFactory: getConsole,
                },
            ],
        };
    };
    return EffectsModule;
}());
EffectsModule.decorators = [
    { type: _angular_core.NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsModule.ctorParameters = function () { return []; };
/**
 * @param {...?} instances
 * @return {?}
 */
function createSourceInstances() {
    var instances = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        instances[_i] = arguments[_i];
    }
    return instances;
}
/**
 * @return {?}
 */
function getConsole() {
    return console;
}
/**
 * @deprecated Since version 4.1. Will be deleted in version 5.0.
 * @param {?} action
 * @return {?}
 */
function toPayload(action) {
    return ((action)).payload;
}

exports.Effect = Effect;
exports.mergeEffects = mergeEffects;
exports.Actions = Actions;
exports.EffectsModule = EffectsModule;
exports.EffectSources = EffectSources;
exports.toPayload = toPayload;
exports.ɵc = EffectsFeatureModule;
exports.ɵa = createSourceInstances;
exports.ɵb = getConsole;
exports.ɵg = EffectsRootModule;
exports.ɵi = EffectsRunner;
exports.ɵh = ErrorReporter;
exports.ɵf = CONSOLE;
exports.ɵe = FEATURE_EFFECTS;
exports.ɵd = ROOT_EFFECTS;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=effects.umd.js.map
