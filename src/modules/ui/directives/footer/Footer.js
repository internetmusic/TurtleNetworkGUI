(function () {
    'use strict';


    const controller = function (Base, $scope, $element, utils, storage, modalManager, $state) {

        class FooterCtrl extends Base {

            /**
             * @public
             * @type {string}
             */
            mobileAppLink;
            /**
             * @public
             * @type {string}
             */
            telegramLink;
            /**
             * @public
             * @type {string}
             */
            lang;
            /**
             * @public
             * @type {boolean}
             */
            isToasterMobilesVisible;
            /**
             * @private
             * @readonly
             * @type {string}
             */
            _toasterMobilesStorageKey = 'toasterMobilesHidden';
            privacyPolicy = WavesApp.network.privacyPolicy;
            termsAndConditionsLink = WavesApp.network.termsAndConditions;

            constructor() {
                super();
                this._isDesktopUpdate = $state.current.name === 'desktopUpdate';
                this.hovered = false;

                this.mobileAppLink = navigator.userAgent.match(/iPhone|iPad|iPod/i) ?
                    'https://play.google.com/store/apps/details?id=com.tn.wallet' :
                    'https://play.google.com/store/apps/details?id=com.tn.wallet';

                this.telegramLink = 'https://t.me/TurtleNetwork';

                this.lang = localStorage.getItem('lng') === 'ru' ? 'Ru' : 'Global';

                storage.load(this._toasterMobilesStorageKey).then(wasHidden => {
                    this.isToasterMobilesVisible = !wasHidden && window.innerWidth <= 768;
                    utils.safeApply($scope);
                });
            }

            /**
             * @public
             */
            hideToaster() {

                $element.find('.toaster-mobiles').addClass('hidden-toaster');
                storage.save(this._toasterMobilesStorageKey, true);
            }

        }

        return new FooterCtrl();

    };

    controller.$inject = ['Base', '$scope', '$element', 'utils', 'storage', 'modalManager', '$state'];

    angular.module('app.ui').component('wFooter', {
        templateUrl: 'modules/ui/directives/footer/footer.html',
        controller
    });

})();
