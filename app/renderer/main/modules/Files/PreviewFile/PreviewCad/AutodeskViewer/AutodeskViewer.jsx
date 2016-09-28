import React from 'react';

import autodeskViewerUtils from './autodeskViewerUtils.js';


export default class extends React.Component{
  componentDidMount() {
    var viewerEl = this.refs.canvas;
    var oDocument = null,
        viewerInstance = null;
    var oViewables = null,
        oViews3D = null,
        oViews2D = null;
    var options = {
        'document': this.props.urn,
        'accessToken': this.props.token,
        'env': 'AutodeskProduction'
    };

//            $scope.$on('$destroy', onDestroy);
//            $scope.previewer.center = center;


      viewerInstance = autodeskViewerUtils.register(viewerEl); // With toolbar

      window.Autodesk.Viewing.Initializer(options, function () {
          viewerInstance.initialize();
          loadDocument(viewerInstance, options);
      });

      ///////////////////////////////

      function center(){
          if(viewerInstance){
              console.log('center');
              viewerInstance.resize()
          }
      }

      function loadDocument(viewer, options) {
          if (options.document.substring(0, 4) === 'urn:'){
              options.document = options.document.substring(4);
          }
          window.Autodesk.Viewing.Document.load('urn:' + options.document, onLoadCallback, onErrorCallback);
      }

      function onLoadCallback(doc){
          // Get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UI)
          oViews3D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
              'type': 'geometry',
              'role': '3d'
          }, true);
          oViews2D = window.Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
              'type': 'geometry',
              'role': '2d'
          }, true);

          // Load up first a 3D view by default
          if (oViews3D.length > 0){
              viewerInstance.load(doc.getViewablePath(oViews3D[0]));
          }
          else if (oViews2D.length > 0){
              viewerInstance.load(doc.getViewablePath(oViews2D[0]));
          }
          else{
//              $mdToast.show($mdToast.simple().theme('warn').content('Error: No views found'));
          }
      }

      function onErrorCallback(errorMsg){
//          $mdToast.show($mdToast.simple().theme('warn').content('Error: '+errorMsg));
      }

      function onDestroy(){
          AutoDeskInstanceService.deregister(viewerInstance);
      }
  }
  render() {
    return <div ref="canvas"></div>
  }
};
