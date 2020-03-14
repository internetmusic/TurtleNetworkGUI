(function () {
    'use strict';

    const GATEWAYS = {
        [WavesApp.defaultAssets.TN]: { waves: 'TN', gateway: 'TN' },
        [WavesApp.defaultAssets.WAVES]: { waves: 'WAVES', gateway: 'WAVES' },
        [WavesApp.defaultAssets.DOGE]: { waves: 'DOGE', gateway: 'DOGE' },
        [WavesApp.defaultAssets.TUSD]: { waves: 'TUSD', gateway: 'TUSD' },
        [WavesApp.defaultAssets.ETHO]: { waves: 'ETHO', gateway: 'ETHO' },
        [WavesApp.defaultAssets.SENT]: { waves: 'SENT', gateway: 'SENT' }
    };

    const KEY_NAME_PREFIX = 'wavesGateway';

    /**
     * @returns {WavesGatewayService}
     */

    const factory = function () {
        const { BigNumber } = require('@waves/bignumber');

        class WavesGatewayService {

            /**
             * @param {Asset} asset
             * @return {IGatewaySupportMap}
             */
            getSupportMap(asset) {
                if (GATEWAYS[asset.id]) {
                    return {
                        deposit: true,
                        withdraw: asset.id !== WavesApp.defaultAssets.BTC,
                        errorAddressMessage: true,
                        wrongAddressMessage: true
                    };
                }
            }

            /**
             * From VST to Waves
             * @param {Asset} asset
             * @param {string} walletAddress
             * @return {Promise}
             */
            getDepositDetails(asset, walletAddress) {
                WavesGatewayService._assertAsset(asset.id);

                const ASSETGATEWAY = `${WavesApp.network.wavesGateway[asset.id]}`;
                const headers = {};
                headers['Content-Type'] = 'application/json';
                headers.Accept = 'application/json';

                return ds
                    .fetch(`${ASSETGATEWAY}/api/fullinfo`, { method: 'GET', headers })
                    .then(details => {
                        return {
                            address: details.otherAddress,
                            minimumAmount: new BigNumber(details.minAmount),
                            maximumAmount: new BigNumber(details.maxAmount),
                            gatewayFee: new BigNumber(details.fee),
                            disclaimerLink: details.disclaimer,
                            minRecoveryAmount: new BigNumber(details.recovery_amount),
                            recoveryFee: new BigNumber(details.recovery_fee),
                            supportEmail: details.email,
                            operator: details.company,
                            walletAddress: walletAddress
                        };
                    });
            }

            /**
             * From Waves to VST
             * @param {Asset} asset
             * @param {string} targetAddress
             * @param {string} [paymentId]
             * @return {Promise}
             */
            getWithdrawDetails(asset, targetAddress) {
                WavesGatewayService._assertAsset(asset.id);

                const ASSETGATEWAY = `${WavesApp.network.wavesGateway[asset.id]}`;
                const headers = {};
                headers['Content-Type'] = 'application/json';
                headers.Accept = 'application/json';

                return ds
                    .fetch(`${ASSETGATEWAY}/api/fullinfo`, { method: 'GET', headers: headers })
                    .then(details => {
                        return {
                            address: details.tnAddress,
                            minimumAmount: new BigNumber(details.minAmount),
                            maximumAmount: new BigNumber(details.maxAmount),
                            gatewayFee: new BigNumber(details.fee),
                            type: details.type,
                            attachment: targetAddress
                        };
                    });
            }

            /**
             * @param {Asset} asset
             * @return {string}
             */
            getAssetKeyName(asset) {
                return `${KEY_NAME_PREFIX}${GATEWAYS[asset.id].gateway}`;
            }

            /**
             * @return {Object}
             */
            getAll() {
                return GATEWAYS;
            }

            /**
             * @return {string}
             */
            getAddressErrorMessage(address) {
                return `can't withdraw to address ${address}`;
            }

            getWrongAddressMessage(address) {
                return `wrong address ${address}`;
            }

            /**
             *
             * @param {number} value
             * @param {number} pow
             * @returns {number}
             * @private
             */
            _normalaizeValue(value, pow) {
                return value * Math.pow(10, pow);
            }

            static _assertAsset(assetId) {
                if (!GATEWAYS[assetId]) {
                    throw new Error('Asset is not supported by VST');
                }
            }

        }

        return new WavesGatewayService();
    };

    angular.module('app.utils').factory('wavesGatewayService', factory);
})();
