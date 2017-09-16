import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationError, Router, RoutesRecognized } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
/**
 * @abstract
 */
var RouterStateSerializer = (function () {
    function RouterStateSerializer() {
    }
    /**
     * @abstract
     * @param {?} routerState
     * @return {?}
     */
    RouterStateSerializer.prototype.serialize = function (routerState) { };
    return RouterStateSerializer;
}());
var DefaultRouterStateSerializer = (function () {
    function DefaultRouterStateSerializer() {
    }
    /**
     * @param {?} routerState
     * @return {?}
     */
    DefaultRouterStateSerializer.prototype.serialize = function (routerState) {
        return routerState;
    };
    return DefaultRouterStateSerializer;
}());
/**
 * An action dispatched when the router navigates.
 */
var ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';
/**
 * An action dispatched when the router cancels navigation.
 */
var ROUTER_CANCEL = 'ROUTER_CANCEL';
/**
 * An action dispatched when the router errors.
 */
var ROUTER_ERROR = 'ROUTE_ERROR';
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function routerReducer(state, action) {
    switch (action.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: action.payload.routerState,
                navigationId: action.payload.event.id,
            };
        default:
            return state;
    }
}
/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: RouterStateSnapshot,
 *   event: RoutesRecognized
 * }
 * ```
 *
 * Either a reducer or an effect can be invoked in response to this action.
 * If the invoked reducer throws, the navigation will be canceled.
 *
 * If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
 * dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.
 *
 * Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
 * which can be used to restore the consistency of the store.
 *
 * Usage:
 *
 * ```typescript
 * \@NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     StoreModule.forRoot(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
var StoreRouterConnectingModule = (function () {
    /**
     * @param {?} store
     * @param {?} router
     * @param {?} serializer
     */
    function StoreRouterConnectingModule(store, router, serializer) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.dispatchTriggeredByRouter = false;
        this.navigationTriggeredByDispatch = false;
        this.setUpBeforePreactivationHook();
        this.setUpStoreStateListener();
        this.setUpStateRollbackEvents();
    }
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpBeforePreactivationHook = function () {
        var _this = this;
        ((this.router)).hooks.beforePreactivation = function (routerState) {
            _this.routerState = _this.serializer.serialize(routerState);
            if (_this.shouldDispatchRouterNavigation())
                _this.dispatchRouterNavigation();
            return of(true);
        };
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
        var _this = this;
        this.store.subscribe(function (s) {
            _this.storeState = s;
            _this.navigateIfNeeded();
        });
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.shouldDispatchRouterNavigation = function () {
        if (!this.storeState['routerReducer'])
            return true;
        return !this.navigationTriggeredByDispatch;
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.navigateIfNeeded = function () {
        if (!this.storeState['routerReducer'] ||
            !this.storeState['routerReducer'].state) {
            return;
        }
        if (this.dispatchTriggeredByRouter)
            return;
        if (this.router.url !== this.storeState['routerReducer'].state.url) {
            this.navigationTriggeredByDispatch = true;
            this.router.navigateByUrl(this.storeState['routerReducer'].state.url);
        }
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStateRollbackEvents = function () {
        var _this = this;
        this.router.events.subscribe(function (e) {
            if (e instanceof RoutesRecognized) {
                _this.lastRoutesRecognized = e;
            }
            else if (e instanceof NavigationCancel) {
                _this.dispatchRouterCancel(e);
            }
            else if (e instanceof NavigationError) {
                _this.dispatchRouterError(e);
            }
        });
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterNavigation = function () {
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: this.routerState,
            event: new RoutesRecognized(this.lastRoutesRecognized.id, this.lastRoutesRecognized.url, this.lastRoutesRecognized.urlAfterRedirects, this.routerState),
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            routerState: this.routerState,
            storeState: this.storeState,
            event: event,
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            routerState: this.routerState,
            storeState: this.storeState,
            event: event,
        });
    };
    /**
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
        this.dispatchTriggeredByRouter = true;
        try {
            this.store.dispatch({ type: type, payload: payload });
        }
        finally {
            this.dispatchTriggeredByRouter = false;
            this.navigationTriggeredByDispatch = false;
        }
    };
    return StoreRouterConnectingModule;
}());
StoreRouterConnectingModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    { provide: RouterStateSerializer, useClass: DefaultRouterStateSerializer },
                ],
            },] },
];
/**
 * @nocollapse
 */
StoreRouterConnectingModule.ctorParameters = function () { return [
    { type: Store, },
    { type: Router, },
    { type: RouterStateSerializer, },
]; };
/**
 * Generated bundle index. Do not edit.
 */
export { ROUTER_ERROR, ROUTER_CANCEL, ROUTER_NAVIGATION, routerReducer, StoreRouterConnectingModule, RouterStateSerializer, DefaultRouterStateSerializer };
//# sourceMappingURL=router-store.es5.js.map
