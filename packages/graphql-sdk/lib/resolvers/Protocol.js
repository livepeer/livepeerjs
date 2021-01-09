'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.paused = paused
exports.totalTokenSupply = totalTokenSupply
exports.totalBondedToken = totalBondedToken
exports.targetBondingRate = targetBondingRate
exports.transcoderPoolMaxSize = transcoderPoolMaxSize
exports.maxEarningsClaimsRounds = maxEarningsClaimsRounds

/** Typedefs */

/** Resolvers */

/**
 * Gets the id for a Round
 * @param {Object} obj
 * @param {string} obj.id - The round number
 * @return {string}
 */
function id(obj) {
  return 'protocol'
}
/**
 * Gets paused status for the protocol
 * @param {Object} obj
 * @param {string} obj.paused - Whether the protocol is paused
 * @return {boolean}
 */

function paused(obj) {
  return obj.paused
}
/**
 * Gets total token supply for the protocol
 * @param {Object} obj
 * @param {string} obj.totalTokenSupply - totalTokenSupply for the protocol
 * @return {string}
 */

function totalTokenSupply(obj) {
  return obj.totalTokenSupply
}
/**
 * Gets total bonded token for the protocol
 * @param {Object} obj
 * @param {string} obj.totalBondedToken - totalBondedToken for the protocol
 * @return {string}
 */

function totalBondedToken(obj) {
  return obj.totalBondedToken
}
/**
 * Gets target bonding rate for the protocol
 * @param {Object} obj
 * @param {string} obj.targetBondingRate - targetBondingRate for the protocol
 * @return {string}
 */

function targetBondingRate(obj) {
  return obj.targetBondingRate
}
/**
 * Gets transcoder pool max size for the protocol
 * @param {Object} obj
 * @param {string} obj.transcoderPoolMaxSize - transcoderPoolMaxSize for the protocol
 * @return {string}
 */

function transcoderPoolMaxSize(obj) {
  return obj.transcoderPoolMaxSize
}
/**
 * Gets max earnings claims rounds for the protocol
 * @param {Object} obj
 * @param {string} obj.maxEarningsClaimsRounds - maxEarningsClaimsRounds for the protocol
 * @return {string}
 */

