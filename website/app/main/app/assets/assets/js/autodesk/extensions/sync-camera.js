(function() {

/*
 * First Person View tool for LMV
 *
 * This tool provides a first person view with movement using the standard WASD keys
 * to forward/backward/left/right and the QE keys to move vertically.  The mouse or
 * cursor is used to orient the view.  Movement is always along or perpendicular to
 * the view direction.
 *
 * The SHIFT key may be used when moving to increase the speed.  Or the default
 * movement speed may be increased/decreased with the MINUS or EQUAL keys.  The
 * ZERO (0) will reset to the default speed values.
 *
 * @author Hans Kellner (Oct 2014)
 *
 */

Autodesk.Viewing.Extensions.FirstPerson.FirstPersonTool = function ( viewerapi ) {

    var avp = Autodesk.Viewing.Private;

    var _isMac = (navigator.userAgent.search("Mac OS") != -1);
    var _navapi = viewerapi.navigation;
    var _container = viewerapi.container;
    var _camera = _navapi.getCamera();
    var _names = ["syncCamera"];

    var _modifierState = { SHIFT: 0, ALT: 0, CONTROL: 0 };  // TODO: Use the hotkeymanager for these.
    var _keys = Autodesk.Viewing.theHotkeyManager.KEYCODES;

    var _isActive = false;


    // true to disable mouse & keyboard navigation.  Used when a HUD is visible to simulate
    // a modal dialog.
    var _ignoreMouseAndKeyNav = false;

    // if true then mouse drag changes view orientation, otherwise just mouse move.
    // If this is set to false then auto-tracking is enabled which might be a usability
    // issue depending on where the cursor is locate when the tool is enabled.
    // Movement is based on the distance the cursor is located from the center of
    // the screen.  If the cursor is away from center when the tool is enabled then
    // in auto-tracking (non-drag) mode the camera will begin moving.  This may be
    // disconcerting to the user.
    var _mouseDraggingLookMode = true;

    var _isDragging = false;
    var _mouseButtons = 0;
    var _touchType = null;

    var _clock = new THREE.Clock(true);

    var _hudMessageStartShowTime = -1;
    var _hudMessageShowTime = 5000;     // milliseconds to show HUD

    var _modelUnitScale = 1.0; // meters
    var _modelScaleFactor = 1.0;

    // These values define how fast/slow the camera movements are made.
    // Adjust these to fine tune the movement.
    var _movementSpeedDefault = 2.0;
    var _movementSpeed = 2.0;
    var _wheelMovementSpeed = 1.0;
    var _verticalMovementSpeed = 0.5;
    var _lookSpeed = 0.0035;

    // Distance from middle of screen (non-drag) or start position (drag) that's
    // considered a neutral no-move zone when in non-drag movement mode.
    var _neutralZoneDist = 40;

    var _wheelDelta = 0;

    // Current cursor
    var _mouseXstart = 0, _mouseDX = 0, _lastX = -1e20;
    var _mouseYstart = 0, _mouseDY = 0, _lastY = -1e20;

    // Limits on mouse distance to throttle look speed
    var _mouseXMaxLimit = 400;
    var _mouseYMaxLimit = 400;

    // Relative movement
    var _deltaYaw = 0;
    var _deltaPitch = 0;

    // Key movement flags
    var _moveForward = false;
    var _moveBackward = false;
    var _moveLeft = false;
    var _moveRight = false;
    var _moveUp = false;
    var _moveDown = false;

    // Previous FOV and Perspective settings
    var _previousFov = _camera.fov;
    var _restorePreviousFov = false;

    var _wasPerspective = _camera.isPerspective;
    var _restorePreviousPerspective = false;

    // Help HUD
    var _bDontShowAgain_HelpHUD = false;

    //gamepad
    var _gamepadModule;
    //if this browser supports gamepad, instantiate GamepadModule
    if(navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads){
        _gamepadModule = new Autodesk.Viewing.Extensions.GamepadModule(viewerapi);
    }
    // ToolInterface

    this.isActive = function()
    {
        return _isActive;
    };

    this.getNames = function()
    {
        return _names;
    };

    this.getName = function()
    {
        return _names[0];
    };

    this.handleMouseMove = function( event )
    {
        console.log(event);
        return true;    // Eat all these so default tools don't screw with view
    };

};

})();
;
(function() {

//
// First Person
//

'use strict';

AutodeskNamespace('Autodesk.Viewing.Extensions.FirstPerson');

    /**
     * @class
     * Activates a First Person navigation tool, similar to those found in videogames.<br>
     * It will also replace the default walk tool button when GuiViewer3D is present.
     *
     * @extends {Autodesk.Viewing.Extension}
     * @param {Autodesk.Viewing.Viewer3D} viewer
     * @param {Object} [options] - not used
     * @constructor
     */
Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension = function(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
};

Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension.prototype.constructor = Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension;

Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension.prototype.load = function() {
    console.log('load');
    var self = this;
    var viewer = this.viewer;
    var avu = Autodesk.Viewing.UI;



    // Register tool
    this.tool = new Autodesk.Viewing.Extensions.FirstPerson.FirstPersonTool(viewer);




    viewer.toolController.registerTool(this.tool);

    // Add the ui to the viewer.
    this.createUI();

    viewer.addEventListener(Autodesk.Viewing.TOOL_CHANGE_EVENT, this.onToolChanged);

    return true;
};

Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension.prototype.createUI = function()
{
    console.log('create');
    var viewer = this.viewer;
    if (!viewer.getToolbar) return; // Adds support for Viewer3D instance

    var self   = this;
    var avu = Autodesk.Viewing.UI;
    var toolbar = viewer.getToolbar(true);
    var navTools = toolbar.getControl(Autodesk.Viewing.TOOLBAR.NAVTOOLSID);

    // Create a button for the tool.
    this.firstPersonToolButton = new avu.Button('toolbar-firstPersonTool');
    this.firstPersonToolButton.setToolTip('First person');
    this.firstPersonToolButton.onClick = function(e) {
        var state = self.firstPersonToolButton.getState();
        if (state === avu.Button.State.INACTIVE) {
            viewer.setActiveNavigationTool("syncCamera");
        } else if (state === avu.Button.State.ACTIVE) {
            viewer.setActiveNavigationTool();
        }
    };
    this.firstPersonToolButton.setIcon("adsk-icon-first-person");

    var cameraSubmenuTool = navTools.getControl('toolbar-cameraSubmenuTool');
    if (cameraSubmenuTool) {
        navTools.addControl(this.firstPersonToolButton, {index: navTools.indexOf(cameraSubmenuTool.getId())});
    } else {
        navTools.addControl(this.firstPersonToolButton);
    }
};

Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension.prototype.unload = function()
{
    var viewer = this.viewer;

    // Remove listeners
    viewer.removeEventListener(Autodesk.Viewing.TOOL_CHANGE_EVENT, this.onToolChanged);
    this.onToolChanged = undefined;

    // Remove hotkey
    Autodesk.Viewing.theHotkeyManager.popHotkeys(this.HOTKEYS_ID);

    // Remove the UI
    if (this.firstPersonToolButton) {
        var toolbar = viewer.getToolbar(false);
        if (toolbar) {
            toolbar.getControl(Autodesk.Viewing.TOOLBAR.NAVTOOLSID).removeControl(this.firstPersonToolButton.getId());
        }
        this.firstPersonToolButton = null;
    }

    //Uh, why does the viewer need to keep track of this in addition to the tool stack?
    if (viewer.getActiveNavigationTool() == this.tool.getName())
        viewer.setActiveNavigationTool();

    // Deregister tool
    viewer.toolController.deregisterTool(this.tool);
    this.tool = null;

    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', Autodesk.Viewing.Extensions.FirstPerson.FirstPersonExtension);


})();
