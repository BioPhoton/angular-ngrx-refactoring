import { StoreModule } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
export declare class EffectsRootModule {
    private sources;
    constructor(sources: EffectSources, runner: EffectsRunner, rootEffects: any[], storeModule: StoreModule);
    addEffects(effectSourceInstance: any): void;
}