function maxEarningsClaimsRounds(obj) {
  return obj.maxEarningsClaimsRounds
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvUHJvdG9jb2wuanMiXSwibmFtZXMiOlsiaWQiLCJvYmoiLCJwYXVzZWQiLCJ0b3RhbFRva2VuU3VwcGx5IiwidG90YWxCb25kZWRUb2tlbiIsInRhcmdldEJvbmRpbmdSYXRlIiwidHJhbnNjb2RlclBvb2xNYXhTaXplIiwibWF4RWFybmluZ3NDbGFpbXNSb3VuZHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFTQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxFQUFULENBQVlDLEdBQVosRUFBc0M7QUFDM0MsU0FBTyxVQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLE1BQVQsQ0FBZ0JELEdBQWhCLEVBQTBDO0FBQy9DLFNBQU9BLEdBQUcsQ0FBQ0MsTUFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxnQkFBVCxDQUEwQkYsR0FBMUIsRUFBb0Q7QUFDekQsU0FBT0EsR0FBRyxDQUFDRSxnQkFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxnQkFBVCxDQUEwQkgsR0FBMUIsRUFBb0Q7QUFDekQsU0FBT0EsR0FBRyxDQUFDRyxnQkFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxpQkFBVCxDQUEyQkosR0FBM0IsRUFBcUQ7QUFDMUQsU0FBT0EsR0FBRyxDQUFDSSxpQkFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxxQkFBVCxDQUErQkwsR0FBL0IsRUFBeUQ7QUFDOUQsU0FBT0EsR0FBRyxDQUFDSyxxQkFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyx1QkFBVCxDQUFpQ04sR0FBakMsRUFBMkQ7QUFDaEUsU0FBT0EsR0FBRyxDQUFDTSx1QkFBWDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFR5cGVkZWZzICovXG5cbnR5cGUgR1FMQ29udGV4dCA9IHtcbiAgbGl2ZXBlZXI6IE9iamVjdCxcbiAgYWNjb3VudD86IHN0cmluZyxcbn1cblxudHlwZSBQcm90b2NvbE9iaiA9IHt9XG5cbi8qKiBSZXNvbHZlcnMgKi9cblxuLyoqXG4gKiBHZXRzIHRoZSBpZCBmb3IgYSBSb3VuZFxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5pZCAtIFRoZSByb3VuZCBudW1iZXJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlkKG9iajogUHJvdG9jb2xPYmopOiBzdHJpbmcge1xuICByZXR1cm4gJ3Byb3RvY29sJ1xufVxuXG4vKipcbiAqIEdldHMgcGF1c2VkIHN0YXR1cyBmb3IgdGhlIHByb3RvY29sXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLnBhdXNlZCAtIFdoZXRoZXIgdGhlIHByb3RvY29sIGlzIHBhdXNlZFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhdXNlZChvYmo6IFByb3RvY29sT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5wYXVzZWRcbn1cblxuLyoqXG4gKiBHZXRzIHRvdGFsIHRva2VuIHN1cHBseSBmb3IgdGhlIHByb3RvY29sXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLnRvdGFsVG9rZW5TdXBwbHkgLSB0b3RhbFRva2VuU3VwcGx5IGZvciB0aGUgcHJvdG9jb2xcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvdGFsVG9rZW5TdXBwbHkob2JqOiBQcm90b2NvbE9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmoudG90YWxUb2tlblN1cHBseVxufVxuXG4vKipcbiAqIEdldHMgdG90YWwgYm9uZGVkIHRva2VuIGZvciB0aGUgcHJvdG9jb2xcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoudG90YWxCb25kZWRUb2tlbiAtIHRvdGFsQm9uZGVkVG9rZW4gZm9yIHRoZSBwcm90b2NvbFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG90YWxCb25kZWRUb2tlbihvYmo6IFByb3RvY29sT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai50b3RhbEJvbmRlZFRva2VuXG59XG5cbi8qKlxuICogR2V0cyB0YXJnZXQgYm9uZGluZyByYXRlIGZvciB0aGUgcHJvdG9jb2xcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoudGFyZ2V0Qm9uZGluZ1JhdGUgLSB0YXJnZXRCb25kaW5nUmF0ZSBmb3IgdGhlIHByb3RvY29sXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0YXJnZXRCb25kaW5nUmF0ZShvYmo6IFByb3RvY29sT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai50YXJnZXRCb25kaW5nUmF0ZVxufVxuXG4vKipcbiAqIEdldHMgdHJhbnNjb2RlciBwb29sIG1heCBzaXplIGZvciB0aGUgcHJvdG9jb2xcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoudHJhbnNjb2RlclBvb2xNYXhTaXplIC0gdHJhbnNjb2RlclBvb2xNYXhTaXplIGZvciB0aGUgcHJvdG9jb2xcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zY29kZXJQb29sTWF4U2l6ZShvYmo6IFByb3RvY29sT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai50cmFuc2NvZGVyUG9vbE1heFNpemVcbn1cblxuLyoqXG4gKiBHZXRzIG1heCBlYXJuaW5ncyBjbGFpbXMgcm91bmRzIGZvciB0aGUgcHJvdG9jb2xcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoubWF4RWFybmluZ3NDbGFpbXNSb3VuZHMgLSBtYXhFYXJuaW5nc0NsYWltc1JvdW5kcyBmb3IgdGhlIHByb3RvY29sXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXhFYXJuaW5nc0NsYWltc1JvdW5kcyhvYmo6IFByb3RvY29sT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5tYXhFYXJuaW5nc0NsYWltc1JvdW5kc1xufVxuIl19
