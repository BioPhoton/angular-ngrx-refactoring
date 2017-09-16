import { Actions } from '@ngrx/effects';
import { defer } from 'rxjs/observable/defer';
function provideMockActions(factoryOrSource) {
    return {
        provide: Actions,
        useFactory: function () {
            if (typeof factoryOrSource === 'function') {
                return new Actions(defer(factoryOrSource));
            }
            return new Actions(factoryOrSource);
        },
    };
}
export { provideMockActions };
//# sourceMappingURL=testing.es5.js.map
