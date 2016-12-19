'use strict';

AutodeskNamespace('Autodesk.Samples');

/**
 * SampleContextMenu demonstrates how you might take the existing ViewerObjectContextMenu
 * and customize that. If you want an entirely different context menu, then derive from
 * ObjectContextMenu instead.
 */
Autodesk.Samples.SampleContextMenu = function (viewer) {
    Autodesk.Viewing.Extensions.ViewerObjectContextMenu.call(this, viewer);
};

Autodesk.Samples.SampleContextMenu.prototype = Object.create(Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype);
Autodesk.Samples.SampleContextMenu.prototype.constructor = Autodesk.Samples.SampleContextMenu;

Autodesk.Samples.SampleContextMenu.prototype.buildMenu = function (event, status) {
    var menu =  Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype.buildMenu.call(this, event, status);

    function shuffle(o) { // from Stackoverflow
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    // Make some arbitrary changes to the menu: shuffle the menu items, delete the first one, and add one.
    //
    if (1 < menu.length) {
        shuffle(menu);
        menu.splice(0, 1);
    }

    menu.push({
        title: "SampleContextMenu menu item",
        target: function () {
            alert("SampleContextMenu menu item clicked");
        }
    });

    return menu;
};

/**
 * SampleExtension sets the SampleModelStructurePanel and SampleLayersPanel to the given viewer
 * and registers hotkeys to toggle their display.  It also sets a SampleContextMenu.
 */
Autodesk.Samples.SampleExtension = function (viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.modelStructurePanel = null;
    this.layersPanel = null;
    this.viewerSettingsPanel = null;
};

Autodesk.Samples.SampleExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
Autodesk.Samples.SampleExtension.prototype.constructor = Autodesk.Samples.SampleExtension;

/**
 * Override load to create the SampleModelStructurePanel, SampleLayersPanel, and SamplePropertyPanel,
 * set them on the viewer, and register hotkeys. It also creates the SampleContextMenu.
 */
Autodesk.Samples.SampleExtension.prototype.load = function () {
    var that = this;

    that.modelStructurePanel = new Autodesk.Samples.SampleModelStructurePanel(that.viewer, 'Sample Model Structure Loading', that.options);
    that.viewer.setModelStructurePanel(that.modelStructurePanel);

    that.layersPanel = new Autodesk.Samples.SampleLayersPanel(that.viewer);
    that.viewer.setLayersPanel(that.layersPanel);

    that.propertyPanel = new Autodesk.Samples.SamplePropertyPanel(that.viewer);
    that.viewer.setPropertyPanel(that.propertyPanel);

    that.viewer.setContextMenu(new Autodesk.Samples.SampleContextMenu(that.viewer));
    that.viewer.registerContextMenuCallback('Sample Extension', function (menu, status) {
        menu.push({
            title: 'registerContextMenuCallback menu item',
            target: function () {
                alert("registerContextMenuCallback menu item clicked");
            }
        });
    });

    that.viewerSettingsPanel = new Autodesk.Samples.SampleSettingsPanel(that.viewer);
    that.viewer.setSettingsPanel(that.viewerSettingsPanel);


    // Register hotkeys
    var keys = Autodesk.Viewing.theHotkeyManager.KEYCODES;

    // 'm' hotkey to show/hide model structure panel
    var onPressM = function (keycodes) {
        if (!that.viewer.model.is2d()) {
            that.modelStructurePanel.setVisible(!that.modelStructurePanel.isVisible());
            return true;
        }
        return false;
    };
    // 'l' hotkey to show/hide layers panel
    var onPressL = function (keycodes) {
        if (that.viewer.model.is2d()) {
            that.layersPanel.setVisible(!that.layersPanel.isVisible());
            return true;
        }
        return false;
    };
    // 'p' hotkey to show/hide properties panel
    var onPressP = function (keycodes) {
        that.propertyPanel.setVisible(!that.propertyPanel.isVisible());
        return true;
    };
    // 'v' hotkey to show/hide viewer settings panel
    var onPressV = function (keycodes) {
        that.viewerSettingsPanel.setVisible(!that.viewerSettingsPanel.isVisible());
        return true;
    };
    var hotkeys = [
        {
            keycodes: [keys.m],
            onPress: onPressM
        },
        {
            keycodes: [keys.l],
            onPress: onPressL
        },
        {
            keycodes: [keys.p],
            onPress: onPressP
        },
        {
            keycodes: [keys.v],
            onPress: onPressV
        }
    ];
    Autodesk.Viewing.theHotkeyManager.pushHotkeys("Sample Extension", hotkeys);

    this.addToolbarUI();

    // Override some settings with extension-specific values.
    //
    this.viewer.setGhosting(false);

    return true;
};

/**
 * Override unload to remove the SampleModelStructurePanel, SampleLayersPanel, SamplePropertyPanel,
 * and SampleContextMenu from the viewer, and unregister the hotkeys.
 */
Autodesk.Samples.SampleExtension.prototype.unload = function () {
    // Remove the panel from the viewer.
    //
    this.viewer.setModelStructurePanel(null);
    this.viewer.setLayersPanel(null);
    this.viewer.setContextMenu(null);
    this.viewer.setPropertyPanel(null);
    this.viewer.unregisterContextMenuCallback('Sample Extension');

    // Remove the toolbar UI
    if (this.toolbar) {
        viewer.container.removeChild(this.toolbar.container);
        this.toolbar = null;
    }

    // Remove the event listener for the hotkey.
    //
    window.removeEventListener('keydown', this.onKeyDown);
    return true;
};

/**
 * Add Toolbar and tool buttons UI.
 */
Autodesk.Samples.SampleExtension.prototype.addToolbarUI = function () {
    var that = this;
    var viewer = this.viewer;
    var AVU = Autodesk.Viewing.UI;

    this.toolbar = new AVU.ToolBar('sample-extension-toolbar');

    var colorRadioGroup = new AVU.RadioButtonGroup('sample-extension-radio-group');

    var buttonGrey = new AVU.Button('toolbar-example-grey');
    buttonGrey.setToolTip('Grey Background');
    buttonGrey.onClick = function(e) {
        viewer.setBackgroundColor(80, 80, 80, 155, 155, 155);
        viewer.fireEvent( { type: "backgroundColorChanged", value: [80, 80, 80] });
    };
    buttonGrey.addClass('sample-button-grey');
    //buttonGrey.setText('Grey');

    var buttonPink = new AVU.Button('toolbar-example-pink');
    buttonPink.setToolTip('Pink Background');
    buttonPink.onClick = function(e) {
        viewer.setBackgroundColor(255, 0, 255, 155, 0, 155);
        viewer.fireEvent( { type: "backgroundColorChanged", value: [255, 0, 255] });
    };
    buttonPink.addClass('sample-button-pink');
    //buttonPink.setText('Pink');

    colorRadioGroup.addControl(buttonGrey);
    colorRadioGroup.addControl(buttonPink);

    function isPink( color ) { return (color[0] === 255 && color[1] === 0 && color[2] === 255); }
    function isGrey( color ) { return (color[0] === 80 && color[1] === 80 && color[2] === 80); }
    that.viewer.addEventListener("backgroundColorChanged", function(e) {
        var color = e.value;
        if (isPink(color))
            buttonPink.setState(AVU.Button.State.ACTIVE);
        if (isGrey(color))
            buttonGrey.setState(AVU.Button.State.ACTIVE);
    });


    // Add second subtoolbar
    var panelToolsGroup = new AVU.ControlGroup('sample-extension-control-group');

    // Add a button to toggle Model Structure Panel
    var modelStructureButton = new AVU.Button('toolbar-modelStructure');
    modelStructureButton.setToolTip('Model structure');
    modelStructureButton.onClick = function(e) {
        if (that.modelStructurePanel) {
            that.modelStructurePanel.setVisible(!that.modelStructurePanel.isVisible());
        }
    };
    modelStructureButton.addClass('sample-model-structure-button');

    // Add visibility callback to Model Structure Panel
    if (that.modelStructurePanel) {
        that.modelStructurePanel.addVisibilityListener(function (visible) {
            modelStructureButton.setState(visible ? AVU.Button.State.ACTIVE : AVU.Button.State.INACTIVE);
        });
    }

    // Add a second button to toggle the Property Panel.
    var propertyPanelButton = new AVU.Button('toolbar-properties');
    propertyPanelButton.setToolTip('Properties');
    propertyPanelButton.onClick = function(e) {
        if (that.propertyPanel) {
            that.propertyPanel.setVisible(!that.propertyPanel.isVisible());
        }
    };
    propertyPanelButton.addClass('sample-property-panel-button');

    // Add visibility callback to Model Structure Panel
    if (that.propertyPanel) {
        that.propertyPanel.addVisibilityListener(function (visible) {
            propertyPanelButton.setState(visible ? AVU.Button.State.ACTIVE : AVU.Button.State.INACTIVE);
        });
    }

    panelToolsGroup.addControl(modelStructureButton);
    panelToolsGroup.addControl(propertyPanelButton);

    this.toolbar.addControl(colorRadioGroup);
    this.toolbar.addControl(panelToolsGroup);

    viewer.container.appendChild(this.toolbar.container);
};

/**
 * Register the extension with the extension manager.
 */
Autodesk.Viewing.theExtensionManager.registerExtension('SampleExtension', Autodesk.Samples.SampleExtension);
