(() => {
    'use strict';


    /**
     * @param {typeof Base} Base
     * @param {ng.IScope} $scope
     * @param {*} $state
     * @param {User} user
     * @param {ModalManager} modalManager
     * @param {ConfigService} configService
     * @returns {SignInCtrl}
     */
    const controller = function (Base, $scope, $state, user, modalManager) {

        class SignInCtrl extends Base {

            /**
             * @type {Array|null}
             */
            legacyUserList = null;
            /**
             * @type {Array}
             * @private
             */
            _onLoginHandlers = [];

            constructor() {
                super($scope);


                Promise.all([
                    user.getMultiAccountData(),
                    user.getFilteredUserList()
                ]).then(([multiAccountData, userList]) => {
                    if (!multiAccountData) {
                        $state.go('signUp');
                    } else {
                        this.legacyUserList = userList;
                    }
                });

                user.onLogin().then(() => {
                    this._onLoginHandlers.forEach((handler) => handler());
                });
            }

            $onDestroy() {
                super.$onDestroy();
                this._onLoginHandlers = [];
            }

            onLogin() {
                Promise.all([
                    user.getMultiAccountUsers(),
                    user.getMultiAccountSettings()
                ]).then(([multiAccountUsers, commonSettings]) => {
                    const [firstUser] = multiAccountUsers;

                    user.setMultiAccountSettings(commonSettings);

                    if (firstUser) {
                        user.login(firstUser).then(() => {
                            user.goToActiveState(true);
                        });
                    } else if (this.legacyUserList && this.legacyUserList.length) {
                        $state.go('migrate');
                    } else {
                        $state.go('create');
                    }
                }).catch(() => {
                    return null;
                });
            }

            onResetPassword() {
                $state.go('signUp');
            }

            showForgotPasswordModal() {
                modalManager.showForgotPasswordModal().then(() => {
                    $state.go('signUp');
                });
            }

            _login(userData) {
                user.login(userData).then(() => {
                    user.goToActiveState();
                });
            }

            _showPasswordError() {
                this.password = '';
                this.showPasswordError = true;
            }

            _updatePassword() {
                if (this.password) {
                    this.showPasswordError = false;
                }
            }

        }

        return new SignInCtrl();

    };

    controller.$inject = ['Base', '$scope', '$state', 'user', 'modalManager'];

    angular.module('app.signIn').controller('SignInCtrl', controller);
})();
