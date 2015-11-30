'use strict';
/**
 * @ngdoc overview
 * @name collaborativeLearning
 * @description
 * # collaborativeLearning
 *
 * Main module of the application.
 */
 angular.module('collaborativeLearning')
 .controller('selectQuestion', function ($rootScope,$scope,socket,$http,$state,$stateParams) {

 	var player = $state.params.name;
 	$scope.player = player;
 	var level="";
 	$scope.easy = [];
 	$scope.medium = [];
 	$scope.hard = [];
 	$scope.easyid = [];
 	$scope.mediumid = [];
 	$scope.hardid = [];

 	$http.get("http://localhost:3000/questions").then(function(res){
 		angular.forEach(res.data, function(value,key) {
 			level+= value.level+",";	

 			if(value.level ==1){
 				$scope.easy.push({'qid':value._id, 'qst':value.question});		  	
 			}
 			if(value.level==2){
 				$scope.medium.push({'qid':value._id,'qst':value.question});
 			}
 			if(value.level==3){
 				$scope.hard.push({'qid':value._id,'qst':value.question});
 			}
 		}); 
 		$scope.levelone = $scope.easy;
 		$scope.leveltwo = $scope.medium;
 		$scope.levelthree = $scope.hard;
/*		  $scope.qidones =  $scope.easyid;
		  $scope.mediumones = $scope.mediumid;
		  $scope.hardones =  $scope.hardid;*/
/*			var levelSplit = level.split(",");
			console.log(levelSplit);
			var evens = _.filter(levelSplit, function(num){ 
			    return num == 2; 
			});	
 	console.log(evens);*/

 });

 });

angular.module('collaborativeLearning')
.controller('qntanswer', function ($scope,socket,$state,$http) {
	var answerqnId = [];
	var allqst,selectQ;

	socket.on('answer', function(questionid){
	     //$('#questions').html('')
	     console.log("game start ",questionid);
	     angular.forEach(questionid,function(value,key){
	     	answerqnId.push({'_id':value});
	     });
	     $http.get("http://localhost:3000/questions").then(function(res){
	     	allqst = res.data;
	     	selectQ = _.filter(allqst, function(val){
	     		return _.some(this,function(val2){
	     			return val2['_id'] === val['_id'];
	     		});
	     	}, answerqnId);
	     	console.log("selectQAnswer",answerqnId);
	     	$scope.screenQA = [];
	     	$scope.screenQA = selectQ;
	     	console.log("statepaarams",$state.params);	      	     	
	     	$state.go("questionanswer",{'name':$state.params.name});  
	     });
	 })
	socket.on('close', function(response){
	  	console.log("close game ",response);
		var player1 = response.mine;
		var player2 = response.yours;
		var easy1C = player1.correct[1];
		var medium1C = player1.correct[2];
		var hard1C = player1.correct[3];
		var easy1CW = player1.wrong[1];
		var medium1CW = player1.wrong[2];
		var hard1CW = player1.wrong[3];		
		$scope.easy1C = easy1C;
		$scope.medium1C = medium1C;
		$scope.hard1C = hard1C;
		$scope.easy1CW = easy1CW;
		$scope.medium1CW = medium1CW;
		$scope.hard1CW = hard1CW;

		var easy2C = player2.correct[1];
		var medium2C = player2.correct[2];
		var hard2C = player2.correct[3];
		var easy2CW = player2.wrong[1];
		var medium2CW = player2.wrong[2];
		var hard2CW = player2.wrong[3];

		$scope.easy2C = easy2C;
		$scope.medium2C = medium2C;
		$scope.hard2C = hard2C;		

		$scope.easy2CW = easy2CW;
		$scope.medium2CW = medium2CW;
		$scope.hard2CW = hard2CW;
		
		var marks1 = easy1C * 1 + medium1C * 3 + hard1C * 5;
		var marks2 = easy2C * 1 + medium2C * 3 + hard2C * 5;

		$scope.marks1 = marks1;
		$scope.marks2 = marks2;
		if(marks1>marks2){
			$scope.msg = "Congratualizations.You have won!!!";
		}else if(marks1==marks2){
			$scope.msg = "Game is tied!!!";
		}else{
			$scope.msg = "Sorry you loose.Please try again";

		}
		$state.go('report');

	})
});
