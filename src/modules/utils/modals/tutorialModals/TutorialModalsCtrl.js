(function () {
    'use strict';

    const controller = function (Base, $scope, modalManager) {


        class TutorialModalsCtrl extends Base {

            constructor() {
                super($scope);
                this.isDesktop = WavesApp.isDesktop();
                this.isWeb = WavesApp.isWeb();
            }

            showSeedBackupModal() {
                modalManager.showSeedBackupModal();
            }

        }

        return new TutorialModalsCtrl();
    };

    controller.$inject = ['Base', '$scope', 'modalManager'];

    angular.module('app.utils').controller('TutorialModalsCtrl', controller);
})();
