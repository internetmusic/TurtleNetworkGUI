(function () {
    'use strict';

    const factory = function (waves) {

        const VALIDATOR = {
            [WavesApp.defaultAssets.BTC]: WavesApp.network.code === 'l' ?
                /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|(bc1)[a-z0-9]{25,90})$/ :
                /^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}/,
            [WavesApp.defaultAssets.ETH]: /^0x[0-9a-f]{40}$/i,
        };

        return Object.keys(VALIDATOR).reduce((result, key) => {
            result[key] = {
                isValidAddress(string) {
                    if (typeof VALIDATOR[key] === 'function') {
                        return VALIDATOR[key](string);
                    } else {
                        return VALIDATOR[key].test(string);
                    }
                }
            };
            return result;
        }, Object.create(null));
    };

    factory.$inject = [
        'waves'
    ];

    angular.module('app.utils').factory('outerBlockchains', factory);
})();

/**
 * @typedef {function} IIsValidAddress
 * @param {string} address
 * @return {boolean}
 */

/**
 * @typedef {Object.<string, IIsValidAddress>} IOuterBlockchains
 */
