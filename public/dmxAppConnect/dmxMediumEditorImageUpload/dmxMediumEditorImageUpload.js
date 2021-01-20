/*!
 DMXzone Medium Editor Image Upload
 Version: 1.0.1
 (c) 2020 DMXzone.com
 @build 2020-02-27 17:22:51
 */
dmx.mediumEditor.Extension("image-drag-drop",{init:function(){MediumEditor.Extension.prototype.init.apply(this,arguments),this.subscribe("addElement",this.onAddElement.bind(this)),this.subscribe("editableDrag",this.onDrag.bind(this)),this.subscribe("editableDrop",this.onDrop.bind(this))},onAddElement:function(t,e){this.on(e,"dragstart",this.onDragStart.bind(this))},onDragStart:function(t){if("IMG"==t.target.tagName){var e=MediumEditor.util.getTopBlockContainer(t.target);if(e.classList.contains("medium-editor-image-upload"))return void(this.dragging=e)}this.dragging=null,t.preventDefault(),t.stopPropagation()},onDrag:function(t){t.preventDefault(),t.stopPropagation(),t.dataTransfer.files.length&&(t.dataTransfer.dropEffect="copy");var e=MediumEditor.util.getTopBlockContainer(t.target);e&&(e.classList.remove("medium-editor-image-upload-drop"),"dragover"===t.type&&(MediumEditor.util.isMediumEditorElement(e)||e.classList.add("medium-editor-image-upload-drop")))},onDrop:function(t){t.preventDefault(),t.stopPropagation();var e=MediumEditor.util.getTopBlockContainer(t.target);if(e)if(e.classList.remove("medium-editor-image-upload-drop"),t.dataTransfer.files.length){var i=this.base.getExtensionByName("image-upload");if(!i)return void this.base.getExtensionByName("alert").show("Error getting image upload extension.");if(!MediumEditor.util.isMediumEditorElement(e)){var o=t.dataTransfer.files;if(!i.multiple&&1<o.length)return void this.base.getExtensionByName("alert").show("Only 1 file please!");for(var n=0;n<o.length;n++){var a=o[n];i.validateFile(a)&&i.insertImage(e,a)}}}else this.dragging&&e.parentNode.insertBefore(this.dragging,e);this.dragging=null}}),dmx.mediumEditor.InsertButton("image-upload",{contentDefault:"<b>IMG</b>",contentFA:'<i class="fa fa-camera"></i>',multiple:!0,url:"",imageClass:"",figureClass:"",captionClass:"",buttons:["imageLeft","imageCenter","imageRight","imageFull","imageDelete"],init:function(){dmx.mediumEditor.insertButton.prototype.init.apply(this,arguments),dmx.mediumEditor.states.figcaption={buttons:["bold","italic","underline","strikethrough","subscript","superscript","anchor","removeFormat"],checkState:function(t){return"FIGCAPTION"==t.nodeName}},dmx.mediumEditor.states.image={buttons:this.buttons,checkState:function(t){return"IMG"==t.nodeName}},this.subscribe("editableClick",this.onClick.bind(this)),this.subscribe("editableKeydownDelete",this.onDelete.bind(this))},onClick:function(t){if(t.target&&"IMG"==t.target.nodeName){var e=this.document.createRange();e.selectNode(t.target);var i=this.document.getSelection();i.removeAllRanges(),i.addRange(e),this.base.checkContentChanged()}},onDelete:function(t){this.isImageSelected()&&(t.preventDefault(),this.deleteImage())},setContent:function(t){return t.replace(/<div([^>]*)>\s*<figure/gi,'<div$1 contenteditable="false"><figure').replace(/<figcaption([^>]*)>/gi,'<figcaption$1 contenteditable="true">').replace(/<\/div>\s*$/gi,"</div><p><br></p>")},getContent:function(t){return t.replace(/contenteditable="[^"]*"/gi,"").replace(/\s*<p[^>]*>\s*<br[^>]*>\s*<\/p[^>]*>\s*$/gi,"")},isImageSelected:function(){return"IMG"==MediumEditor.selection.getSelectedParentElement(MediumEditor.selection.getSelectionRange(this.document)).nodeName},deleteImage:function(){var t=MediumEditor.util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(this.document)),e=t.nextSibling;t.parentNode.removeChild(t),MediumEditor.selection.select(this.document,e),this.base.checkContentChanged()},insertHTML:function(n){var t=this.document.createElement("input");t.style.display="none",t.multiple=this.multiple,t.type="file",this.on(t,"change",function(t){for(var e=t.target.files,i=0;i<e.length;i++){var o=e[i];if(!this.multiple&&1<e.length)return void this.base.getExtensionByName("alert").show("Only 1 file please!");this.validateFile(o)&&this.insertImage(n,o)}}.bind(this)),this.getEditorOption("elementsContainer").appendChild(t),t.click()},insertImage:function(i,t){if(this.url){var e=new FormData;e.append("image",t,t.name);var o=new XMLHttpRequest;o.open("POST",this.url,!0),o.send(e),o.onload=function(){if(200==o.status){var t=o.responseText;try{t=JSON.parse(t)}catch(t){return void this.base.getExtensionByName("alert").show("Invalid response from server.")}var e=dmx.parse("url",new dmx.DataScope(t,this));i.insertAdjacentHTML("beforebegin",this.createHtml(e)),this.setSelection()}else{this.base.getExtensionByName("alert").show("Error uploading image.")}}.bind(this)}else{var n=new FileReader;n.onload=function(t){i.insertAdjacentHTML("beforebegin",this.createHtml(t.target.result)),this.setSelection()}.bind(this),n.readAsDataURL(t)}},validateFile:function(t){return!!t.type.match("image.*")},createHtml:function(t){return'<div contenteditable="false" class="medium-editor-image-upload medium-editor-image-upload-center"><figure class="'+this.figureClass+'"><img class="'+this.imageClass+'" src="'+t+'"><figcaption class="'+this.captionClass+'" contenteditable="true" data-placeholder="Image caption"></figcaption></figure></div>'}}),dmx.mediumEditor.Button("imageLeft",{contentDefault:"<b>Left</b>",contentFA:'<i class="fa fa-align-left"></i>',action:"float-left",aria:"Align image left",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},isAlreadyApplied:function(t){return t.classList.contains("medium-editor-image-upload-left")},handleClick:function(t){var e=MediumEditor.util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(this.document));e.classList.contains("medium-editor-image-upload")&&(e.classList.remove("medium-editor-image-upload-right","medium-editor-image-upload-center","medium-editor-image-upload-full"),e.classList.add("medium-editor-image-upload-left")),this.updateToolbar()},updateToolbar:function(){var t=this.base.getExtensionByName("image-toolbar");t&&t.checkState()}}),dmx.mediumEditor.Button("imageRight",{contentDefault:"<b>Right</b>",contentFA:'<i class="fa fa-align-right"></i>',action:"float-right",aria:"Align image right",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},isAlreadyApplied:function(t){return t.classList.contains("medium-editor-image-upload-right")},handleClick:function(t){var e=MediumEditor.util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(this.document));e.classList.contains("medium-editor-image-upload")&&(e.classList.remove("medium-editor-image-upload-left","medium-editor-image-upload-center","medium-editor-image-upload-full"),e.classList.add("medium-editor-image-upload-right")),this.updateToolbar()},updateToolbar:function(){var t=this.base.getExtensionByName("image-toolbar");t&&t.checkState()}}),dmx.mediumEditor.Button("imageCenter",{contentDefault:"<b>Center</b>",contentFA:'<i class="fa fa-align-center"></i>',action:"image-center",aria:"Align image center",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},isAlreadyApplied:function(t){return t.classList.contains("medium-editor-image-upload-center")},handleClick:function(t){var e=MediumEditor.util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(this.document));e.classList.contains("medium-editor-image-upload")&&(e.classList.remove("medium-editor-image-upload-left","medium-editor-image-upload-right","medium-editor-image-upload-full"),e.classList.add("medium-editor-image-upload-center")),this.updateToolbar()},updateToolbar:function(){var t=this.base.getExtensionByName("image-toolbar");t&&t.checkState()}}),dmx.mediumEditor.Button("imageFull",{contentDefault:"<b>100%</b>",contentFA:'<i class="fa fa-align-justify"></i>',action:"image-full",aria:"Image full width",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},isAlreadyApplied:function(t){return t.classList.contains("medium-editor-image-upload-full")},handleClick:function(t){var e=MediumEditor.util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(this.document));e.classList.contains("medium-editor-image-upload")&&(e.classList.remove("medium-editor-image-upload-left","medium-editor-image-upload-right","medium-editor-image-upload-center"),e.classList.add("medium-editor-image-upload-full")),this.updateToolbar()},updateToolbar:function(){var t=this.base.getExtensionByName("image-toolbar");t&&t.checkState()}}),dmx.mediumEditor.Button("imageDelete",{contentDefault:"<b>Remove</b>",contentFA:'<i class="fa fa-trash"></i>',action:"delete-image",aria:"Remove image",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},handleClick:function(t){var e=MediumEditor.util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(this.document)),i=e.nextSibling;e.parentNode.removeChild(e),MediumEditor.selection.select(this.document,i),this.updateToolbar(),this.base.checkContentChanged()},updateToolbar:function(){var t=this.base.getExtensionByName("image-toolbar");t&&t.checkState()}}),dmx.mediumEditor.Extension("image-toolbar",{align:"center",allowMultiParagraphSelection:!0,buttons:["imageLeft","imageCenter","imageRight","imageFull","imageDelete"],diffLeft:0,diffTop:-10,firstButtonClass:"medium-editor-button-first",lastButtonClass:"medium-editor-button-last",standardizeSelectionStart:!1,static:!1,sticky:!1,stickyTopOffset:0,updateOnEmptySelection:!1,relativeContainer:null,init:function(){MediumEditor.Extension.prototype.init.apply(this,arguments),this.initThrottledMethods(),this.relativeContainer?this.relativeContainer.appendChild(this.getToolbarElement()):this.getEditorOption("elementsContainer").appendChild(this.getToolbarElement())},forEachExtension:function(e,i){return this.base.extensions.forEach(function(t){if(t!==this)return e.apply(i||this,arguments)},this)},createToolbar:function(){var t=this.document.createElement("div");return t.id="medium-editor-image-toolbar-"+this.getEditorId(),t.className="medium-editor-toolbar",this.static?t.className+=" static-toolbar":this.relativeContainer?t.className+=" medium-editor-relative-toolbar":t.className+=" medium-editor-stalker-toolbar",t.appendChild(this.createToolbarButtons()),this.attachEventHandlers(),t},createToolbarButtons:function(){var e,i,t,o,n,a,s=this.document.createElement("ul");return s.id="medium-editor-toolbar-actions"+this.getEditorId(),s.className="medium-editor-toolbar-actions",s.style.display="block",this.buttons.forEach(function(t){a="string"==typeof t?(n=t,null):(n=t.name,t),(o=this.base.addBuiltInExtension(n,a))&&"function"==typeof o.getButton&&(i=o.getButton(this.base),e=this.document.createElement("li"),MediumEditor.util.isElement(i)?e.appendChild(i):e.innerHTML=i,s.appendChild(e))},this),0<(t=s.querySelectorAll("button")).length&&(t[0].classList.add(this.firstButtonClass),t[t.length-1].classList.add(this.lastButtonClass)),s},destroy:function(){this.toolbar&&(this.toolbar.parentNode&&this.toolbar.parentNode.removeChild(this.toolbar),delete this.toolbar)},getInteractionElements:function(){return[this.getToolbarElement()]},getToolbarElement:function(){return this.toolbar||(this.toolbar=this.createToolbar()),this.toolbar},getToolbarActionsElement:function(){return this.getToolbarElement().querySelector(".medium-editor-toolbar-actions")},initThrottledMethods:function(){this.throttledPositionToolbar=MediumEditor.util.throttle(function(){this.base.isActive&&this.positionToolbarIfShown()}.bind(this))},attachEventHandlers:function(){this.subscribe("blur",this.handleBlur.bind(this)),this.subscribe("focus",this.handleFocus.bind(this)),this.subscribe("editableClick",this.handleEditableClick.bind(this)),this.subscribe("editableKeyup",this.handleEditableKeyup.bind(this)),this.on(this.document.documentElement,"mouseup",this.handleDocumentMouseup.bind(this)),this.static&&this.sticky&&this.on(this.window,"scroll",this.handleWindowScroll.bind(this),!0),this.on(this.window,"resize",this.handleWindowResize.bind(this))},handleWindowScroll:function(){this.positionToolbarIfShown()},handleWindowResize:function(){this.throttledPositionToolbar()},handleDocumentMouseup:function(t){if(t&&t.target&&MediumEditor.util.isDescendant(this.getToolbarElement(),t.target))return!1;this.checkState()},handleEditableClick:function(){setTimeout(function(){this.checkState()}.bind(this),0)},handleEditableKeyup:function(){this.checkState()},handleBlur:function(){clearTimeout(this.hideTimeout),clearTimeout(this.delayShowTimeout),this.hideTimeout=setTimeout(function(){this.hideToolbar()}.bind(this),1)},handleFocus:function(){this.checkState()},isDisplayed:function(){return this.getToolbarElement().classList.contains("medium-editor-toolbar-active")},showToolbar:function(){clearTimeout(this.hideTimeout),this.isDisplayed()||(this.getToolbarElement().classList.add("medium-editor-toolbar-active"),this.trigger("showToolbar",{},this.base.getFocusedElement()))},hideToolbar:function(){this.isDisplayed()&&(this.getToolbarElement().classList.remove("medium-editor-toolbar-active"),this.trigger("hideToolbar",{},this.base.getFocusedElement()))},isToolbarDefaultActionsDisplayed:function(){return"block"===this.getToolbarActionsElement().style.display},hideToolbarDefaultActions:function(){this.isToolbarDefaultActionsDisplayed()&&(this.getToolbarActionsElement().style.display="none")},showToolbarDefaultActions:function(){this.hideExtensionForms(),this.isToolbarDefaultActionsDisplayed()||(this.getToolbarActionsElement().style.display="block"),this.delayShowTimeout=this.base.delay(function(){this.showToolbar()}.bind(this))},hideExtensionForms:function(){this.forEachExtension(function(t){t.hasForm&&t.isDisplayed()&&t.hideForm()})},multipleBlockElementsSelected:function(){var t=new RegExp("<("+MediumEditor.util.blockContainerElementNames.join("|")+")[^>]*>","g"),e=MediumEditor.selection.getSelectionHtml(this.document).replace(/<[^\/>][^>]*><\/[^>]+>/gim,"").match(t);return!!e&&1<e.length},modifySelection:function(){var t=this.window.getSelection().getRangeAt(0);if(this.standardizeSelectionStart&&t.startContainer.nodeValue&&t.startOffset===t.startContainer.nodeValue.length){var e=MediumEditor.util.findAdjacentTextNodeWithContent(MediumEditor.selection.getSelectionElement(this.window),t.startContainer,this.document);if(e){for(var i=0;0===e.nodeValue.substr(i,1).trim().length;)i+=1;t=MediumEditor.selection.select(this.document,e,i,t.endContainer,t.endOffset)}}},checkState:function(){if(!this.base.preventSelectionUpdates){if(!this.base.getFocusedElement())return this.hideToolbar();var t=MediumEditor.selection.getSelectionElement(this.window);if(!t||-1===this.getEditorElements().indexOf(t)||t.getAttribute("data-disable-toolbar"))return this.hideToolbar();"IMG"==MediumEditor.selection.getSelectedParentElement(MediumEditor.selection.getSelectionRange(this.document)).nodeName&&this.showAndUpdateToolbar(),this.hideToolbar()}},showAndUpdateToolbar:function(){this.modifySelection(),this.setToolbarButtonStates(),this.trigger("positionToolbar",{},this.base.getFocusedElement()),this.showToolbarDefaultActions(),this.setToolbarPosition()},setToolbarButtonStates:function(){this.forEachExtension(function(t){"function"==typeof t.isActive&&"function"==typeof t.setInactive&&t.setInactive()}),this.checkActiveButtons()},checkActiveButtons:function(){var e,i=[],o=null,t=MediumEditor.selection.getSelectionRange(this.document),n=function(t){"function"==typeof t.checkState?t.checkState(e):"function"==typeof t.isActive&&"function"==typeof t.isAlreadyApplied&&"function"==typeof t.setActive&&!t.isActive()&&t.isAlreadyApplied(e)&&t.setActive()};if(t&&(this.forEachExtension(function(t){"function"!=typeof t.queryCommandState||null===(o=t.queryCommandState())?i.push(t):o&&"function"==typeof t.setActive&&t.setActive()}),e=MediumEditor.selection.getSelectedParentElement(t),this.getEditorElements().some(function(t){return MediumEditor.util.isDescendant(t,e,!0)})))for(;e&&(i.forEach(n),!MediumEditor.util.isMediumEditorElement(e));)e=e.parentNode},positionToolbarIfShown:function(){this.isDisplayed()&&this.setToolbarPosition()},setToolbarPosition:function(){var t=this.base.getFocusedElement(),e=this.window.getSelection();if(!t)return this;!this.static&&e.isCollapsed||(this.relativeContainer||(this.static?this.positionStaticToolbar(t):this.positionToolbar(e)),this.trigger("positionedToolbar",{},this.base.getFocusedElement()),this.showToolbar())},positionStaticToolbar:function(t){this.getToolbarElement().style.left="0";var e,i=this.document.documentElement&&this.document.documentElement.scrollTop||this.document.body.scrollTop,o=this.window.innerWidth,n=this.getToolbarElement(),a=t.getBoundingClientRect(),s=a.top+i,l=a.left+a.width/2,r=n.offsetHeight,d=n.offsetWidth,u=d/2;switch(this.sticky?i>s+t.offsetHeight-r-this.stickyTopOffset?(n.style.top=s+t.offsetHeight-r+"px",n.classList.remove("medium-editor-sticky-toolbar")):i>s-r-this.stickyTopOffset?(n.classList.add("medium-editor-sticky-toolbar"),n.style.top=this.stickyTopOffset+"px"):(n.classList.remove("medium-editor-sticky-toolbar"),n.style.top=s-r+"px"):n.style.top=s-r+"px",this.align){case"left":e=a.left;break;case"right":e=a.right-d;break;case"center":e=l-u}e<0?e=0:o<e+d&&(e=o-Math.ceil(d)-1),n.style.left=e+"px"},positionToolbar:function(t){this.getToolbarElement().style.left="0",this.getToolbarElement().style.right="initial";var e=t.getRangeAt(0),i=e.getBoundingClientRect();(!i||0===i.height&&0===i.width&&e.startContainer===e.endContainer)&&(i=1===e.startContainer.nodeType&&e.startContainer.querySelector("img")?e.startContainer.querySelector("img").getBoundingClientRect():e.startContainer.getBoundingClientRect());var o,n,a=this.window.innerWidth,s=this.getToolbarElement(),l=s.offsetHeight,r=s.offsetWidth/2,d=this.diffLeft-r,u=this.getEditorOption("elementsContainer"),c=-1<["absolute","fixed"].indexOf(window.getComputedStyle(u).getPropertyValue("position")),m={},h={};c?(n=u.getBoundingClientRect(),["top","left"].forEach(function(t){h[t]=i[t]-n[t]}),h.width=i.width,h.height=i.height,i=h,a=n.width,m.top=u.scrollTop):m.top=this.window.pageYOffset,o=i.left+i.width/2,m.top+=i.top-l,i.top<50?(s.classList.add("medium-toolbar-arrow-over"),s.classList.remove("medium-toolbar-arrow-under"),m.top+=50+i.height-this.diffTop):(s.classList.add("medium-toolbar-arrow-under"),s.classList.remove("medium-toolbar-arrow-over"),m.top+=this.diffTop),o<r?(m.left=d+r,m.right="initial"):a-o<r?(m.left="auto",m.right=0):(m.left=d+o,m.right="initial"),["top","left","right"].forEach(function(t){s.style[t]=m[t]+(isNaN(m[t])?"":"px")})}});
//# sourceMappingURL=../maps/dmxMediumEditorImageUpload.js.map
