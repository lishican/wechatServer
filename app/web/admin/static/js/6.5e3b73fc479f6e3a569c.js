webpackJsonp([6],{"4VI6":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=n("4YfN"),a=n.n(l),s=n("NcNL"),o=n.n(s),i=n("wJ7o"),r=n.n(i),c=n("9rMa"),u={data:function(){return{dialogVisible:!1,dimension:["智力","协作","表达","记忆","计算"],query:{limit:10,skip:0,problem:null,score:null,dimension:null}}},created:function(){this.$store.dispatch("fetchSchedule",this.query)},methods:{exportExcel:function(){var e=r.a.utils.table_to_book(document.querySelector("#out-table")),t=r.a.write(e,{bookType:"xlsx",bookSST:!0,type:"array"});try{o.a.saveAs(new Blob([t],{type:"application/octet-stream"}),"sheetjs.xlsx")}catch(e){"undefined"!=typeof console&&console.log(e,t)}return t},handleSizeChange:function(e){console.log(e),this.query.limit=e,this.$store.dispatch("fetchSchedule",this.query)},handleCurrentChange:function(e){console.log("handleCurrentChange"),console.log(e),this.query.skip=(e-1)*this.query.limit,this.$store.dispatch("fetchSchedule",this.query)},search:function(){console.log(this.query),this.$store.dispatch("fetchSchedule",this.query)},reset:function(){this.query={limit:10,skip:0,problem:null,score:null,dimension:null},this.$store.dispatch("fetchSchedule",this.query)},statusf:function(e,t){return["","线上","待定"][e.status]},editById:function(e){var t=e.id;this.$router.push({name:"busScheduleUpdate",params:{id:t}})},del:function(e){var t=this;console.log(e),this.$confirm("确认删除吗？").then(function(n){t.$store.dispatch("delSchedule",{id:e.id}).then(function(e){t.$message.success("删除成功"),console.log(e)}).catch(function(e){console.log(e)})}).catch(function(e){})},add:function(){this.$router.push({name:"busScheduleAdd"})}},computed:a()({},Object(c.b)({dataList:"schedules",total:"schedulesTotal"}))},d={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-card",{staticClass:"box-card"},[n("div",{staticClass:"clearfix ",attrs:{slot:"header"},slot:"header"},[n("el-button",{attrs:{type:"primary",round:"",plain:""},on:{click:e.add}},[n("i",{staticClass:"el-icon-circle-plus"}),e._v("添加新线路")])],1),e._v(" "),n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.dataList,border:"",id:"out-table"}},[n("el-table-column",{attrs:{prop:"name",label:"班次编号",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"up_site",label:"上车点",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"down_site",label:"下车点",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"start_site",label:"出发点",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"end_site",label:"目的地",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"price",label:"价格",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"ticket",label:"票数",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{label:"出发时间",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s(e._f("formatT")(t.row.start_time))+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"创建时间",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s(e._f("formatT")(t.row.meta.createAt))+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"是否双程",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s(t.row.is_both?"双程":"单程")+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"back_shcedule_name",label:"返程编号",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(n){e.editById(t.row)}}},[n("i",{staticClass:"el-icon-edit"}),e._v(" 编辑")]),e._v(" "),n("el-button",{attrs:{type:"danger",size:"small"},on:{click:function(n){e.del(t.row)}}},[n("i",{staticClass:"el-icon-delete"}),e._v(" 删除")])]}}])})],1),e._v(" "),n("div",{staticClass:"block"},[n("el-pagination",{attrs:{"page-sizes":[10,20,50],"page-size":10,small:!0,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)],1)},staticRenderFns:[]};var p=n("/Xao")(u,d,!1,function(e){n("YOIE")},"data-v-ab59ede4",null);t.default=p.exports},"5ZaF":function(e,t,n){(e.exports=n("BkJT")(!1)).push([e.i,"\n.pr[data-v-ab59ede4] {\n  float: right;\n  margin-bottom: 20px;\n}\n.row-bg[data-v-ab59ede4] {\n  margin-top: 20px;\n  text-align: center;\n}\n.el-pagination[data-v-ab59ede4] {\n  margin-top: 40px;\n  text-align: center;\n}\n",""])},YOIE:function(e,t,n){var l=n("5ZaF");"string"==typeof l&&(l=[[e.i,l,""]]),l.locals&&(e.exports=l.locals);n("8bSs")("b0487930",l,!0)}});