import { ScannedActionsSubject, Store, StoreModule, compose } from '@ngrx/store';
import { merge } from 'rxjs/observable/merge';
import { ignoreElements } from 'rxjs/operator/ignoreElements';
import { materialize } from 'rxjs/operator/materialize';
import { map } from 'rxjs/operator/map';
import { Inject, Injectable, InjectionToken, NgModule, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operator/filter';
import { groupBy } from 'rxjs/operator/groupBy';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { exhaustMap } from 'rxjs/operator/exhaustMap';
import { dematerialize } from 'rxjs/operator/dematerialize';
import { Subject } from 'rxjs/Subject';

const METADATA_KEY = '@ngrx/effects';
const r = Reflect;
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
    const /** @type {?} */ propDecorators = sourceType.propDecorators;
    return Object.keys(propDecorators).reduce((all, key) => all.concat(getStaticMetadataEntry(propDecorators[key], key)), []);
}
/**
 * @param {?} metadataEntry
 * @param {?} propertyName
 * @return {?}
 */
function getStaticMetadataEntry(metadataEntry, propertyName) {
    return metadataEntry
        .filter((entry) => entry.type === Effect)
        .map((entry) => {
        let /** @type {?} */ dispatch = true;
        if (entry.args && entry.args.length) {
            dispatch = !!entry.args[0].dispatch;
        }
        return { propertyName, dispatch };
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
function Effect({ dispatch } = { dispatch: true }) {
    return function (target, propertyName) {
        const /** @type {?} */ effects = getEffectMetadataEntries(target);
        const /** @type {?} */ metadata = { propertyName, dispatch };
        setEffectMetadataEntries(target, [...effects, metadata]);
    };
}
/**
 * @param {?} instance
 * @return {?}
 */
function getSourceForInstance(instance) {
    return Object.getPrototypeOf(instance);
}
const getSourceMetadata = compose(getEffectMetadataEntries, getSourceForInstance);

const onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function isOnRunEffects(sourceInstance) {
    const /** @type {?} */ source = getSourceForInstance(sourceInstance);
    return (onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function');
}

/**
 * @param {?} sourceInstance
 * @return {?}
 */
function mergeEffects(sourceInstance) {
    const /** @type {?} */ sourceName = getSourceForInstance(sourceInstance).constructor.name;
    const /** @type {?} */ observables = getSourceMetadata(sourceInstance).map(({ propertyName, dispatch }) => {
        const /** @type {?} */ observable = typeof sourceInstance[propertyName] === 'function'
            ? sourceInstance[propertyName]()
            : sourceInstance[propertyName];
        if (dispatch === false) {
            return ignoreElements.call(observable);
        }
        const /** @type {?} */ materialized$ = materialize.call(observable);
        return map.call(materialized$, (notification) => ({
            effect: sourceInstance[propertyName],
            notification,
            propertyName,
            sourceName,
            sourceInstance,
        }));
    });
    return merge(...observables);
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function resolveEffectSource(sourceInstance) {
    const /** @type {?} */ mergedEffects$ = mergeEffects(sourceInstance);
    if (isOnRunEffects(sourceInstance)) {
        return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }
    return mergedEffects$;
}

class Actions extends Observable {
    /**
     * @param {?=} source
     */
    constructor(source) {
        super();
        if (source) {
            this.source = source;
        }
    }
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    lift(operator) {
        const /** @type {?} */ observable = new Actions();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    /**
     * @template V2
     * @param {...?} allowedTypes
     * @return {?}
     */
    ofType(...allowedTypes) {
        return filter.call(this, (action) => allowedTypes.some(type => type === action.type));
    }
}
Actions.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Actions.ctorParameters = () => [
    { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] },] },
];

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
        const /** @type {?} */ errorReason = `Effect ${getEffectName(output)} threw an error`;
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
        const /** @type {?} */ action = output.notification.value;
        const /** @type {?} */ isInvalidAction = !isAction(action);
        if (isInvalidAction) {
            const /** @type {?} */ errorReason = `Effect ${getEffectName(output)} dispatched an invalid action`;
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
function getEffectName({ propertyName, sourceInstance, sourceName, }) {
    const /** @type {?} */ isMethod = typeof sourceInstance[propertyName] === 'function';
    return `"${sourceName}.${propertyName}${isMethod ? '()' : ''}"`;
}

const IMMEDIATE_EFFECTS = new InjectionToken('ngrx/effects: Immediate Effects');
const ROOT_EFFECTS = new InjectionToken('ngrx/effects: Root Effects');
const FEATURE_EFFECTS = new InjectionToken('ngrx/effects: Feature Effects');
const CONSOLE = new InjectionToken('Browser Console');

class ErrorReporter {
    /**
     * @param {?} console
     */
    constructor(console) {
        this.console = console;
    }
    /**
     * @param {?} reason
     * @param {?} details
     * @return {?}
     */
    report(reason, details) {
        this.console.group(reason);
        for (let /** @type {?} */ key in details) {
            this.console.error(`${key}:`, details[key]);
        }
        this.console.groupEnd();
    }
}
ErrorReporter.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ErrorReporter.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONSOLE,] },] },
];

