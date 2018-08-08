webpackJsonp([10],{"/dSo":function(e,t,n){var r;r=function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){var r,o,i,a;a=function(e,t){"use strict";var n,r=(n=t)&&n.__esModule?n:{default:n};var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.resolveOptions(t),this.initSelection()}return i(e,[{key:"resolveOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=e.action,this.container=e.container,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=""}},{key:"initSelection",value:function(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function(){var e=this,t="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[t?"right":"left"]="-9999px";var n=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=n+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,r.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function(){this.selectedText=(0,r.default)(this.target),this.copyText()}},{key:"copyText",value:function(){var e=void 0;try{e=document.execCommand(this.action)}catch(t){e=!1}this.handleResult(e)}},{key:"handleResult",value:function(e){this.emitter.emit(e?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function(){this.removeFake()}},{key:"action",set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=e,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:"target",set:function(e){if(void 0!==e){if(!e||"object"!==(void 0===e?"undefined":o(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&e.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(e.hasAttribute("readonly")||e.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function(){return this._target}}]),e}();e.exports=a},o=[e,n(7)],void 0===(i="function"==typeof(r=a)?r.apply(t,o):r)||(e.exports=i)},function(e,t,n){var r=n(6),o=n(5);e.exports=function(e,t,n){if(!e&&!t&&!n)throw new Error("Missing required arguments");if(!r.string(t))throw new TypeError("Second argument must be a String");if(!r.fn(n))throw new TypeError("Third argument must be a Function");if(r.node(e))return function(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}(e,t,n);if(r.nodeList(e))return function(e,t,n){return Array.prototype.forEach.call(e,function(e){e.addEventListener(t,n)}),{destroy:function(){Array.prototype.forEach.call(e,function(e){e.removeEventListener(t,n)})}}}(e,t,n);if(r.string(e))return function(e,t,n){return o(document.body,e,t,n)}(e,t,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},function(e,t){function n(){}n.prototype={on:function(e,t,n){var r=this.e||(this.e={});return(r[e]||(r[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){var r=this;function o(){r.off(e,o),t.apply(n,arguments)}return o._=t,this.on(e,o,n)},emit:function(e){for(var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),r=0,o=n.length;r<o;r++)n[r].fn.apply(n[r].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),r=n[e],o=[];if(r&&t)for(var i=0,a=r.length;i<a;i++)r[i].fn!==t&&r[i].fn._!==t&&o.push(r[i]);return o.length?n[e]=o:delete n[e],this}},e.exports=n},function(e,t,n){var r,o,i,a;a=function(e,t,n,r){"use strict";var o=l(t),i=l(n),a=l(r);function l(e){return e&&e.__esModule?e:{default:e}}var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var u=function(e){function t(e,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.resolveOptions(n),r.listenClick(e),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default),c(t,[{key:"resolveOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText,this.container="object"===s(e.container)?e.container:document.body}},{key:"listenClick",value:function(e){var t=this;this.listener=(0,a.default)(e,"click",function(e){return t.onClick(e)})}},{key:"onClick",value:function(e){var t=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new o.default({action:this.action(t),target:this.target(t),text:this.text(t),container:this.container,trigger:t,emitter:this})}},{key:"defaultAction",value:function(e){return f("action",e)}},{key:"defaultTarget",value:function(e){var t=f("target",e);if(t)return document.querySelector(t)}},{key:"defaultText",value:function(e){return f("text",e)}},{key:"destroy",value:function(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],t="string"==typeof e?[e]:e,n=!!document.queryCommandSupported;return t.forEach(function(e){n=n&&!!document.queryCommandSupported(e)}),n}}]),t}();function f(e,t){var n="data-clipboard-"+e;if(t.hasAttribute(n))return t.getAttribute(n)}e.exports=u},o=[e,n(0),n(2),n(1)],void 0===(i="function"==typeof(r=a)?r.apply(t,o):r)||(e.exports=i)},function(e,t){var n=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var r=Element.prototype;r.matches=r.matchesSelector||r.mozMatchesSelector||r.msMatchesSelector||r.oMatchesSelector||r.webkitMatchesSelector}e.exports=function(e,t){for(;e&&e.nodeType!==n;){if("function"==typeof e.matches&&e.matches(t))return e;e=e.parentNode}}},function(e,t,n){var r=n(4);function o(e,t,n,o,i){var a=function(e,t,n,o){return function(n){n.delegateTarget=r(n.target,t),n.delegateTarget&&o.call(e,n)}}.apply(this,arguments);return e.addEventListener(n,a,i),{destroy:function(){e.removeEventListener(n,a,i)}}}e.exports=function(e,t,n,r,i){return"function"==typeof e.addEventListener?o.apply(null,arguments):"function"==typeof n?o.bind(null,document).apply(null,arguments):("string"==typeof e&&(e=document.querySelectorAll(e)),Array.prototype.map.call(e,function(e){return o(e,t,n,r,i)}))}},function(e,t){t.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},t.nodeList=function(e){var n=Object.prototype.toString.call(e);return void 0!==e&&("[object NodeList]"===n||"[object HTMLCollection]"===n)&&"length"in e&&(0===e.length||t.node(e[0]))},t.string=function(e){return"string"==typeof e||e instanceof String},t.fn=function(e){return"[object Function]"===Object.prototype.toString.call(e)}},function(e,t){e.exports=function(e){var t;if("SELECT"===e.nodeName)e.focus(),t=e.value;else if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var n=e.hasAttribute("readonly");n||e.setAttribute("readonly",""),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute("readonly"),t=e.value}else{e.hasAttribute("contenteditable")&&e.focus();var r=window.getSelection(),o=document.createRange();o.selectNodeContents(e),r.removeAllRanges(),r.addRange(o),t=r.toString()}return t}}])},e.exports=r()},ZTh9:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});n("/dSo");var r=n("QmSG"),o=(n("Eq4a"),{data:function(){return{uploadurl:r.a,descjoin:"",showF:!1,isCanSubmit:!0,commonImg:"",formhelp:{problem:"",answers:[],detail:"",cate:"默认",time:10,correctAnswer:""},form:{problem:"",answers:[],detail:"",cate:"默认",time:10,correctAnswer:""},rules:{problem:[{required:!0,message:"请输入问题",trigger:"blur"}],answers:[{type:"array",required:!0,message:"请输入答案",trigger:"blur"}],correctAnswer:[{required:!0,message:"请输入正确答案",trigger:"blur"}],detail:[{required:!0,message:"请上传问题图片",trigger:"change"}]}}},methods:{deleteAnswer:function(e){console.log(e),this.formhelp.answers=this.formhelp.answers.filter(function(t){return t.value!=e.value})},addAnswers:function(){this.formhelp.answers.push({key:(new Date).valueOf()+"",value:""}),console.log(this.formhelp.answers)},onSubmit:function(e){var t=this;return!!this.isCanSubmit&&(this.isCanSubmit=!1,this.form.answers=this.formhelp.answers.map(function(e){return e.value}),-1==this.form.answers.indexOf(this.form.correctAnswer)?(this.$notify({title:"失败",message:"正确答案要和答案选项对应",type:"warning"}),this.isCanSubmit=!0,!1):(console.log(this.form),void this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),t.isCanSubmit=!0,!1;t.$store.dispatch("addProblem",t.form).then(function(e){200==e.code?(t.$notify({title:"成功",message:"题目添加成功",type:"success"}),t.$router.replace({name:"quizProblem"})):t.$notify({title:"参数错误",message:e.msg,type:"error"}),console.log(e)}).catch(function(e){t.$notify({title:"失败",message:"时间只能是数字类型",type:"warning"}),t.isCanSubmit=!0}),console.log(t.form)})))}},mounted:function(){}}),i={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-card",{staticClass:"box-card"},[n("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[n("el-tag",[e._v("添加题目")])],1),e._v(" "),n("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"200px","label-position":"right"}},[n("el-row",[n("el-col",{attrs:{span:18}},[n("el-form-item",{attrs:{label:"题  名",prop:"problem"}},[n("el-input",{attrs:{placeholder:"请输入题目"},model:{value:e.form.problem,callback:function(t){e.$set(e.form,"problem",t)},expression:"form.problem"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"时间",prop:"problem"}},[n("el-input-number",{attrs:{min:5,max:20,label:"描述文字"},model:{value:e.form.time,callback:function(t){e.$set(e.form,"time",t)},expression:"form.time"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"选  项"}},[n("el-row",[e._l(e.formhelp.answers,function(t,r){return n("el-col",{key:r,staticStyle:{"margin-right":"20px","margin-bottom":"20px"},attrs:{span:24}},[n("el-row",{attrs:{gutter:10}},[n("el-col",{attrs:{span:2}},[n("el-tag",[e._v(e._s(r+1))])],1),e._v(" "),n("el-col",{attrs:{span:12}},[n("el-input",{model:{value:t.value,callback:function(n){e.$set(t,"value",n)},expression:"item.value"}})],1),e._v(" "),n("el-col",{attrs:{span:4}},[n("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(n){e.deleteAnswer(t)}}},[e._v("删除")])],1)],1)],1)}),e._v(" "),n("el-col",{staticStyle:{"margin-right":"20px","margin-bottom":"20px"},attrs:{span:7}},[n("el-button",{attrs:{type:"primary"},on:{click:e.addAnswers}},[e._v("添加选项")])],1)],2)],1),e._v(" "),n("el-form-item",{attrs:{label:"正确答案",prop:"correctAnswer"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.correctAnswer,callback:function(t){e.$set(e.form,"correctAnswer",t)},expression:"form.correctAnswer"}},e._l(e.formhelp.answers,function(e,t){return n("el-option",{key:t,attrs:{label:e.value,value:e.value}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"答案解析（答错可见）",prop:"problem"}},[n("el-input",{attrs:{placeholder:"答案解析（答错可见）"},model:{value:e.form.detail,callback:function(t){e.$set(e.form,"detail",t)},expression:"form.detail"}})],1),e._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.onSubmit("form")}}},[e._v("立即创建")])],1)],1)],1)],1)],1)],1)},staticRenderFns:[]},a=n("/Xao")(o,i,!1,null,null,null);t.default=a.exports}});