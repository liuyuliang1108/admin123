<template>
  <div class="app-container">

    <div class="login-container">
      <ces-edit
              ref="cesEdit"
              :that="that"
              :edit-cfg="editForm"
              :edit-data="editData"
              :edit-rules="editRules"
              clearData="清空"
              submitData="提交"
              returnData="返回"
              v-on:clearForm="clearForm"
              v-on:submitForm="submitForm"
      />
    </div>
  </div>
</template>
<script>
  import cesEdit from '@/components/common/Form/editForm'
  export default {
    name: 'PurviewCodeDetail',
    components: {
      cesEdit
    },
    data() {
      return {
        editForm: [
          // { label: '爱好', prop: 'interst', type: 'checkbox', checkboxs: [{ label: '羽毛球', value: 'badminton' }, { label: '篮球', value: 'basketball' }, { label: '女', value: 'F' }], width: '280px' }
        ],
        editData: {
        },
        editRules: {
        },
        pc_id:0,//默认主键id为0 新增
        that: this
      }
    },
    created() {
      var _this = this;
        _this.pc_id = _this.$route.params.pc_id;
      _this.getData();
    },
      mounted: function() {

      },
    methods: {
      //获取初始数据
getData() {
  var _this = this
  _this.util.request(_this, '/purview_code/getFormDataPurviewCode', 'post', {pc_id: _this.pc_id}).then(function (data) {

    console.log(data);
    if (data.stat == 1) {
_this.editForm=data.data.editForm;
_this.editData=data.data.editData;
_this.util.setLocal('editData',data.data.editData);//存储数据
_this.editRules=data.data.editRules;
    }
  })
},
        clearForm(){
    //清空表单数据
            var _this=this;
            _this.editData= _this.util.getLocal('editData');
        }
        ,
        submitForm(post_data,type){
   console.log(post_data);
   console.log(type);
            var _this=this;
            Object.assign(post_data,{submitType:type});
            console.log(post_data);
            _this.util.request(_this, '/purview_code/saveDataPurviewCode', 'post', post_data).then(function (data) {
                console.log(data);
                if (data.stat == 1) {
                    console.log(data);
                }
        })
  },
    }
  }
</script>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  $black:#000000;
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $black;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;

    /deep/.edit-form {
      position: relative;
      max-width: 100%;
      min-width: 45%;
      padding: 15px 15px 0;
      margin: 0 auto;
      overflow: hidden;
    }
  }
</style>