class EffectSources extends Subject {
    /**
     * @param {?} errorReporter
     */
    constructor(errorReporter) {
        super();
        this.errorReporter = errorReporter;
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.next(effectSourceInstance);
    }
    /**
     * @return {?}
     */
    toActions() {
        return mergeMap.call(groupBy.call(this, getSourceForInstance), (source$) => dematerialize.call(filter.call(map.call(exhaustMap.call(source$, resolveEffectSource), (output) => {
            verifyOutput(output, this.errorReporter);
            return output.notification;
        }), (notification) => notification.kind === 'N')));
    }
}
EffectSources.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
EffectSources.ctorParameters = () => [
    { type: ErrorReporter, },
];

class EffectsRunner {
    /**
     * @param {?} effectSources
     * @param {?} store
     */
    constructor(effectSources, store) {
        this.effectSources = effectSources;
        this.store = store;
        this.effectsSubscription = null;
    }
    /**
     * @return {?}
     */
    start() {
        if (!this.effectsSubscription) {
            this.effectsSubscription = this.effectSources
                .toActions()
                .subscribe(this.store);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.effectsSubscription) {
            this.effectsSubscription.unsubscribe();
            this.effectsSubscription = null;
        }
    }
}
EffectsRunner.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
EffectsRunner.ctorParameters = () => [
    { type: EffectSources, },
    { type: Store, },
];

class EffectsRootModule {
    /**
     * @param {?} sources
     * @param {?} runner
     * @param {?} rootEffects
     * @param {?} storeModule
     */
    constructor(sources, runner, rootEffects, storeModule) {
        this.sources = sources;
        runner.start();
        rootEffects.forEach(effectSourceInstance => sources.addEffects(effectSourceInstance));
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.sources.addEffects(effectSourceInstance);
    }
}
EffectsRootModule.decorators = [
    { type: NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsRootModule.ctorParameters = () => [
    { type: EffectSources, },
    { type: EffectsRunner, },
    { type: Array, decorators: [{ type: Inject, args: [ROOT_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
];

class EffectsFeatureModule {
    /**
     * @param {?} root
     * @param {?} effectSourceGroups
     * @param {?} storeModule
     */
    constructor(root, effectSourceGroups, storeModule) {
        this.root = root;
        effectSourceGroups.forEach(group => group.forEach(effectSourceInstance => root.addEffects(effectSourceInstance)));
    }
}
EffectsFeatureModule.decorators = [
    { type: NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsFeatureModule.ctorParameters = () => [
    { type: EffectsRootModule, },
    { type: Array, decorators: [{ type: Inject, args: [FEATURE_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
];

class EffectsModule {
    /**
     * @param {?} featureEffects
     * @return {?}
     */
    static forFeature(featureEffects) {
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
    }
    /**
     * @param {?} rootEffects
     * @return {?}
     */
    static forRoot(rootEffects) {
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
    }
}
EffectsModule.decorators = [
    { type: NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsModule.ctorParameters = () => [];
/**
 * @param {...?} instances
 * @return {?}
 */
function createSourceInstances(...instances) {
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

/**
 * Generated bundle index. Do not edit.
 */

export { Effect, mergeEffects, Actions, EffectsModule, EffectSources, toPayload, EffectsFeatureModule as ɵc, createSourceInstances as ɵa, getConsole as ɵb, EffectsRootModule as ɵg, EffectsRunner as ɵi, ErrorReporter as ɵh, CONSOLE as ɵf, FEATURE_EFFECTS as ɵe, ROOT_EFFECTS as ɵd };
//# sourceMappingURL=effects.js.map
