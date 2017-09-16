import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Action } from '@ngrx/store';
import { ErrorReporter } from './error_reporter';
export declare class EffectSources extends Subject<any> {
    private errorReporter;
    constructor(errorReporter: ErrorReporter);
    addEffects(effectSourceInstance: any): void;
    /**
     * @private
     */
    toActions(): Observable<Action>;
}
