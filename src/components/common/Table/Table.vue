<!--表格组件 -->
<template>
<section class="ces-table-page">
  <!-- 表格操作按钮 -->
    <!-- 数据表格 -->
    <section class="ces-table">
        <el-table
          :data='tableData'
          :size='size'
          :border='isBorder'
          @select='select'
          @select-all='selectAll'
          v-loading='listLoading'
          :defaultSelections='defaultSelections'
          :height="tableHeight"
          ref="cesTable">
            <el-table-column v-if="isSelection" type="selection" align="center" ></el-table-column>
            <el-table-column v-if="isIndex" type="index" :label="indexLabel" align="center" width="50"></el-table-column>
            <!-- 数据栏 -->
            <el-table-column v-for="item in tableCols" 
              :key="item.id"
              :prop="item.prop" 
              :label="item.label" 
              :width="item.width"
              :align="item.align" 
              :render-header="item.require?renderHeader:null"
              >
                <template slot-scope="scope" >
                  <!-- html -->
                  <span v-if="item.type==='html'" v-html="item.html(scope.row)"></span>

                    <!--操作-->
                    <slot name="action" :row="scope.row" v-if="item.type==='action'" >
                    </slot>

                  <!-- 输入框 -->
                  <el-input v-if="item.type==='input'" v-model="scope.row[item.prop]" :size="size || btn.size"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)"
                    @focus="item.focus && item.focus(scope.row)"></el-input>
                  <!-- 下拉框 -->
                  <el-select v-if="item.type==='select'" v-model="scope.row[item.prop]" :size="size || btn.size"  :props="item.props"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" 
                    @change='item.change && item.change(that,scope.row)'>
                      <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value"></el-option>
                  </el-select>
                  <!-- 单选 -->
                  <el-radio-group v-if="item.type==='radio'" v-model="scope.row[item.prop]"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(that,scope.row)'>
                      <el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
                  </el-radio-group>
                  <!-- 复选框 -->
                  <el-checkbox-group v-if="item.type==='checkbox'" v-model="scope.row[item.prop]" 
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(that,scope.row)'>
                      <el-checkbox v-for="ra in item.checkboxs" :label="ra.value" :key='ra.value'>{{ra.label}}</el-checkbox>
                  </el-checkbox-group>
                  <!-- 评价 -->
                  <el-rate v-if="item.type==='rate'" v-model="scope.row[item.prop]"
                    :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(scope.row)'></el-rate>
                  <!-- 开关 -->
                  <el-switch v-if="item.type==='switch'" v-model="scope.row[item.prop]" :size="size || btn.size" 
                    :active-value='item.values&&item.values[0]'
                    :inactive-value='item.values&&item.values[1]'
                    :disabled="item.isDisabled && item.isDisabled(scope.row)"
                    @change='item.change && item.change(scope.row)'></el-switch>
                  <!-- 图像 -->
                  <img v-if="item.type==='image'" :src="scope.row[item.prop]" @click="item.handle && item.handle(scope.row)"/>
                  <!-- 滑块 -->
                  <el-slider v-if="item.type==='slider'" v-model="scope.row[item.prop]" 
                  :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size" 
                    @change='item.change && item.change(scope.row)'></el-slider>
                  <!-- 默认 -->
                  <span v-if="!item.type" 
                    :style="item.itemStyle && item.itemStyle(scope.row)" :size="size || btn.size" 
                    :class="item.itemClass && item.item.itemClass(scope.row)">{{(item.formatter && item.formatter(scope.row)) || scope.row[item.prop]}}</span>
                </template>
              </el-table-column>

        </el-table>
    </section>
    <!-- 分页 -->
    <section class="ces-pagination"  v-if='isPagination'>
        <el-pagination style='display: flex;justify-content: center;height: 100%;align-items: center;'
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total,sizes ,prev, pager, next,jumper"
            :page-size="listQuery.limit"
            :current-page="listQuery.page"
            :total="total"
        ></el-pagination>
    </section>
</section>
</template>

<script>

export default {
  props:{
    that: { type: Object, default: this },
    // 表格型号：mini,medium,small
    size:{type:String,default:'medium'},
    isBorder:{type:Boolean,default:true},
      listLoading:{type:Boolean,default:false},
    // 表格数据
    tableData:{ type:Array,default:()=>[]},
    // 表格列配置
    tableCols:{ type:Array,default:()=>[]},
    // 是否显示表格复选框
    isSelection:{type:Boolean,default:false},
    defaultSelections:{ type:[Array,Object], default:()=>null},
    // 是否显示表格索引
    isIndex:{type:Boolean,default:false},
    indexLabel: {type:String,default:'序号'},
    // 是否显示分页
    isPagination:{type:Boolean,default:true},
    // 分页数据
      listQuery:{ type:Object,default:()=>({limit:20,page:1})},
      //总数
      total: {
          type: Number,
          default: 0
      },
  },
  data(){
    return {
    }
  },
  watch:{
    'defaultSelections'(val) {
        this.$nextTick(function(){
          if(Array.isArray(val)){
            val.forEach(row=>{
              this.$refs.cesTable.toggleRowSelection(row)
            })
          }else{
            this.$refs.cesTable.toggleRowSelection(val)
          }
        })      
    }
  },
    computed: {
      //计算表格高度
        tableHeight:function(){
            console.log(window.innerHeight);
            let need_height=140;
            need_height=this.isPagination?need_height+30:need_height;
            return this.isPagination?(window.innerHeight-need_height)+'px':(window.innerHeight-need_height)+'px';
        }
    },
  methods:{
    // 表格勾选
    select(rows,row){
      this.$emit('select',rows,row);
    },
    // 全选
    selectAll(rows){
      this.$emit('select',rows)
    },
    // 
    handleCurrentChange(val){
      this.listQuery.page = val;
      this.$emit('refresh',this.listQuery);
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.$emit('refresh',this.listQuery);
    },
    
    // tableRowClassName({rowIndex}) {
    //     if (rowIndex % 2 === 0) {
    //         return "stripe-row";
    //     }
    //     return "";
    // }
    renderHeader(h,obj) {
      return h('span',{class:'ces-table-require'},obj.column.label)
    },
  },
}
</script>
<style>
.ces-table-require::before{
  content:'*';
  color:red;
}
</style>