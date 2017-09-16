import { getSourceForInstance } from './effects_metadata';
const /** @type {?} */ onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * @param {?} sourceInstance
 * @return {?}
 */
export function isOnRunEffects(sourceInstance) {
    const /** @type {?} */ source = getSourceForInstance(sourceInstance);
    return (onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function');
}
//# sourceMappingURL=on_run_effects.js.map