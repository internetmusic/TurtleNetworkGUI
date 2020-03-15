(function () {
    'use strict';

    /**
     * @param Base
     * @param $scope
     * @param user
     * @param waves
     * @param utils
     * @return {AssetInfoHead}
     */
    const controller = function (Base, $scope, user, waves, utils) {

        class AssetInfoHead extends Base {

            $postLink() {
                this._getAssetInfo();
                this.observe('assetId', this._getAssetInfo);
            }

            /**
             * @private
             */
            _getAssetInfo() {
                const {
                    isVerified,
                    isGateway,
                    isSuspicious,
                    isGatewaySoon,
                    isThirdPartyGateway,
                    hasLabel
                } = utils.getDataFromOracles(this.assetId);
                this.isThirdPartyGateway = isThirdPartyGateway;
                this.isGateway = isThirdPartyGateway === false ? isGateway : false;
                this.isVerified = isVerified;
                this.isSuspicious = isVerified ? false : isSuspicious;
                this.isGatewaySoon = isGateway ? false : isGatewaySoon;
                this.hasLabel = hasLabel;
            }

        }

        return new AssetInfoHead();
    };

    controller.$inject = ['Base', '$scope', 'user', 'waves', 'utils'];

    angular.module('app.ui')
        .component('wAssetStatus', {
            controller: controller,
            templateUrl: 'modules/ui/directives/assetStatus/asset-status.html',
            bindings: {
                assetId: '<'
            }
        });
})();
