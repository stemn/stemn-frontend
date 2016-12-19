angular.module('modules.realtime-editor', [
    'modules.socket',
	'modules.xxhash',
	'modules.error-handling'
]);
angular.module('modules.realtime-editor').

service('RealtimeEditorService', function (SocketService, $mdToast, $document, $timeout, Authentication, XxhashService, RealtimeEditorModalService, ErrorModalService) {

	var finishEditingTimeout;

	registerIncomingEvents();
	this.subscribeToEdits           = subscribeToEdits;     // function({id:'',type:''})
	this.unsubscribeToEdits         = unsubscribeToEdits;   // function()
	this.saveSection                = saveSection;          // function(section)
	this.startEditingSection        = startEditingSection;  // function(section)
	this.finishEditingSection       = finishEditingSection; // function(section)
	this.saveSectionIfChanged       = saveSectionIfChanged; // function()
	this.checkIfSectionChanged      = checkIfSectionChanged; // function()
	this.changeSectionOrder         = changeSectionOrder;   // function(sections)
	this.deleteSection              = deleteSection;        // function(sectionId)
	this.addSections                = addSections;          // function(sectionId)
	this.entity                     = {};
	this.edits                      = {}; // the currenOtly edited sections { sectionId : userId }

	this.sectionOrder               = []; // Array containing the order of all sections
	this.sections                   = {}; // Object containing all the sections

	this.saveStatus                 = {}; // If the section has been saved.
	this.currentSectionId           = ''; // The section the user is currently editing
	this.currentSectionInitialHash  = ''; // The starting hash of the section the user is currently editing


	var service = this;

	/////////////////////////////////////////////////

	function subscribeToEdits(entity){ // entityType and entityId
		service.entity = entity;
		SocketService.emit('reset');
		SocketService.emit('join', { id : service.entity.id, type : service.entity.type, user : Authentication.currentUser._id });
	}

	function unsubscribeToEdits(){
		SocketService.emit('leave', { id : service.entity.id, user : Authentication.currentUser._id });
	}

	function saveSection(section){
		service.saveStatus.message = 'Saving Section...'
		var sectionCopy = _.clone(section, true)
		stripDomElements(sectionCopy);
		SocketService.emit('section-save', { id : service.entity.id, section : sectionCopy, user : Authentication.currentUser._id }, function(response) {
			if (response.result === 'success') {
				setCurrentSectionHash(); // Set the hash to the new version
				service.saveStatus.message = 'Saved';
			} else {
				service.saveStatus.message = 'Failed to save';
			}
		});
	}

	function changeSectionOrder(orderArray){
		service.sectionOrder = orderArray;
		service.finishEditingSection();
		SocketService.emit('section-reorder', { id : service.entity.id, sectionOrder : orderArray, user : Authentication.currentUser._id });
	}

	function startEditingSection(sectionId){
		// If we are editing a new section
		if(sectionId != service.currentSectionId){
//			console.log('Start editing', sectionId);
			// Save the previous section if it has changed.
			saveSectionIfChanged();
			// Now comes the real logic for our new section
			service.currentSectionId = sectionId;
			setCurrentSectionHash();
			$timeout.cancel(finishEditingTimeout)
			var data = {
				id : service.entity.id,
				section : service.currentSectionId,
				type : service.entity.type,
				user : Authentication.currentUser._id
			}
            console.log('section-edit', data);
			SocketService.emit('section-edit', data);
		}
	}
	function finishEditingSection(){
		// If we were previously editing a section.
		if(service.currentSectionId){
			var data = {
				id : service.entity.id,
				section : service.currentSectionId,
				type : service.entity.type,
				user : Authentication.currentUser._id
			}
			finishEditingTimeout = $timeout(function(){
				SocketService.emit('section-deedit', data);
			}, 100)

			saveSectionIfChanged();
			// Set current section to null because we are not editing anything
			service.currentSectionId = null;
		}
	}
	function deleteSection(sectionId){
		SocketService.emit('section-delete', { id : service.entity.id, section : sectionId, user : Authentication.currentUser._id });
	}
	function addSections(modifiedSections, sectionOrder){
		// remove the DOM elements for the sections
		var modifiedSectionsCopy = _.clone(modifiedSections, true);
		_.forEach(modifiedSectionsCopy, function(section) {
			stripDomElements(section);
		});
		SocketService.emit('section-add', { id : service.entity.id, sections : modifiedSectionsCopy, sectionOrder : sectionOrder, user : Authentication.currentUser._id });
	}

	function stripDomElements(section) {
		delete section.captionElement;
		delete section.contentElement;
		delete section.sectionElement;
	}

	function saveSectionIfChanged(){
		if(checkIfSectionChanged()){
			// If the secton has changed, save it.
			service.saveSection(service.sections[service.currentSectionId]);
		}
	}

	function checkIfSectionChanged(){
		// // This will check to see if the current section has changed since last saving.
		if(service.sections[service.currentSectionId]){
			// Check if the section has changed
			var currentSectionFinalHash =  XxhashService(JSON.stringify(service.sections[service.currentSectionId]), 0xABCD).toString()
			if (service.currentSectionInitialHash !== currentSectionFinalHash) {
				service.saveStatus.message = 'Unsaved changes'
				return true;
			}
			else{
				service.saveStatus.message = 'Saved'
				return false
			}
		}
		else {
			return false
		 }
	}

	function setCurrentSectionHash(){
		if(service.sections[service.currentSectionId]){
			service.currentSectionInitialHash = XxhashService(JSON.stringify(service.sections[service.currentSectionId]), 0xABCD).toString();
		}
	}

	////////////// incoming events /////////////////
	function registerIncomingEvents(){
		// data object: { edits, users }
		SocketService.on('state', function(data) {
			// Remove any edit states that belong to the current user
			_.forEach(data, function(value, key){
				if(value == Authentication.currentUser._id){
					delete data[key]
				}
			})
			service.edits = data;
		});

		// data object: { sectionId : userId }
		SocketService.on('section-edit', function(data) {
			service.edits = service.edits || {}; // Assign empty object if undefined
			// remove any existing section edits for the user from our system state
			var editingUser = data[Object.keys(data)[0]];
			Object.keys(service.edits).forEach(function(section) {
				if (service.edits[section] === editingUser) {
					delete service.edits[section];
				}
			});
			// update our system state with the new edit
			_.extend(service.edits, data);
		});

		// data object: { sectionId : userId }
		SocketService.on('section-deedit', function(data) {
			var section = Object.keys(data)[0];
            delete service.edits[section];
		});

		// data object: [ sectionIds ]
		SocketService.on('section-reorder', function(data) {
			service.sectionOrder = data.sectionOrder;
		});

		SocketService.on('section-delete', function(data) {
			// remove the section id from the section order array
			service.sectionOrder.splice(service.sectionOrder.indexOf(data.section), 1);
			delete service.sections[data.section];
		});

		SocketService.on('section-add', function(data) {
			// over write our copy of the index and merge in the new sections
			service.sectionOrder = data.sectionOrder;
			_.merge(service.sections, data.sections);
		});

		SocketService.on('section-update', function(section) {
			// over write our copy of the section with the new section data
			_.merge(service.sections, section);
		});

		SocketService.on('err', function(err) {
			console.log('socket err', err);

			if(err.type == 'multiple-edit'){
				RealtimeEditorModalService.multipleEdit();
			}
			else{
				// Generic error modal
				ErrorModalService.error(null, {
					title: 'Editor error',
					body: err.message
				})
			}

			//////////////////////////////

			function blurAll(){
			// Focus the body element (so we are not focusing an editiable element)
				var tmp = document.createElement("input");
				document.body.appendChild(tmp);
				tmp.focus();
				document.body.removeChild(tmp);
			}
		});
	}
}).

