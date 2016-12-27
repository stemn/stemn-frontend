import './medium-editor-ext-mentions.scss';

angular.module('modules.medium-editor-ext-mentions', [
    'modules.popup',
    'modules.keyboard-navigation'
]);

angular.module('modules.medium-editor-ext-mentions').

service('MediumEditorMentionsExt', function ($rootScope, $timeout, PopupService, CoreLibrary) {

    this.mentions = mentions; // function(scope, element, attrs)

    /////////////////////////////////////////////////////////////////

    function mentions() {
        var scope = $rootScope.$new(true);

        // Scoped functions;
        scope.showPanel         = showPanel;
        scope.hidePanel         = hidePanel;
        scope.mentionSelect     = mentionSelect;

        scope.$watch('showPopup', panelHideOrShow);

        var extraClassName = '';       // Extra className to be added with the `medium-editor-mention-panel` element.
        var extraActiveClassName = ''; // Extra active className to be added with the `medium-editor-mention-panel-active` element.
        var tagName = 'strong';        // Element tag name that would indicate that this mention. It will have medium-editor-mention-at` className applied on it.
        var activeTriggerList= ['@'];
        var triggerClassNameMap= {
            "@": 'mention-at'
        };
        var hideOnBlurDelay= 300;

        return window.MediumEditor.Extension.extend({
            name: 'mention',
            init: function init() {
                initMentionPanel();
                scope.base = this.base;
                this.subscribe('editableKeyup', handleKeyup.bind(this));
            },
            destroy: function destroy() {
                PopupService.destroy(scope.popupEl);
            }
        });

        /////////////////////////////////////////////////

        function initMentionPanel() {
            scope.popupEl = PopupService.create({
                template: '<mention-search class="md-whiteframe-z2"></mention-search>',
                scope: scope
            })
        }

        function handleKeyup(event) {
            var keyCode = window.MediumEditor.util.getKeyCode(event);
            // Ignore Escape, up, down and return keys
            if(keyCode == CoreLibrary.keyCodes.ESCAPE || keyCode == CoreLibrary.keyCodes.UPARROW || keyCode == CoreLibrary.keyCodes.DOWNARROW || keyCode == CoreLibrary.keyCodes.RETURNKEY){
                return
            }
            scope.word    = getWordFromSelection(event.target, 0);
            if (scope.word && scope.word.word) {
                showPanel();
            } else {
                hidePanel();
            }
        }

        function showPanel() {
            PopupService.show(scope);
            scope.activeMention = wrapWordInMentionAt(scope.word, scope);
            PopupService.position({
                popupEl  : scope.popupEl,
                targetEl : scope.activeMention,
                type     : 'start',
                side     : 'bottom',
                padding  : '10px 0 0 0'
            });
        }

        function hidePanel() {
            PopupService.hide(scope);
        }

        function panelHideOrShow() {
            // Panel Hide
            if(!scope.popupShow && scope.activeMention){
                // If the mention element does not have an ID, it is unfinished so we unwrap
                if (!scope.activeMention.getAttribute("id")) {
                    scope.base.saveSelection();
                    unwrapForTextNode(scope.activeMention, document);
                    scope.base.restoreSelection();
                }
                // Else, we have done a successful mention
                else{
                    $timeout(function(){
                        // Put this section in a timeout so when we press return with the mention-list-nav we don't insert a new para in the editor
                        // TODO - Fix this - wierd race condition?

                        // Set the caret after the inserted mention and add a space
                        var selection = window.rangy.getSelection();
                        //create a range object to set the caret positioning for
                        var range = window.rangy.createRange();
                        //get the node of the element you wish to put the caret after
                        var startNode = scope.activeMention;
                        //set the caret after the node for this range
                        range.setStartAfter(startNode);
                        range.setEndAfter(startNode);
                        //apply this range to the selection object
                        selection.removeAllRanges();
                        selection.addRange(range);
                        insertHtmlAfterSelection('&nbsp;', range)
                    }, 500)
                }
            }

        }

        function insertHtmlAfterSelection(html, range) {
            // this function will insert html/text after the caret/range
            // http://stackoverflow.com/questions/3597116/insert-html-after-a-selection
            var node;
            range.collapse(false);
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
        }

        function mentionSelect(id, type, name){
            var mentionId=CoreLibrary.getUuid();
            scope.activeMention.innerHTML = scope.word.trigger + name;
            scope.activeMention.setAttribute('contenteditable', 'false');
            scope.activeMention.setAttribute('id', mentionId);
            // type: mentionId-parentType-parentId
            scope.activeMention.setAttribute('type', mentionId+'-'+type+'-'+id);
            scope.hidePanel();
        }

        function getWordFromSelection(target, initialDiff) {
            var _MediumEditor$selection$getSelectionRange = window.MediumEditor.selection.getSelectionRange(document);

            var startContainer = _MediumEditor$selection$getSelectionRange.startContainer;
            var startOffset = _MediumEditor$selection$getSelectionRange.startOffset;
            var endContainer = _MediumEditor$selection$getSelectionRange.endContainer;
            var endOffset = _MediumEditor$selection$getSelectionRange.endOffset;

            if (startContainer !== endContainer) {
                return;
            }
            var textContent = startContainer.textContent;

            function getWordPosition(_x, _x2) {
                var _again = true;

                _function: while (_again) {
                    var position = _x,
                        diff = _x2;
                    _again = false;

                    var prevText = textContent[position - 1];
                    if (null == prevText || 0 === prevText.trim().length || 0 >= position || textContent.length < position) {
                        return position;
                    } else {
                        _x = position + diff;
                        _x2 = diff;
                        _again = true;
                        prevText = undefined;
                        continue _function;
                    }
                }
            }
            // Ger current word
            var wordCurrentStart  = getWordPosition(startOffset + initialDiff, -1);
            var wordCurrentEnd    = getWordPosition(startOffset + initialDiff, 1) - 1;
            var wordCurrent       = textContent.slice(wordCurrentStart, wordCurrentEnd);
            var wordCurrentFirst  = wordCurrent.slice(0, 1);

            // Ger previous word
            var wordPrevStart     = getWordPosition(wordCurrentStart-1, -1);
            var wordPrevEnd       = wordCurrentStart-1;
            var wordPrev          = textContent.slice(wordPrevStart, wordPrevEnd);
            var wordPrevFirst     = wordPrev.slice(0, 1);

            var word = {};
            if(activeTriggerList.indexOf(wordCurrentFirst) != -1){
                // Current word has an active trigger
                word.wordStart  = wordCurrentStart;
                word.wordEnd    = wordCurrentEnd;
            }
            else if(activeTriggerList.indexOf(wordPrevFirst) != -1){
                // First previous word has an active trigger
                word.wordStart  = wordPrevStart;
                word.wordEnd    = wordCurrentEnd;
            }
            else{
                // No triggers found
                word.wordStart  = 0;
                word.wordEnd    = 0;
            }
            word.word       = textContent.slice(word.wordStart, word.wordEnd);
            word.trigger    = word.word.slice(0, 1);
            word.wordSearch = word.word.substring(1);
            word.triggerClassName = triggerClassNameMap[word.trigger];
            return word;
        }

        function wrapWordInMentionAt(word) {
            var selection = document.getSelection();
            var parentNode = angular.element(selection.anchorNode.parentElement);
            // If the parent node is a mention
            if(parentNode.hasClass(word.triggerClassName)){
                return parentNode[0]
            }
            // If the parent node is not a mention
            else{
                if (selection.rangeCount) {
                    // http://stackoverflow.com/a/6328906/1458162
                    var range = selection.getRangeAt(0).cloneRange();
                    range.setStart(range.startContainer, word.wordStart);
                    range.setEnd(range.startContainer, Math.min(word.wordEnd, range.startContainer.textContent.length));
                    // Instead, insert our own version of it.
                    // TODO: Not sure why, but using <span> tag doens't work here
                    var element = document.createElement(tagName);
                    element.classList.add(word.triggerClassName);

                    //
                    range.surroundContents(element);

                    selection.removeAllRanges();
                    selection.addRange(range);
                    window.MediumEditor.selection.select(document, element.firstChild, word.word.length);

                    // Return the active mention
                    return element
                }
            }
        }

        function unwrapForTextNode(el, doc) {
            var parentNode = el.parentNode,
                prevNode,
                currentNode;
            window.MediumEditor.util.unwrap(el, doc);
            // Merge textNode
            currentNode = parentNode.lastChild;
            while (prevNode = currentNode.previousSibling) {
                if (3 === currentNode.nodeType && 3 === prevNode.nodeType) {
                    prevNode.textContent += currentNode.textContent;
                    parentNode.removeChild(currentNode);
                }
                currentNode = prevNode;
            }
        }
    }

}).

