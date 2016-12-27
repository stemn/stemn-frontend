import './medium-editor-ext-mathjax.scss';

angular.module('modules.medium-editor-ext-mathjax', [
	'modules.mathjax'
]);
angular.module('modules.medium-editor-ext-mathjax').

service('MediumEditorMathjaxExt', function ($rootScope, MathJaxService) {


    this.mathButton = mathButton; // function(scope, element, attrs)
    this.mathPreview = mathPreview; // function(scope, element, attrs)

    /////////////////////////////////////////////////////////////////

    rangy.init();
    function mathButton() {
        return MediumEditor.extensions.button.extend({
          name: 'math',

          tagNames: ['mark'],
          contentDefault: '<b>H</b>',
          contentFA: '<i class="fa fa-superscript"></i>',
          aria: 'Hightlight',
          action: 'highlight',

          init: function () {
            MediumEditor.extensions.button.prototype.init.call(this);

            this.classApplier = rangy.createClassApplier('math', {
              elementTagName: 'mark',
              normalize: true
            });
          },

          handleClick: function (event) {
            this.classApplier.toggleSelection();
          }
        });

    }

    function mathPreview() {
        return MediumEditor.Extension.extend({
            name: 'math-preview',
            hideDelay: 500,
            previewValueSelector: 'a',
            showWhenToolbarIsVisible: false,
            mathElementType: 'mark',

            init: function () {
                this.anchorPreview = this.createPreview();
                this.getEditorOption('elementsContainer').appendChild(this.anchorPreview);
                this.subscribe('editableMouseover', this.handleEditableMouseover.bind(this));
                this.subscribe('editableKeyup', this.handleEditableKeyup.bind(this));
            },


            createPreview: function () {
                var el = this.document.createElement('div');

                el.id = 'medium-editor-anchor-preview-' + this.getEditorId();
                el.className = 'medium-editor-anchor-preview';
                el.innerHTML = this.getTemplate();

                this.on(el, 'click', this.handleClick.bind(this));

                return el;
            },

            getTemplate: function () {
                return '<div class="medium-editor-toolbar-anchor-preview medium-editor-math-preview" id="medium-editor-toolbar-anchor-preview">' +
                    '    <a class="medium-editor-toolbar-anchor-preview-inner"></a>' +
                    '</div>';
            },

            destroy: function () {
                if (this.anchorPreview) {
                    if (this.anchorPreview.parentNode) {
                        this.anchorPreview.parentNode.removeChild(this.anchorPreview);
                    }
                    delete this.anchorPreview;
                }
            },

            hidePreview: function () {
                this.anchorPreview.classList.remove('medium-editor-anchor-preview-active');
                this.activeAnchor = null;
            },

            showPreview: function (anchorEl) {
                if (this.anchorPreview.classList.contains('medium-editor-anchor-preview-active') ||
                    anchorEl.getAttribute('data-disable-preview')) {
                    return true;
                }

                this.anchorPreview.classList.add('medium-toolbar-arrow-over');
                this.anchorPreview.classList.remove('medium-toolbar-arrow-under');

                if (!this.anchorPreview.classList.contains('medium-editor-anchor-preview-active')) {
                    this.anchorPreview.classList.add('medium-editor-anchor-preview-active');
                }

                this.activeAnchor = anchorEl;

                this.positionPreview();
                this.attachPreviewHandlers();

                return this;
            },

            updatePreviewText: function(anchorEl){
                var self = this;
                var currentMathText = anchorEl.textContent;
                if(currentMathText != this.lastMathText){
                    this.renderMath(currentMathText);
                    setTimeout(function(){ self.positionPreview(anchorEl); }, 400);
                }
            },

            positionPreview: function (activeAnchor) {
                activeAnchor = activeAnchor || this.activeAnchor;
                var buttonHeight = this.anchorPreview.offsetHeight,
                    boundary = activeAnchor.getBoundingClientRect(),
                    middleBoundary = (boundary.left + boundary.right) / 2,
                    diffLeft = this.diffLeft,
                    diffTop = this.diffTop,
                    halfOffsetWidth,
                    defaultLeft;

                halfOffsetWidth = this.anchorPreview.offsetWidth / 2;
                var toolbarExtension = this.base.getExtensionByName('toolbar');
                if (toolbarExtension) {
                    diffLeft = toolbarExtension.diffLeft;
                    diffTop = toolbarExtension.diffTop;
                }
                defaultLeft = diffLeft - halfOffsetWidth;

                this.anchorPreview.style.top = Math.round(buttonHeight + boundary.bottom - diffTop + this.window.pageYOffset - this.anchorPreview.offsetHeight) + 'px';
                if (middleBoundary < halfOffsetWidth) {
                    this.anchorPreview.style.left = defaultLeft + halfOffsetWidth + 'px';
                } else if ((this.window.innerWidth - middleBoundary) < halfOffsetWidth) {
                    this.anchorPreview.style.left = this.window.innerWidth + defaultLeft - halfOffsetWidth + 'px';
                } else {
                    this.anchorPreview.style.left = defaultLeft + middleBoundary + 'px';
                }
            },


            renderMath: function(mathText){
                var displayEl = angular.element(this.anchorPreview.querySelector(this.previewValueSelector));
                var $script = angular.element("<script type='math/tex'>")
                    .html(mathText === undefined ? "" : mathText);
                displayEl.empty();
                displayEl.append($script);
                MathJaxService.load().then(function(MathJax){
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, displayEl[0]]);
                })
                this.lastMathText = mathText;
            },



            handleClick: function (event) {
                var anchorExtension = this.base.getExtensionByName('anchor'),
                    activeAnchor = this.activeAnchor;

                if (anchorExtension && activeAnchor) {
                    event.preventDefault();

                    this.base.selectElement(this.activeAnchor);

                    // Using setTimeout + delay because:
                    // We may actually be displaying the anchor form, which should be controlled by delay
//                    this.base.delay(function () {
//                        if (activeAnchor) {
//                            var opts = {
//                                url: activeAnchor.attributes.href.value,
//                                target: activeAnchor.getAttribute('target'),
//                                buttonClass: activeAnchor.getAttribute('class')
//                            };
//                            anchorExtension.showForm(opts);
//                            activeAnchor = null;
//                        }
//                    }.bind(this));
                }

                this.hidePreview();
            },

            handleAnchorMouseout: function () {
                this.anchorToPreview = null;
                this.off(this.activeAnchor, 'mouseout', this.instanceHandleAnchorMouseout);
                this.instanceHandleAnchorMouseout = null;
            },

            handleEditableMouseover: function (event) {
                var target = MediumEditor.util.getClosestTag(event.target, this.mathElementType);
                this.handleEditableGeneric(target);
            },

            handleEditableKeyup: function (event){
                var target = MediumEditor.util.getClosestTag(this.getSelectionStart(), this.mathElementType);
                this.handleEditableGeneric(target);
            },

            handleEditableGeneric: function(target){
                if (false === target) {
                    return;
                }
                // only show when toolbar is not present
                var toolbar = this.base.getExtensionByName('toolbar');
                if (!this.showWhenToolbarIsVisible && toolbar && toolbar.isDisplayed && toolbar.isDisplayed()) {
                    return true;
                }

                // detach handler for other anchor in case we hovered multiple anchors quickly
                if (this.activeAnchor && this.activeAnchor !== target) {
                    this.detachPreviewHandlers();
                }

                this.anchorToPreview = target;

                this.instanceHandleAnchorMouseout = this.handleAnchorMouseout.bind(this);
                this.on(this.anchorToPreview, 'mouseout', this.instanceHandleAnchorMouseout);
                // Using setTimeout + delay because:
                // - We're going to show the anchor preview according to the configured delay
                //   if the mouse has not left the anchor tag in that time
                this.base.delay(function () {
                    if (this.anchorToPreview) {
                        this.showPreview(this.anchorToPreview);
                        this.updatePreviewText(this.anchorToPreview);
                    }
                }.bind(this));
            },

            getSelectionStart: function () {
               var node = document.getSelection().anchorNode;
               return (node.nodeType == 3 ? node.parentNode : node);
            },

            handlePreviewMouseover: function () {
                this.lastOver = (new Date()).getTime();
                this.hovering = true;
            },

            handlePreviewMouseout: function (event) {
                if (!event.relatedTarget || !/anchor-preview/.test(event.relatedTarget.className)) {
                    this.hovering = false;
                }
            },

            updatePreview: function () {
                if (this.hovering) {
                    return true;
                }
                var durr = (new Date()).getTime() - this.lastOver;
                if (durr > this.hideDelay) {
                    // hide the preview 1/2 second after mouse leaves the link
                    this.detachPreviewHandlers();
                }
            },

            detachPreviewHandlers: function () {
                // cleanup
                clearInterval(this.intervalTimer);
                if (this.instanceHandlePreviewMouseover) {
                    this.off(this.anchorPreview, 'mouseover', this.instanceHandlePreviewMouseover);
                    this.off(this.anchorPreview, 'mouseout', this.instanceHandlePreviewMouseout);
                    if (this.activeAnchor) {
                        this.off(this.activeAnchor, 'mouseover', this.instanceHandlePreviewMouseover);
                        this.off(this.activeAnchor, 'mouseout', this.instanceHandlePreviewMouseout);
                    }
                }

                this.hidePreview();

                this.hovering = this.instanceHandlePreviewMouseover = this.instanceHandlePreviewMouseout = null;
            },

            // TODO: break up method and extract out handlers
            attachPreviewHandlers: function () {
                this.lastOver = (new Date()).getTime();
                this.hovering = true;

                this.instanceHandlePreviewMouseover = this.handlePreviewMouseover.bind(this);
                this.instanceHandlePreviewMouseout = this.handlePreviewMouseout.bind(this);

                this.intervalTimer = setInterval(this.updatePreview.bind(this), 200);

                this.on(this.anchorPreview, 'mouseover', this.instanceHandlePreviewMouseover);
                this.on(this.anchorPreview, 'mouseout', this.instanceHandlePreviewMouseout);
                this.on(this.activeAnchor, 'mouseover', this.instanceHandlePreviewMouseover);
                this.on(this.activeAnchor, 'mouseout', this.instanceHandlePreviewMouseout);
            }
        });
    }

});
