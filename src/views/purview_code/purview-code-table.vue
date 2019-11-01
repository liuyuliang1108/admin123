<template>
  <div class="app-container">
      <!--筛选操作-->
      <div class="filter-container">
          <el-input v-model="listQuery.keyword" placeholder="权限码/标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.pc_status" placeholder="启用状态" clearable style="width: 110px" class="filter-item">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.label+'('+item.value+')'" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.pc_pctid" placeholder="所属层级" clearable style="width: 110px" class="filter-item">
              <el-option v-for="item in pc_pctid_options" :key="item.key" :label="item.label+'('+item.extra_attr+')'" :value="item.value" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
              添加
          </el-button>
      </div>
      <!-- 操作表格 -->
      <ces-table
              :that='that'
              size='mini'
              :isSelection='true'
              :isIndex='true'
              :isPagination='true'
              :isHandle='true'
              :tableData='tableData'
              :tableCols='tableCols'
              :listQuery='listQuery'
              :total='total'
              :listLoading='listLoading'
              v-on:refresh="refresh"
      >
          <template slot="action" slot-scope="props">
              <el-button
                      type="primary"
                      size="small"
                      icon="el-icon-edit"
                      @click="editData(props.row.pc_id)"
              >
                  编辑
              </el-button>
          </template>
      </ces-table>
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import cesTable from '@/components/common/Table/Table'

export default {
  name: 'InlineEditTable',
  components: {
      cesTable,
  },
    directives: { waves },
  data() {
    return {
        listLoading: true,
        tableData: [],
        tableCols: [],
        listQuery: {
            page: 1,
            limit: 20,
            pc_status: undefined,//状态值
            keyword: undefined,
            pc_pctid: undefined,
        },
        total: 0,//默认为0
        that: this,
        statusOptions: [],
        pc_pctid_options: [],
    }
  },
  created() {

  }
  ,mounted() {
        var _this = this;
        _this.getData();
  },
  methods: {
      //获取数据
      getData() {
          var _this = this;
          _this.listLoading = true;
          _this.util.request(_this, '/purview_code/getDataPurviewCode', 'post',_this.listQuery).then(function (data) {
              _this.listLoading = false;
              console.log(data);
              if (data.stat == 1) {
                  _this.tableData=data.data;
                  _this.tableCols=data.tableCols;
                  _this.total=data.total;
                  _this.statusOptions=data.statusOptions;
                  _this.pc_pctid_options=data.pc_pctid_options;
              }
          })
      },
      //刷新数据
      refresh(listQuery){
          var _this=this;
          _this.listQuery=listQuery;
          _this.getData();
      },
      //编辑
      editData(pc_id){
          this.$router.push({ path: "/pruview_code/purview-code-edit/"+pc_id})
      },
      handleFilter() {
          this.listQuery.page = 1
          this.getData()
      },
      handleCreate() {
          var _this = this
          _this.$router.push({ path: "/pruview_code/purview-code-create"})

      },
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
