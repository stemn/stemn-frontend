import TestPage from './TestPage.jsx';
const moduleName = 'testPage'

angular.module(moduleName, []);
angular.module(moduleName).
directive(moduleName, (reactDirective) => reactDirective(TestPage));
export default moduleName
