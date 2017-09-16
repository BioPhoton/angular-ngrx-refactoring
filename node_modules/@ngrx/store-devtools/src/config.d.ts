import { ActionReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
export declare class StoreDevtoolsConfig {
    maxAge: number | false;
    monitor: ActionReducer<any, any>;
}
export declare const STORE_DEVTOOLS_CONFIG: InjectionToken<StoreDevtoolsConfig>;
export declare const INITIAL_OPTIONS: InjectionToken<StoreDevtoolsConfig>;
export declare type StoreDevtoolsOptions = Partial<StoreDevtoolsConfig> | (() => Partial<StoreDevtoolsConfig>);
