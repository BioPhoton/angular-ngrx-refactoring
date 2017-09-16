/**
 * @param {?} t
 * @return {?}
 */
export function memoize(t) {
    let /** @type {?} */ lastArguments = null;
    let /** @type {?} */ lastResult = null;
    /**
     * @return {?}
     */
    function reset() {
        lastArguments = null;
        lastResult = null;
    }
    /**
     * @return {?}
     */
    function memoized() {
        if (!lastArguments) {
            lastResult = t.apply(null, arguments);
            lastArguments = arguments;
            return lastResult;
        }
        for (let /** @type {?} */ i = 0; i < arguments.length; i++) {
            if (arguments[i] !== lastArguments[i]) {
                lastResult = t.apply(null, arguments);
                lastArguments = arguments;
                return lastResult;
            }
        }
        return lastResult;
    }
    return { memoized, reset };
}
/**
 * @param {...?} args
 * @return {?}
 */
export function createSelector(...args) {
    const /** @type {?} */ selectors = args.slice(0, args.length - 1);
    const /** @type {?} */ projector = args[args.length - 1];
    const /** @type {?} */ memoizedSelectors = selectors.filter((selector) => selector.release && typeof selector.release === 'function');
    const /** @type {?} */ memoizedProjector = memoize(function (...selectors) {
        return projector.apply(null, selectors);
    });
    const /** @type {?} */ memoizedState = memoize(function (state) {
        const /** @type {?} */ args = selectors.map(fn => fn(state));
        return memoizedProjector.memoized.apply(null, args);
    });
    /**
     * @return {?}
     */
    function release() {
        memoizedState.reset();
        memoizedProjector.reset();
        memoizedSelectors.forEach(selector => selector.release());
    }
    return Object.assign(memoizedState.memoized, { release });
}
/**
 * @template T
 * @param {?} featureName
 * @return {?}
 */
export function createFeatureSelector(featureName) {
    const { memoized, reset } = memoize(function (state) {
        return state[featureName];
    });
    return Object.assign(memoized, { release: reset });
}
//# sourceMappingURL=selector.js.map