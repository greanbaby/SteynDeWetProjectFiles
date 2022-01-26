angular.module("dia", []).controller('diaCtrl', DiaCtrl);
  function DiaCtrl($scope) {
    $scope.diab = diab;
    $scope.singleSelect="HbA1c_";
  }