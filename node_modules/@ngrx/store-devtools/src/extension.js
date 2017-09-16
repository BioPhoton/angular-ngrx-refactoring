import { InjectionToken, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { share } from 'rxjs/operator/share';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { applyOperators } from './utils';
export const /** @type {?} */ ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
export const /** @type {?} */ REDUX_DEVTOOLS_EXTENSION = new InjectionToken('Redux Devtools Extension');
export class DevtoolsExtension {
    /**
     * @param {?} devtoolsExtension
     */
    constructor(devtoolsExtension) {
        this.instanceId = `ngrx-store-${Date.now()}`;
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    /**
     * @param {?} action
     * @param {?} state
     * @return {?}
     */
    notify(action, state) {
        if (!this.devtoolsExtension) {
            return;
        }
        this.devtoolsExtension.send(null, state, { serialize: false }, this.instanceId);
    }
    /**
     * @return {?}
     */
    createChangesObservable() {
        if (!this.devtoolsExtension) {
            return empty();
        }
        return new Observable(subscriber => {
            const /** @type {?} */ connection = this.devtoolsExtension.connect({
                instanceId: this.instanceId,
            });
            connection.subscribe((change) => subscriber.next(change));
            return connection.unsubscribe;
        });
    }
    /**
     * @return {?}
     */
    createActionStreams() {
        // Listens to all changes based on our instanceId
        const /** @type {?} */ changes$ = share.call(this.createChangesObservable());
        // Listen for the start action
        const /** @type {?} */ start$ = filter.call(changes$, (change) => change.type === ExtensionActionTypes.START);
        // Listen for the stop action
        const /** @type {?} */ stop$ = filter.call(changes$, (change) => change.type === ExtensionActionTypes.STOP);
        // Listen for lifted actions
        const /** @type {?} */ liftedActions$ = applyOperators(changes$, [
            [filter, (change) => change.type === ExtensionActionTypes.DISPATCH],
            [map, (change) => this.unwrapAction(change.payload)],
        ]);
        // Listen for unlifted actions
        const /** @type {?} */ actions$ = applyOperators(changes$, [
            [filter, (change) => change.type === ExtensionActionTypes.ACTION],
            [map, (change) => this.unwrapAction(change.payload)],
        ]);
        const /** @type {?} */ actionsUntilStop$ = takeUntil.call(actions$, stop$);
        const /** @type {?} */ liftedUntilStop$ = takeUntil.call(liftedActions$, stop$);
        // Only take the action sources between the start/stop events
        this.actions$ = switchMap.call(start$, () => actionsUntilStop$);
        this.liftedActions$ = switchMap.call(start$, () => liftedUntilStop$);
    }
    /**
     * @param {?} action
     * @return {?}
     */
    unwrapAction(action) {
        return typeof action === 'string' ? eval(`(${action})`) : action;
    }
}
DevtoolsExtension.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DevtoolsExtension.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [REDUX_DEVTOOLS_EXTENSION,] },] },
];
function DevtoolsExtension_tsickle_Closure_declarations() {
    /** @type {?} */
    DevtoolsExtension.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DevtoolsExtension.ctorParameters;
    /** @type {?} */
    DevtoolsExtension.prototype.instanceId;
    /** @type {?} */
    DevtoolsExtension.prototype.devtoolsExtension;
    /** @type {?} */
    DevtoolsExtension.prototype.liftedActions$;
    /** @type {?} */
    DevtoolsExtension.prototype.actions$;
}
//# sourceMappingURL=extension.js.map