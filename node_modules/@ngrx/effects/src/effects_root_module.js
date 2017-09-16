import { NgModule, Inject, Optional } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { ROOT_EFFECTS } from './tokens';
export class EffectsRootModule {
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
function EffectsRootModule_tsickle_Closure_declarations() {
    /** @type {?} */
    EffectsRootModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    EffectsRootModule.ctorParameters;
    /** @type {?} */
    EffectsRootModule.prototype.sources;
}
//# sourceMappingURL=effects_root_module.js.map