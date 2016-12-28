import angular from 'angular';
import reactTest from './modules/react-test/react-test.js';
import tabs from './modules/tabs/tabs.js';
import '../style/app.css';

import ngReact from 'ngreact';


const moduleName = 'app';

const app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
  }
};


angular.module(moduleName, [
  'react',
  reactTest,
  tabs
])
.directive('app', app)
.controller('AppCtrl', ($scope) => {
  $scope.someData = 'here is some data from the controller';
});

export default moduleName;
