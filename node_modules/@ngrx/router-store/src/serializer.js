/**
 * @abstract
 */
export class RouterStateSerializer {
    /**
     * @abstract
     * @param {?} routerState
     * @return {?}
     */
    serialize(routerState) { }
}
export class DefaultRouterStateSerializer {
    /**
     * @param {?} routerState
     * @return {?}
     */
    serialize(routerState) {
        return routerState;
    }
}
//# sourceMappingURL=serializer.js.map