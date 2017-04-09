require("angular");
require("angular-ui-router");
require("angular-messages");
require("bootstrap");
require("../css/app.css");
require("../../node_modules/bootstrap/dist/css/bootstrap.min.css");

require("./login.js");
require("./register.js");
require("./shopcart.js");

var redRose = angular.module("redRose",[
    "ngMessages","ui.router",
    "RegisterModule","LoginModule","ShopCartModule"
]);
/**
 * 由于在整个应用当中都会和路由打交道,所以这里把$state和$stateParams
 * 这两个对象放到$rootScope上,方便其他地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 * */
redRose.run(
    [
        '$rootScope', '$state', '$stateParams',
        function($rootScope,$state,$stateParams){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由,而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图,所以这里使用了ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 * */
redRose.config(
    [
        "$stateProvider", "$urlRouterProvider",
        function ($stateProvider,$urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");
            $stateProvider
                .state("home",{//首页
                    url: "/home",
                    views: {
                        "": {
                            template: require("../tpls/home.html")
                        }
                    }
                })
                .state("login",{//登陆
                    url: "/login",
                    views: {
                        "": {
                            template: require("../tpls/login.html")
                        }
                    }
                })
                .state("register",{//注册
                    url: "/register",
                    views: {
                        "": {
                            template: require("../tpls/register.html")
                        }
                    }
                })
                .state("shopcart",{//购物车
                    url: "/shopcart",
                    views: {
                        "": {
                            template: require("../tpls/shopcart.html")
                        }
                    }
                })
        }
    ]
);
module.exports = redRose;