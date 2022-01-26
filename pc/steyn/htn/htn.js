var appHypertension = angular.module('htn', []);
appHypertension.controller('htnCtrl', function ($scope) {
  $scope.htns = htns;
  $scope.singleSelect="Sys1";
});
appHypertension.controller('htnItemShow', function ($scope) {
  $scope.htn.bpSystolic = (($scope.htn.BPr).split('/'))[0];
});