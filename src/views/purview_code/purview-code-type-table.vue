<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmSort()">确认排序</el-button>
      <el-input v-model="listQuery.keyword" placeholder="权限码/标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.pct_status" placeholder="启用状态" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name+'('+item.value+')'" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
        <!--reviewer-->
      <!--</el-checkbox>-->
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="list" stripe row-key="pct_id" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.pct_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="原始排序" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.pct_sort }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前排序" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.edit_sort }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="拖拽排序" width="120">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>

      <el-table-column  label="权限类型码">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.pct_code" class="edit-input" size="small" />
            <el-button
                    class="cancel-btn"
                    size="small"
                    icon="el-icon-refresh"
                    type="warning"
                    @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.pct_code }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="权限类型标题">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.pct_title" class="edit-input" size="small" />
            <el-button
                    class="cancel-btn"
                    size="small"
                    icon="el-icon-refresh"
                    type="warning"
                    @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.pct_title }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="权限类型备注">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.pct_remark" class="edit-input" size="small" />
            <el-button
                    class="cancel-btn"
                    size="small"
                    icon="el-icon-refresh"
                    type="warning"
                    @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.pct_remark }}</span>
        </template>
      </el-table-column>



      <el-table-column class-name="status-col" label="启用状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.pct_status_str | statusFilter">
            {{ row.pct_status_str }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button
                  v-if="row.edit"
                  type="success"
                  size="small"
                  icon="el-icon-circle-check-outline"
                  @click="confirmEdit(row)"
          >
            确定
          </el-button>
          <el-button
                  v-else
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>
      <!--分页-->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Sortable from 'sortablejs'

export default {
  name: 'DragTable',
    components: { Pagination },
    directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '启用': 'success',
        // draft: 'info',
        '停用': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,//默认为0
      listLoading: true,
      sortable: null,
      oldList: [],
      newList: [],
      listQuery: {
        page: 1,
        limit: 20,
        pct_status: undefined,//状态值
        keyword: undefined,
        sort: '+id'
      },
      statusOptions: [{ key: '1', name: '启用', value: '1' }, { key: '0', name: '停用', value: '0' }],
        downloadLoading: false,//导出加载
    }
  },
  created() {
    var _this = this
    _this.getList()
  },
  methods: {
    getList() {
      var _this = this
      _this.listLoading = true;
      _this.util.request(_this, '/purview_code_type/PurviewCodeTypeTable','post',_this.listQuery).then(function(data){
        _this.listLoading = false
        console.log(data);
        if(data.stat == 1){
         // const items = data.items
          _this.list = data.data
          _this.total = data.total
          _this.oldList = _this.list.map(v => v.pct_id)
          _this.newList = _this.oldList.slice()
          _this.$nextTick(() => {
            _this.setSort()
          })
          const items = data.data
          _this.list = items.map(v => {
            _this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            _this.$set(v, 'edit_sort', v.pct_sort) // https://vuejs.org/v2/guide/reactivity.html
            v.originalTitle = v.pct_title //  will be used when user click the cancel botton
            v.originalCode = v.pct_code //  will be used when user click the cancel botton
            v.originalRemark = v.pct_remark //  will be used when user click the cancel botton
            return v
          })
        }
      })
    },
    cancelEdit(row) {
      row.pct_title = row.originalTitle
      row.pct_code = row.originalCode
      row.pct_remark = row.originalRemark
      row.edit = false
      this.$message({
        message: '已恢复至原值',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.pct_title
      row.originalCode = row.pct_code
      row.originalRemark = row.pct_remark
      var _this = this
      var param = {
        'pct_id': row.pct_id,
        'pct_title': row.pct_title,
        'pct_code': row.pct_code,
        'pct_remark': row.pct_remark,
      };

      _this.util.request(_this, '/purview_code_type/PurviewCodeTypeTableEdit','post',param).then(function(data){
        console.log(data);
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)

          var _this_list =this.util.deepClone(this.list);
          for (let i = 0, len = _this_list.length; i < len; i++) {
            _this_list[i].edit_sort=this.newList.indexOf(_this_list[i].pct_id)+1
          }
          this.list=_this_list;
        }
      })
    },
    confirmSort() {
      var _this = this
      var param = {
        'newList': _this.newList,
      };
      _this.util.request(_this, '/purview_code_type/PurviewCodeTypeTableSort','post',param).then(function(data){
        console.log(data);
        if(data.stat===7){//重新加载数据
          _this.getList()
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
      resetTemp() {//重置为初始值
          this.temp = {
              pst_id: undefined,
              pst_title:'',
              pst_status:1,
              pst_code:10000,
              pst_sort:0,
              pst_remark: '',
          }
      },

      handleCreate() {
        var _this = this
          _this.resetTemp()
          _this.dialogStatus = 'create'
          _this.dialogFormVisible = true
          _this.$nextTick(() => {
              _this.$refs['dataForm'].clearValidate()
          })
      },
      //格式转换
      formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
              switch (j) {
                  case 'update_time':{
                      return parseTime(v[j]);
                  }
                  case 'pct_status':{
                      var status_arr=['停用','启用'];
                      return status_arr[v[j]];
                  }
                  default:{
                      return v[j]
                  }
              }
          }))
      },
      //导出
      handleDownload() {
        var _this = this;
          _this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['ID', '标题', '权限码', '备注', '状态','排序','更新时间']
              const filterVal = ['pct_id', 'pct_title', 'pct_code', 'pct_remark', 'pct_status', 'pct_sort','update_time']
              const data = _this.formatJson(filterVal, _this.list)
              excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: '权限类型列表'
              })
              _this.downloadLoading = false
          })
      },
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
