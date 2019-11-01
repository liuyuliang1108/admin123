<!-- 搜索表单 -->
<template>
  <el-form ref="editForm" :size="size" inline  :model="editData" :rules="editRules"  class="edit-form">
      <sticky :z-index="10" class="postInfo-container">
          <el-button v-if="submitData" style="margin-left: 10px;" type="success" @click="submitForm(1)">
              {{submitData}}
          </el-button>

          <el-button v-if="submitData1" style="margin-left: 10px;" type="primary" @click="submitForm(2)">
              {{submitData1}}
          </el-button>

          <el-button v-if="clearData" type="warning" @click="clearForm">
              {{clearData}}
          </el-button>

          <el-button v-if="returnData" type="info" @click="returnPage">
              {{returnData}}
          </el-button>

      </sticky>
    <el-form-item v-for="(item,index) in editCfg" style="width: 100%" :key="index"  :prop="item.prop" :class="computedClasses[index]" class="material-input__component">
        <label class="el-form-item__label" v-if="item.label">
            {{item.label}}
        </label>
      <!-- 输入框 -->
      <el-input
              class="material-input"
        v-if="item.type==='input'"
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        clearable
              :style="{width: item.width}"
        @change="item.change && item.change(editData[item.prop])"
              @focus="handleMdFocus(index)"
              @blur="handleMdBlur(index)"
      >
        <template v-if="item.prepend" slot="prepend">{{ item.prepend }}</template>
        <template v-if="item.append" slot="append">{{ item.append }}</template>
      </el-input>
      <!-- 文本域 -->
      <el-input
        v-if="item.type==='textarea'"
        v-model="editData[item.prop]"
        type="textarea"
        :disabled="item.disabled && item.disabled(editData)"
        :style="{width:item.width}"
        @change="item.change && item.change(editData[item.prop])"
      />
      <!-- 下拉框 -->
      <el-select
        v-if="item.type==='select'"
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
        :width="item.width"
      >
        <el-option v-for="op in item.options" :key="op.value" :label="op.label" :value="op.value" />
      </el-select>
      <!-- 单选 -->
      <el-radio-group
        v-if="item.type==='radio'"
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
      >
        <el-radio v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio>
      </el-radio-group>
      <!-- 单选按钮 -->
      <el-radio-group
        v-if="item.type==='radioButton'"
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
      >
        <el-radio-button v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio-button>
      </el-radio-group>
      <!-- 复选框 -->
      <el-checkbox-group
        v-if="item.type==='checkbox'"
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
      >
        <el-checkbox v-for="ch in item.checkboxs" :key="ch.value" :label="ch.value">{{ ch.label }}</el-checkbox>
      </el-checkbox-group>
      <!-- 日期 -->
      <el-date-picker
        v-if="item.type==='date'"
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
      />
      <!-- 时间 -->
      <el-time-select
        v-if="item.type==='time'"
        v-model="editData[item.prop]"
        type=""
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
      />
      <!-- 日期时间 -->
      <el-date-picker
        v-if="item.type==='dateTime'"
        v-model="editData[item.prop]"
        type="datetime"
        :disabled="item.disable && item.disable(editData[item.prop])"
        @change="item.change && item.change(editData[item.prop])"
      />
      <!-- 滑块 -->
      <!-- <el-slider v-if="item.type==='Slider'" v-model="editData[item.prop]"></el-slider> -->
      <!-- 开关 -->
      <el-switch
        v-if="item.type==='switch'"t
        v-model="editData[item.prop]"
        :disabled="item.disabled && item.disabled(editData)"
        @change="item.change && item.change(editData[item.prop])"
      />
        <span class="material-input-bar"  :style="{width: item.width}" />
        <label class="material-label">
            {{item.placeholder}}
        </label>

    </el-form-item>
  </el-form>
</template>

<script>
    import Sticky from '@/components/Sticky' // 粘性header组件
export default {
    components: { Sticky },
    props:{
        labelWidth:{
            type:String,
            default:'100px'
        },
        size:{
            type:String,
            default:'mini'
        },
        editCfg:{
            type:Array,
            default:()=>[]
        },
        editData:{
            type:Object,
            default:()=>{}
        },
        editRules:{
            type:Object,
            default:null
        },
        clearData:{
            type:String,
            default:null
        },
        submitData:{
            type:String,
            default:null
        },
        submitData1:{
            type:String,
            default:null
        },
        returnData:{
            type:String,
            default:null
        },
    },
    data () {
        return {
            that:this,
        };
    },
    computed: {
        computedClasses:function() {
            var need_arr=[];
            var _this=this;
            _this.editCfg.forEach(function(data,index,arr){
                need_arr.push({
                    'material--active': data.focus,
                    'material--disabled': data.disabled,
                    'material--raised': Boolean(data.focus || _this.editData[data.prop]) // has value
                })
            });
            return need_arr
        }
    },
    methods:{
        handleMdFocus(index) {
            console.log(index)
            var _this=this;
            _this.editCfg[index].focus=true;
            if (_this.editCfg[index].placeholder && _this.editCfg[index].placeholder !== '') {
                _this.editCfg[index].fillPlaceHolder = _this.editCfg[index].placeholder
            }
        },
        handleMdBlur(index) {
            var _this=this;
            _this.editCfg[index].focus = false
            _this.editCfg[index].fillPlaceHolder = null
        },

        clearForm(){
            this.$emit("clearForm");
        }, submitForm(type){
            this.$emit("submitForm",this.editData,type);
        },
        returnPage(){
            //返回上一页
            if (window.history.length <= 1) {
                this.$router.push({ path: "/" });
                return false;
            } else {
                this.$router.go(-1);
            }
        }
    },
    created() {

    },
    watch:{

    }

}

