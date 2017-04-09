
var registerModule = angular.module("RegisterModule",[]);
registerModule.controller("registerCtrl",["$scope",function($scope){
	/***城市三联级***/
	$scope.location = "";//
	$scope.$watch("location",function(newValue){//观察location
		//console.log(newValue);
	});

	/***注册表单提交***/
	$scope.registerUserData = {};//声明一个数组用于存储用户输入的数据
	//声明一个方法
	$scope.registerSubForm = function(){
		console.log($scope.registerUserData);//观察数组里面的信息
		//判断表单中输入是否合法
		if($scope.registerForm.$invalid){//如果表单中有任何形式的不合法
			//就执行这里的内容
		}else{//否则就执行下面的内容
			alert("提交成功！");
		}
	};

	//email正则验证

}]);

/***城市三联级***/
//创建cust-location指令
registerModule.directive("custLocation",["$http",function($http){
	return {
		restrict: "A",
		scope: {
			ngModel: "="
		},
		template: require("../tpls/cityselect.html"),
		link: function(scope){
			scope.province = "";
			scope.city = "";
			scope.county = "";
			scope.detailAddress = "";

			// $http.get("../data/city.json")
			// 	.then(function successCallback(response){
			// 		console.log(response.data);
			// 		scope.cityList = response.data;
			// 	});
            scope.cityList = require("../data/city.json");

			scope.$watch("detailAddress",function(newValue){
				scope.ngModel = {
					"province": scope.province == null || 
								scope.province == ""   ? 
								"": scope.province.name,
					"city": scope.city == null ||
							scope.city == ""   ?
							"": scope.city.name,
					"county": scope.county || "",
					"detailAddress": newValue
				}
			});

			//省
			scope.changeProvince = function (){
				if(scope.province == null){
					scope.province = "";
					scope.city = "";
					scope.county = "";
					scope.detailAddress = "";
					scope.ngModel = "";
				}else{
					scope.ngModel = {
						"province": scope.province.name,
						"city": scope.city == null ||
								scope.city == ""   ?
								"": scope.city.name,
						"county": scope.county || "",
						"detailAddress": scope.detailAddress
					}
				}
			};

			//市
			scope.changeCity = function(){
				scope.ngModel = {
					"province": scope.province.name,
					"city": scope.city == null ||
							scope.city == ""   ?
							"": scope.city.name,
					"county": scope.county || "",
					"detailAddress": scope.detailAddress
				}
			};

			//县
			scope.changeCounty = function(){
				scope.ngModel = {
					"province": scope.province.name,
					"city": scope.city == null ||
							scope.city == ""   ?
							"": scope.city.name,
					"county": scope.county || "",
					"detailAddress": scope.detailAddress
				}
			}
		}
	}
}]);

/***注册表单提交***/
//创建compare-first指令
registerModule.directive('compareFirst', [function () {
	return {
		restrict: 'A',
		scope: {
			beforePwd: "=compareFirst"
		},
		require: "ngModel",
		link: function (scope, iElement, iAttrs,controller) {
			controller.$validators.compare = function(value){//value是用户输入的值
				return value == scope.beforePwd;
			};
			scope.$watch('beforePwd', function() {//一旦之前的密码(beforePwd)有变化
				controller.$validate();//就进行验证
			});
		}
	};
}]);
