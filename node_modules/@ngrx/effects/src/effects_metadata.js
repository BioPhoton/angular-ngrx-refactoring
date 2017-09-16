import { compose } from '@ngrx/store';
const /** @type {?} */ METADATA_KEY = '@ngrx/effects';
const /** @type {?} */ r = Reflect;
/**
 * @param {?} sourceType
 * @return {?}
 */
function hasStaticMetadata(sourceType) {
    return !!((sourceType)).propDecorators;
}
/**
 * @param {?} sourceType
 * @return {?}
 */
function getStaticMetadata(sourceType) {
    const /** @type {?} */ propDecorators = sourceType.propDecorators;
    return Object.keys(propDecorators).reduce((all, key) => all.concat(getStaticMetadataEntry(propDecorators[key], key)), []);
}
/**
 * @param {?} metadataEntry
 * @param {?} propertyName
 * @return {?}
 */
function getStaticMetadataEntry(metadataEntry, propertyName) {
    return metadataEntry
        .filter((entry) => entry.type === Effect)
        .map((entry) => {
        let /** @type {?} */ dispatch = true;
        if (entry.args && entry.args.length) {
            dispatch = !!entry.args[0].dispatch;
        }
        return { propertyName, dispatch };
    });
}
/**
 * @param {?} sourceProto
 * @return {?}
 */
function getEffectMetadataEntries(sourceProto) {
    if (hasStaticMetadata(sourceProto.constructor)) {
        return getStaticMetadata(sourceProto.constructor);
    }
    if (r.hasOwnMetadata(METADATA_KEY, sourceProto)) {
        return r.getOwnMetadata(METADATA_KEY, sourceProto);
    }
    return [];
}
/**
 * @param {?} sourceProto
 * @param {?} entries
 * @return {?}
 */
function setEffectMetadataEntries(sourceProto, entries) {
    r.defineMetadata(METADATA_KEY, entries, sourceProto);
}
/**
 * \@Annotation
 * @param {?=} __0
 * @return {?}
 */
export function Effect({ dispatch } = { dispatch: true }) {
    return function (target, propertyName) {
        const /** @type {?} */ effects = getEffectMetadataEntries(target);
        const /** @type {?} */ metadata = { propertyName, dispatch };
        setEffectMetadataEntries(target, [...effects, metadata]);
    };
}
/**
 * @param {?} instance
 * @return {?}
 */
export function getSourceForInstance(instance) {
    return Object.getPrototypeOf(instance);
}
export const /** @type {?} */ getSourceMetadata = compose(getEffectMetadataEntries, getSourceForInstance);
//# sourceMappingURL=effects_metadata.js.map