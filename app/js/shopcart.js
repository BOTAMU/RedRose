var shopCart = angular.module("ShopCartModule",[]);
shopCart.controller("shopCartCtrl",["$scope","$http",function ($scope,$http) {
    //获取商品数据列表
    // $http.get("../data/goodsList.json")
    //     .then(function successCallback(response) {
    //         //console.log(response.data);
    //         $scope.goodsList = response.data;
    //     });
    $scope.goodsList = require("../data/goodsList.json");

    $scope.myFavorites = [];//收藏夹
    $scope.storageSelected = [];//声明一个数组用于储存选择到的数据,
    $scope.all = true;//默认全选
    $scope.TotalNum = 0;//商品总数
    $scope.TotalPrice = 0;//商品总价
    getNum();//商品总数
    getTotal();//商品总价

    //全选
    $scope.checkAll = function () {
        for (var i in $scope.goodsList) {
            $scope.goodsList[i].check = $scope.all;
        }
    };
    //点击'+'增加数量
    $scope.addNum = function ($index) {
        for (var i in $scope.goodsList) {
            if (i == $index) {
                $scope.goodsList[i].count++;
                $(".disabled_this").eq(i).css({
                    "pointerEvents": "auto",//开启按钮
                    "backgroundColor": "white"//背景设置回原来的白色
                });
                break;
            }
        }
        getNum();//商品总数随之增加
        getTotal();//商品总价随之增加
    };
    //点击"-"减少数量
    $scope.reduceNum = function ($index) {
        for (var i in $scope.goodsList) {
            if (i == $index) {
                if ($scope.goodsList[i].count != 1) {
                    $scope.goodsList[i].count--;
                } else {
                    //pointer-events:none
                    $(".disabled_this").eq(i).css({
                        "pointerEvents": "none",//禁用按钮
                        "backgroundColor": "#dfdddd"//背景设置为灰色
                    });
                }
                break;
            }
        }
        getNum();//商品总数随之减少
        getTotal();//商品总价随之减少
    };
    //删除当前商品
    $scope.deleteCurrent = function (index, event) {
        if ($scope.goodsList[index]) {
            $scope.goodsList.splice(index, 1);
        }
        $scope.all = false;
    };
    //移至到我的收藏夹
    $scope.moveMyFavorites = function ($index) {
        console.log($scope.goodsList[$index]);//当前第几条数据
        //筛选出已加入购物车的商品
        for (var i in $scope.goodsList) {
            if (i == $index) {
                $scope.myFavorites.push($scope.goodsList[i]);//得到一个数组对象
            }
        }
        console.log($scope.myFavorites);//观察数组对象

    };
    //商品总数量
    function getNum() {
        $scope.TotalNum = 0;
        for (var i in $scope.goodsList) {
            $scope.TotalNum += $scope.goodsList[i].count;
        }
        return $scope.TotalNum;
    }

    //商品的总价
    function getTotal() {
        $scope.TotalPrice = 0;
        for (var i in $scope.goodsList) {
            $scope.TotalPrice += $scope.goodsList[i].price1 * $scope.goodsList[i].count;
        }
        return $scope.TotalPrice;
    }

    //移动到我的关注
    $scope.moveMyFWI = function () {
        //筛选出已加入购物车的商品
        for (var j in $scope.goodsList) {
            if ($scope.goodsList[j].check) {
                $scope.storageSelected.push($scope.goodsList[j])
            }
        }
        console.log($scope.storageSelected);
    };

    //删除选中的产品
    $scope.deletePitchOn = function () {
        //筛选出已加入购物车的商品
        for (var i in $scope.goodsList) {
            //判断第几个选中
            if ($scope.goodsList[i].check) {
                //将选中的push到$scope.storageSelected数组中去
                $scope.storageSelected.push($scope.goodsList[i]);
            }
        }
        console.log($scope.storageSelected);
        //遍历$scope.storageSelected数组
        for (var r in $scope.storageSelected) {
            // if($scope.storageSelected[r].check == true){
            //     $scope.storageSelected[r].remove();
            // }
            //remove();
            $scope.goodsList.splice($scope.storageSelected[r].check == true, r);
            $scope.all = false;
            console.log(r)
        }
    };

    //结算
    $scope.settlement = function () {
    };

    $scope.$watch('goodsList', function (newValue, oldValue, scope) {
        $scope.TotalNum = 0;//商品总数
        $scope.TotalPrice = 0;//总价格
        $scope.counter = 0;//计数器
        for (var i in newValue) {
            var tNum = newValue[i].count;//计算出新的结果
            var total = newValue[i].price1 * newValue[i].count;//计算出新的结果
            $scope.goodsList[i].total = total.toFixed(2); //保留两位小数并且把它赋值给元数据;
            if (newValue[i].check) {
                $scope.TotalNum += tNum;
                $scope.TotalPrice += total;
                $scope.counter++;
            }
            $scope.all = ($scope.counter == newValue.length); //如果所有的都选中的话，那么全选也应该选中
        }
    }, true);
}]);