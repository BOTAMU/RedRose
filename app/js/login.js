
var loginModule = angular.module("LoginModule",[]);
loginModule.controller("loginFormCtrl",["$scope",function ($scope) {
    $scope.loginUserData = {};
    $scope.loginSubForm = function () {
        console.log($scope.loginUserData);
        if($scope.loginForm.$invalid){
            //
        }else{
            alert("提交成功！")
        }
    }
}]);