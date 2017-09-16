import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
export class ScannedActionsSubject extends Subject {
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.complete();
    }
}
ScannedActionsSubject.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ScannedActionsSubject.ctorParameters = () => [];
function ScannedActionsSubject_tsickle_Closure_declarations() {
    /** @type {?} */
    ScannedActionsSubject.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ScannedActionsSubject.ctorParameters;
}
export const /** @type {?} */ SCANNED_ACTIONS_SUBJECT_PROVIDERS = [
    ScannedActionsSubject,
];
//# sourceMappingURL=scanned_actions_subject.js.map