directive('mentionSearch', function (SearchService) {
    return {
        restrict: 'E',
        template: require('./tpls/mention-search.html'),
        controller: function ($scope, $timeout, $document, CoreLibrary) {
            $scope.$watch('word.wordSearch', search);

            //////////////////////////////////

            function search(){
                if($scope.word){
                    SearchService.search({
                        types: ['user', 'project', 'organisation'],
                        key: 'name',
                        value: $scope.word.wordSearch,
                        select: ['name', 'picture']
                    }).then(function (response) {
                        $scope.results = response.data;
                    });
                }
            }
        }
    };
}).

directive("renderMentions", function($timeout, CoreLibrary, $compile) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngBindHtml, process);

            ///////////////

            function process(){
                $timeout(function(){
                    angular.forEach(element[0].querySelectorAll('.mention-at'), function (mentionEl) {
                        mentionEl = angular.element(mentionEl);
                        var mentionInfo    = mentionEl[0].getAttribute('type');
                        if(mentionInfo){
                            var mentionDetails = mentionInfo.split('-');
                            if(mentionDetails.length == 3){
                                var mentionId  = mentionDetails[0];
                                var parentType = mentionDetails[1];
                                var parentId   = mentionDetails[2];
                                var mentionContent = mentionEl[0].textContent;
                                var cardContent    = '<card card-type=\''+parentType+'\' card-id=\''+parentId+'\'></card>';
                                var replacementMentionEl = angular.element('<a class="mention" popup popup-content="'+cardContent+'" id="'+mentionId+'" href="'+CoreLibrary.getHref(parentType, parentId)+'">'+mentionContent+'</a>');
                                $compile(replacementMentionEl)(scope);
                                mentionEl.after(replacementMentionEl);
                                mentionEl.remove();
                            }
                        }
                    });
                },1)
            }
        }
    };
});

