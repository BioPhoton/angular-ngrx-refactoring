import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export const /** @type {?} */ INIT = ('@ngrx/store/init');
export class ActionsSubject extends BehaviorSubject {
    constructor() {
        super({ type: INIT });
    }
    /**
     * @param {?} action
     * @return {?}
     */
    next(action) {
        if (typeof action === 'undefined') {
            throw new TypeError(`Actions must be objects`);
        }
        else if (typeof action.type === 'undefined') {
            throw new TypeError(`Actions must have a type property`);
        }
        super.next(action);
    }
    /**
     * @return {?}
     */
    complete() {
        /* noop */
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.complete();
    }
}
ActionsSubject.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ActionsSubject.ctorParameters = () => [];
function ActionsSubject_tsickle_Closure_declarations() {
    /** @type {?} */
    ActionsSubject.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ActionsSubject.ctorParameters;
}
export const /** @type {?} */ ACTIONS_SUBJECT_PROVIDERS = [ActionsSubject];
//# sourceMappingURL=actions_subject.js.map