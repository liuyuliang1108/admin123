<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">


      <!--<el-table-column width="120px" align="center" label="权限标题">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.pc_title }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column width="100px" label="Importance">-->
        <!--<template slot-scope="scope">-->
          <!--<svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.pc_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属权限层" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.pc_pctid_str }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="权限码">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.pc_code" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.pc_code }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="权限标题">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.pc_title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.pc_title }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="权限备注">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.pc_remark" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.pc_remark }}</span>
        </template>
      </el-table-column>



      <el-table-column class-name="status-col" label="启用状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.pc_status_str | statusFilter">
            {{ row.pc_status_str }}
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
  </div>
</template>

<script>
import { fetchList } from '@/api/article'

export default {
  name: 'InlineEditTable',
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    //this.getList()
  }
  ,mounted() {
    var _this = this
    _this.getList()
    _this.p = _this.aaaa()
  },
  methods: {
    getList() {
      var _this = this
      _this.listLoading = true;
      _this.util.request(_this, '/purview_code/PurviewCodeTable').then(function(data){
        _this.listLoading = false
        console.log(data);
        if(data.stat == 1){
          const items = data.data
          _this.list = items.map(v => {
            _this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalTitle = v.pc_title //  will be used when user click the cancel botton
            v.originalCode = v.pc_code //  will be used when user click the cancel botton
            v.originalRemark = v.pc_remark //  will be used when user click the cancel botton
            return v
          })
        }
      })
    },
    cancelEdit(row) {
      row.pc_title = row.originalTitle
      row.pc_code = row.originalCode
      row.pc_remark = row.originalRemark
      row.edit = false
      this.$message({
        message: '已恢复至原值',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.pc_title
      row.originalCode = row.pc_code
      row.originalRemark = row.pc_remark
        var _this = this
        var param = {
            'pc_id': row.pc_id,
            'pc_title': row.pc_title,
            'pc_code': row.pc_code,
            'pc_remark': row.pc_remark,
        };

      _this.util.request(_this, '/purview_code/PurviewCodeTableEdit', 'post', param).then(function(data) {
        console.log(data)
      })
    },
    aaaa() {
      var _this = this
      _this.util.getNumber().then(
        function(data) {
          console.log('resolved')
          console.log(data)
        },
        function(reason, data) {
          console.log('rejected1')
          console.log(somedata) // 此处的somedata未定义
          console.log(reason)
          console.log('rejected2')
        }).catch(function(reason) {
        console.log('catch')
        console.log(reason)
      })
    }
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
