<template>
  <div class="app-container">
    <div class="title-container">
      <h3 class="title">后 台 登 录</h3>
    </div>
    <div class="login-container">
      <ces-edit
        ref="cesEdit"
        :that="that"
        :edit-cfg="editForm"
        :edit-data="editData"
        :edit-rules="editRules"
      />
    </div>
  </div>
</template>
<script>
import cesEdit from '@/components/common/Form/editForm'
export default {
  name: 'TestForm',
  components: {
    cesEdit
  },
  data() {
    return {
      editForm: [
        { label: '姓名', prop: 'name', type: 'input', width: '280px' },
        { label: '年龄', prop: 'age', type: 'input', width: '280px' },
        { label: '性别', prop: 'sex', type: 'radio', radios: [{ label: '男', value: 'M' }, { label: '女', value: 'F' }], width: '280px' },
        { label: '爱好', prop: 'interst', type: 'checkbox', checkboxs: [{ label: '羽毛球', value: 'badminton' }, { label: '篮球', value: 'basketball' }, { label: '女', value: 'F' }], width: '280px' }
      ],
      editData: {
        name: null,
        age: null,
        sex: null,
        interst: []
      },
      editRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      that: this
    }
  },
  created() {

  },
  methods: {

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
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    }
</style>