service('RealtimeEditorModalService', function($mdDialog){
    this.multipleEdit = function (event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/realtime-editor/tpls/multiple-edit-modal.html',
            controller: function(data, $scope){
				$scope.data = data;
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
			locals: {data: data},
			clickOutsideToClose: false,
            targetEvent: event,
        })
    }
}).

directive('realtimeEditorSaveStatus', function (RealtimeEditorService) {
	return {
		restrict: 'E',
		template: '<div>{{saveStatus.message}}</div>',
		link: function (scope, element, attrs) {
			scope.saveStatus = RealtimeEditorService.saveStatus;
		}
	};
}).

directive('realtimeEditor', function (RealtimeEditorService, $interval, $document, $timeout) {
	return {
		restrict: 'A',
		// [entity-id]
		// [entity-type]
		link: function (scope, element, attrs) {
			var checkForEdits = 500;  // Time in ms
			var saveIfChanged = 500; // Time in ms

			var entity = {
				id: attrs.entityId,
				type: attrs.entityType
			}
			RealtimeEditorService.subscribeToEdits(entity);
			scope.$on('$destroy', onDestroy);
			// Autosave function
			$interval(checkforChanges, checkForEdits);

			/////////////////////////////////////////

			var saveTimeout
			function checkforChanges(){
				if(RealtimeEditorService.checkIfSectionChanged()){
					if(!saveTimeout){
						saveTimeout = $timeout(function(){
							RealtimeEditorService.saveSectionIfChanged();
							saveTimeout = null;
						}, saveIfChanged)
					}
				}
				else{
					// If no changes, cancel the save timeout
					$timeout.cancel(saveTimeout);
					saveTimeout = null;
				}
			}

			function onDestroy() {
				RealtimeEditorService.unsubscribeToEdits();
			}
		}
	};
}).

