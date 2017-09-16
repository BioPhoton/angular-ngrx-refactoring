import { NgModule, Inject, Optional } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';
export class EffectsFeatureModule {
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
function EffectsFeatureModule_tsickle_Closure_declarations() {
    /** @type {?} */
    EffectsFeatureModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    EffectsFeatureModule.ctorParameters;
    /** @type {?} */
    EffectsFeatureModule.prototype.root;
}
//# sourceMappingURL=effects_feature_module.js.map