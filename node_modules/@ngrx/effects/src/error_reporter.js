import { Injectable, Inject } from '@angular/core';
import { CONSOLE } from './tokens';
export class ErrorReporter {
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
function ErrorReporter_tsickle_Closure_declarations() {
    /** @type {?} */
    ErrorReporter.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ErrorReporter.ctorParameters;
    /** @type {?} */
    ErrorReporter.prototype.console;
}
//# sourceMappingURL=error_reporter.js.map