</script>

<style lang="scss" scoped>
    // Fonts:
    $font-size-base: 16px;
    $font-size-small: 18px;
    $font-size-smallest: 12px;
    $font-weight-normal: normal;
    $font-weight-bold: bold;
    $apixel: 1px;
    // Utils
    $spacer: 6px;
    $transition: 0.2s ease all;
    $index: 0px;
    $index-has-icon: 30px;
    // Theme:
    $color-white: white;
    $color-grey: #304156;
    $color-grey-light: #C4C4C4;
    $color-blue: #2196F3;
    $color-red: #F44336;
    $color-black: black;
    // Base clases:
    %base-bar-pseudo {
        content: '';
        height: 1px;
        width: 0;
        bottom: 0;
        position: absolute;
        transition: $transition;
    }

    // Mixins:
    @mixin slided-top() {
        top: - ($font-size-base + $spacer);
        left: 0;
        font-size: $font-size-base;
        font-weight: $font-weight-bold;
    }

    // Component:
    .material-input__component {
        margin-top: 25px;
        position: relative;
        * {
            box-sizing: border-box;
        }
        .iconClass {
            .material-input__icon {
                position: absolute;
                left: 0;
                line-height: $font-size-base;
                color: $color-blue;
                top: $spacer;
                width: $index-has-icon;
                height: $font-size-base;
                font-size: $font-size-base;
                font-weight: $font-weight-normal;
                pointer-events: none;
            }
            .material-label {
                left: $index-has-icon;
            }
            .material-input {
                text-indent: $index-has-icon;

            }
        }
        .material-input {
            font-size: $font-size-base;
            padding: $spacer $spacer $spacer - $apixel * 10 $spacer / 2;
            display: block;
            width: 100%;
            border: none;
            line-height: 1;
            border-radius: 0;
            &:focus {
                outline: none;
                border: none;
                border-bottom: 1px solid transparent; // fixes the height issue
            }
        }
        .material-label {
            font-weight: $font-weight-normal;
            position: absolute;
            pointer-events: none;
            left: $index;
            top: 0;
            transition: $transition;
            font-size: $font-size-small;
        }
        .material-input-bar {
            position: relative;
            display: block;
            width: 100%;
            &:before {
                @extend %base-bar-pseudo;
                left: 50%;
            }
            &:after {
                @extend %base-bar-pseudo;
                right: 50%;
            }
        }
        // Disabled state:
        &.material--disabled {
            .material-input {
                border-bottom-style: dashed;
            }
        }
        // Raised state:
        &.material--raised {
            .material-label {
                @include slided-top();
            }
        }
        // Active state:
        &.material--active {
            .material-input-bar {
                &:before,
                &:after {
                    width: 50%;
                }
            }
        }
    }

    .material-input__component {
        background: $color-white;
        /deep/ .el-input__inner{
            color: #3d4145;
        }
        .material-input {
            background: $color-white;
            color: $color-black;
            text-indent: $index;
            border-bottom: 1px solid $color-grey-light;
            /deep/ .el-input__inner{
                border-width: 0px;
                width: 100%;
                color: #3d4145;
                vertical-align:middle;
                caret-color:#2196F3;
            }
        }
        .material-label {
            vertical-align:middle;
            color: $color-grey;
        }
        .material-input-bar {
            &:before,
            &:after {
                background: $color-blue;
            }
        }
        /deep/ div.el-form-item__content{
            width: 100%;
        }

        /deep/ .el-form-item__label{
            width: 100px;
            padding: 6px 0px;
            height: 28px;
            line-height: 14px;
            vertical-align:middle;
            font-size: 14px;
            border-width: 1px;
            border-style: solid;
            border-radius: 2px 0 0 2px;
            text-align: center!important;
            background-color: #FBFBFB;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            box-sizing: border-box;
            cursor: default;
            border-color: #e6e6e6;
            margin-right: 15px;
        }
        // Active state:
        &.material--active {
            .material-label {
                color: $color-blue;
            }
        }
        // Errors:
        &.material--has-errors {
            &.material--active .material-label {
                color: $color-red;
            }
            .material-input-bar {
                &:before,
                &:after {
                    background: transparent;
                }
            }
        }
    }

    .edit-form {
        position: relative;
        max-width: 100%;
        min-width: 45%;
        padding: 15px 15px 0;
        margin: 0 auto;
        overflow: hidden;
        .postInfo-container {
            position: relative;
            /*background-color: #f0f2f5;*/
            margin-bottom: 10px;
            .postInfo-container-item {
                float: left;
            }
        }
    }


</style>
<style>

</style>