directive('realtimeEditorSection', function (RealtimeEditorService, XxhashService, $document, $timeout) {
	// This directive is used on buttons and the main editor sections.
	// When these elements are clicked we will look for a parent with [editor-section-element] attr.
	// If found, we know we click something inside the section and we should lock edit.
	// If not found, we click outside the section
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			// If realtime editor enabled
			if(attrs.realtimeEditorSection == 'true'){
				// Find if the clicked element has a parent with [editor-section-element] attribute
				element.on('mousedown', function(event){
					// This is mousedown because it covers the case when we highlight some text and then
					// mouseup outside the editable element.
					bindClick(event)
				})
				// We also bind to focus in/out. This covers for keyboard users and for element.focus() methods
				element.bind('focusin', focusin);
			}

			/////////////////////////////////////////////////////

			function bindClick(event){
				var element = event.target;
				// If current element has [editor-section-element]
				if(angular.element(element)[0].hasAttribute('editor-section-element')){
					var elementScope = angular.element(element).scope();
					var editorSectionId = elementScope.editorSectionId || elementScope.$parent.editorSectionId || elementScope.$parent.$parent.editorSectionId;
					RealtimeEditorService.startEditingSection(editorSectionId)
				}
				else{
					var editorSectionElement = angular.element(element).parents('[editor-section-element]')[0];
					if(editorSectionElement){
						var elementScope = angular.element(editorSectionElement).scope();
						var editorSectionId = elementScope.editorSectionId || elementScope.$parent.editorSectionId || elementScope.$parent.$parent.editorSectionId;
						RealtimeEditorService.startEditingSection(editorSectionId)
					}
					else{
						RealtimeEditorService.finishEditingSection();
					}
				}
			}
			function focusin(){
				// If there is a sectionId (there wont be if the [realtime-editor-section] is on a md-menu for example (in these cases we rely on click binds above)
				if(scope.sectionId){
					RealtimeEditorService.startEditingSection(scope.sectionId);
				}
			}

		}
	};
}).

directive('realtimeEditorLocked', function () {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'app/modules/realtime-editor/tpls/realtime-editor-locked.html',
		controller: function($scope, RealtimeEditorService){
			$scope.RealtimeEditorService = RealtimeEditorService;
		}
	};
});
