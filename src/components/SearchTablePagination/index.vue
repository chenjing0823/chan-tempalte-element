<template>
  <el-card class="box-card">
    <el-search-table-pagination
      @row-dblclick="dbclick"
      @get-params="getParams"
      @selection-change="handleSelectionChange"
      :index-show="indexShow"
      :check-show="checkShow"
      :fetch="fetch"
      :columns="columns"
      :page-sizes="pageSizes"
      :list-field="dataType"
      :total-field="totalElements"
      :page-index-key="'page'"
      :page-size-key="'size'"
      :show-summary="showSummary"
      :action-options="actionOptions"
      :form-options="formOptions">

      <template slot="form" slot-scope="scope">
        <el-button type="primary" style="margin: 5px" :loading="downloadLoading" icon="el-icon-download" @click="exportExcel" size="small" v-if="checkTool(scope.tool, 'export')">导出</el-button>
        <el-button @click="addOption" style="float: right;margin: 5px" type="success" size="small" v-if="checkTool(scope.tool, 'add')">{{addBtn}}</el-button>
        <el-button @click="updateOption" style="float: right;margin: 5px" type="success" size="small" v-if="checkTool(scope.tool, 'update')">更新</el-button>
        <el-button @click="archive" style="float: right;margin: 5px" type="success" size="small" v-if="archiveShow">归档</el-button>
        <el-button @click="diyOption" style="float: right;margin: 5px" type="success" size="small" v-if="checkTool(scope.tool, 'diy')">{{diyMessage}}</el-button>
        <!--<el-button @click="checkSure" style="float: right;margin: 5px" type="success" size="small" v-if="checkSureShow">勾选确认</el-button>-->
      </template>

      <template slot="imgPath" slot-scope="scope">
        <img :src="'http://wherecar.oss-cn-hangzhou.aliyuncs.com/' + scope.row.image_path"
             style="width: 50px;height: 25px">
      </template>

      <template slot="countNumber" slot-scope="scope">
        <!--<span>{{scope.row.count_number}}</span>-->
        <el-input size="mini" style="width: 50px" v-model="scope.row.count_number"></el-input>
      </template>

      <!--用在行按钮不一致的table表-->
      <template slot="actionRandom" slot-scope="scope">
        <el-button title="编辑" type="primary" icon="el-icon-edit" size="mini" circle v-if="editAction(scope.row)"
                   @click="openEditDialog(scope)"></el-button>

        <el-button :title="auditMessage" type="warning" icon="el-icon-view" size="mini" circle v-if="auditAction(scope.row)"
                   @click="openAuditDialog(scope)"></el-button>

        <el-button title="停用" type="info" icon="el-icon-circle-close-outline" size="mini" circle v-if="stopAction(scope.row)"
                   @click="openStopDialog(scope)"></el-button>

        <el-button title="启用" type="success" icon="el-icon-circle-check-outline" size="mini" circle  v-if="openAction(scope.row)"
                   @click="openStopDialog(scope)"></el-button>

        <el-button :title="cancelMessage" icon="el-icon-refresh" size="mini" circle v-if="cancelAction(scope.row)"
                   @click="openCancelDialog(scope)"></el-button>

        <el-button :title="deleteMessage" type="danger" icon="el-icon-delete" size="mini" circle v-if="deleteAction(scope.row)"
                   @click="openDeleteDialog(scope)"></el-button>
      </template>
      <!--快速发券申请行按钮不一致-->
      <template slot="action" slot-scope="scope">
        <el-tooltip
          placement="top-start"
          content="设置定保">
          <el-button type="success" icon="el-icon-mobile-phone" size="mini" circle v-if="checkAction(scope.action, 'dingbao')"
                     @click="openRepairDialog(scope)"></el-button>
        </el-tooltip>
        <el-tooltip
          placement="top-start"
          content="设置质保">
          <el-button type="warning" icon="el-icon-bell" size="mini" circle v-if="checkAction(scope.action, 'zhibao')"
                     @click="openStopDialog(scope)"></el-button>
        </el-tooltip>

        <el-tooltip
          placement="top-start"
          content="查看">
          <el-button type="success" icon="el-icon-search" size="mini" circle v-if="checkAction(scope.action, 'view')"
                     @click="openViewDialog(scope)"></el-button>
        </el-tooltip>

        <el-tooltip
          placement="top-start"
          content="维修类型修改">
          <el-button type="warning" icon="el-icon-setting" size="mini" circle v-if="checkAction(scope.action, 'repair')"
                     @click="openRepairDialog(scope)"></el-button>
        </el-tooltip>

        <el-tooltip
          placement="top-start"
          content="确认付款">
          <el-button type="success" icon="el-icon-goods" size="mini" circle v-if="checkAction(scope.action, 'shopping')"
                     @click="showOrderDetails(scope)"></el-button>
        </el-tooltip>

        <!--表单验证编辑-->
        <el-tooltip
          placement="top-start"
          :content="editMessage">
          <el-button type="primary" icon="el-icon-edit" size="mini" circle v-if="checkAction(scope.action, 'edit')"
                     @click="openEditDialog(scope)"></el-button>
        </el-tooltip>
        <!--表单验证编辑-->

        <!--正常编辑 无需表单验证-->
        <el-tooltip
          placement="top-start"
          :content="editMessage">
          <el-button type="primary" icon="el-icon-edit" size="mini" circle v-if="checkAction(scope.action, 'editNormal')"
                     @click="openEditDialog1(scope)"></el-button>
        </el-tooltip>
        <!--正常编辑 无需表单验证-->

        <el-tooltip
          placement="top-start"
          :content="stopMessage">
          <el-button type="warning" icon="el-icon-warning" size="mini" circle v-if="checkAction(scope.action, 'stop')"
                     @click="openStopDialog(scope)"></el-button>
        </el-tooltip>

        <el-tooltip
          placement="top-start"
          :content="cancelMessage">
          <el-button type="info" icon="el-icon-refresh" size="mini" circle v-if="checkAction(scope.action, 'cancel')"
                     @click="openCancelDialog(scope)"></el-button>
        </el-tooltip>

        <el-tooltip
          placement="top-start"
          :content="deleteMessage">
          <el-button type="danger" icon="el-icon-delete" size="mini" circle v-if="checkAction(scope.action, 'delete')"
                     @click="openDeleteDialog(scope)"></el-button>
        </el-tooltip>
        <el-tooltip
          placement="top-start"
          content="打印预览">
          <el-button type="warning" icon="el-icon-printer" size="mini" circle v-if="checkAction(scope.action, 'print')"
                     @click="openPrintDialog(scope)"></el-button>
        </el-tooltip>

      </template>
    </el-search-table-pagination>

    <el-dialog title="查看"
               :width="viewWidth"
               :visible.sync="viewDialogVisible">
      <slot name="view-action" :row="viewDialogData">查看</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="viewDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="viewDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="repairMessage"
               :width="repairWidth"
               :visible.sync="repairDialogVisible">
      <slot name="repair-action" :row="repairDialogData">维修类型修改</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="repairDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="sendSignalRepair">确 定</el-button>
      </div>
    </el-dialog>
    <!--表单验证编辑-->
    <el-dialog :title="editMessage"
               :width="editWidth"
               :visible.sync="editDialogVisible = editIsShow">
      <slot name="edit-action" :row="editDialogData">编辑</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false" v-if="false">取 消</el-button>
        <el-button size="small" type="primary" @click="sendSignalEdit" v-if="false">确 定</el-button>
      </div>
    </el-dialog>
    <!--表单验证编辑-->

    <!--正常编辑 无需表单验证-->
    <el-dialog :width="editWidth"
               :title="editMessage"
               :visible.sync="editDialogVisible1">
      <slot name="editNormal-action" :row="editDialogData1">编辑</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible1 = false">取 消</el-button>
        <el-button size="small" type="primary" @click="sendSignalEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--正常编辑 无需表单验证-->

    <el-dialog :width="deleteWidth"
               :title="deleteMessage"
               :visible.sync="deleteDialogVisible">
      <slot name="delete-action" :row="deleteDialogData">删除</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button size="small" type="danger" @click="sendSignalDelete">{{deleteMessage}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :width="stopWidth"
               :title="stopMessage"
               :visible.sync="stopDialogVisible">
      <slot name="stop-action" :row="stopDialogData">{{stopMessage}}</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="stopDialogVisible = false">取 消</el-button>
        <el-button size="small" type="success" @click="sendSignalStop">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :width="stopWidth"
               title="审核"
               center
               :visible.sync="auditDialogVisible">
      <slot name="audit-action" :row="auditDialogData">审核</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="auditDialogVisible = false">取 消</el-button>
        <el-button size="small" type="warning" @click="sendSignalAuditD">不通过</el-button>
        <el-button size="small" type="success" @click="sendSignalAuditS">通过</el-button>
      </div>
    </el-dialog>

    <el-dialog :width="cancelWidth"
               :title="cancelMessage"
               :visible.sync="cancelDialogVisible">
      <slot name="cancel-action" :row="cancelDialogData">{{cancelMessage}}</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDialogVisible = false">取 消</el-button>
        <el-button size="small" type="warning" @click="sendSignalCancel">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :width="addWidth"
               top="8vh"
               :title="addBtn"
               :visible.sync="addDialogVisible = addDialog">
      <slot name="add-action">添加</slot>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="addOperation" size="small" @click="addDialogVisible = false">取 消</el-button>
        <el-button v-if="addOperation" size="small" type="success" @click="sendSignalAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="800px"
               top="8vh"
               title="打印预览"
               :visible.sync="printDialogVisible">
      <slot name="print-action">即将打印客户订单</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="printDialogVisible = false">取 消</el-button>
        <el-button size="small" type="success" v-print="'#printTest'" @click="sendSignalPrint">打 印</el-button>
      </div>
    </el-dialog>
    <el-dialog :width="diyWidth"
               top="8vh"
               :title="diyMessage"
               :visible.sync="diyDialogVisible">
      <slot name="diy-action">diy</slot>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="diyDialogVisible = false">取 消</el-button>
        <el-button size="small" type="success" @click="sendSignalDiy">确 认</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import '@/vendor/el-search-table-pagination'

export default {
  data() {
    return {
      viewDialogVisible: false,
      diyDialogVisible: false,
      editDialogVisible: false,
      editDialogVisible1: false,
      deleteDialogVisible: false,
      printDialogVisible: false,
      repairDialogVisible: false,
      stopDialogVisible: false,
      auditDialogVisible: false,
      cancelDialogVisible: false,
      addDialogVisible: false,
      viewDialogData: {},
      editDialogData: {},
      editDialogData1: {},
      deleteDialogData: {},
      printDialogData: {},
      repairDialogData: {},
      stopDialogData: {},
      auditDialogData: {},
      cancelDialogData: {},
      downloadLoading: false,
      multipleSelection: [], // table勾选后的数据
      archiveShow: false, // 归档按钮默认隐藏
      // checkSureShow: false, // 全选默认隐藏
      countN: 1 // 默认数量1
    }
  },
  created() {
    this.totalElements = this.dataType.split('.content')[0] + '.totalElements'
  },
  props: {
    fetch: {
      type: Function,
      default() {
        return function() {
        }
      }
    },
    formOptions: {
      type: Object,
      default: function() {
        return {
          inline: true,
          submitBtnText: '查询',
          forms: []
        }
      }
    },
    actionOptions: {
      type: Object,
      default: function() {
        return {}
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 30, 50]
      }
    },
    showSummary: Boolean,
    dataType: {
      type: String,
      default() {
        return 'data.content'
      }
    },
    // table的序号显示 默认显示
    indexShow: {
      type: Boolean,
      default: true
    },
    // tableCheckBox
    checkShow: {
      type: Boolean,
      default: false
    },
    editIsShow: {
      type: Boolean
      // 接受父组件传递的编辑dialog状态
    },
    viewWidth: {
      type: String
    },
    editWidth: {
      type: String
    },
    deleteWidth: {
      type: String
    },
    repairWidth: {
      type: String
    },
    stopWidth: {
      type: String
    },
    cancelWidth: {
      type: String
    },
    addWidth: {
      type: String
    },
    diyWidth: {
      type: String
    },
    addDialog: {
      type: Boolean
    },
    addOperation: {
      type: Boolean,
      default: false
    },
    updateDialog: {
      type: Boolean,
      default: false
    },
    checkAll: {
      type: String,
      default: 'false'
    },
    deleteMessage: {
      type: String,
      default: '删除'
    },
    stopMessage: {
      type: String,
      default: '中止提醒'
    },
    cancelMessage: {
      type: String,
      default: '取消审核'
    },
    auditMessage: {
      type: String,
      default: '审核'
    },
    editMessage: {
      type: String,
      default: '编辑'
    },
    diyMessage: {
      type: String,
      default: '自定义'
    },
    repairMessage: {
      type: String,
      default: '维修类型修改'
    },
    addBtn: {
      type: String,
      default: '添加'
    }
  },
  methods: {
    dbclick(event) {
      this.$emit('dbclick', event)
    },
    handleSelectionChange(val) { // table 多选
      this.multipleSelection = val
      if (this.checkAll === 'false') {
        if (this.multipleSelection.length === 0) {
          this.archiveShow = false
        } else {
          this.archiveShow = true
        }
      } else if (this.checkAll === 'true') {
        if (this.multipleSelection.length !== 0) {
          // this.checkSureShow = true
          this.$emit('check-data', this.multipleSelection)
        }
      } else {
        this.$emit('check-data-diy', this.multipleSelection)
      }
    },
    checkAction(actions, action) {
      if (typeof actions === 'undefined' || actions.length === 0) {
        return true
      }
      return actions.includes(action)
    },
    checkTool(tools, tool) {
      if (typeof tools === 'undefined' || tools.length === 0) {
        return false
      }
      return tools.includes(tool)
    },
    addOption() {
      this.addDialog = true // 添加dialog是否show状态
      this.$emit('get-add-status', this.addDialog) // dialog是否show状态传递给父组件
    },
    diyOption() {
      this.diyDialogVisible = true
    },
    updateOption() {
      // this.addDialog = true // 添加dialog是否show状态
      this.updateDialog = true
      this.$emit('get-update-status', this.updateDialog) // dialog是否show状态传递给父组件
    },
    openViewDialog(scope) {
      this.viewDialogVisible = true
      this.viewDialogData = scope.row
    },
    openRepairDialog(scope) {
      this.repairDialogVisible = true
      this.repairDialogData = scope.row
      this.$emit('getRowData', this.repairDialogData)
    },
    openEditDialog(scope) {
      this.editIsShow = true // 编辑dialog是否show状态
      this.$emit('get-edit-status', this.editIsShow) // dialog是否show状态传递给父组件
      this.editDialogVisible = true
      this.editDialogData = scope.row
      this.$emit('getRowData', this.editDialogData)
    },
    openEditDialog1(scope) {
      this.editDialogVisible1 = true
      this.editDialogData1 = scope.row
      this.$emit('getRowData', this.editDialogData1)
    },
    openDeleteDialog(scope) {
      this.deleteDialogVisible = true
      this.deleteDialogData = scope.row
      this.$emit('getRowData', this.deleteDialogData)
    },
    openPrintDialog(scope) {
      this.printDialogVisible = true
      this.printDialogData = scope.row
      this.$emit('getRowData', this.printDialogData)
    },
    openAuditDialog(scope) {
      this.auditDialogVisible = true
      this.auditDialogData = scope.row
      this.$emit('getRowData', this.auditDialogData)
    },
    openStopDialog(scope) {
      this.stopDialogVisible = true
      this.stopDialogData = scope.row
      if (this.stopDialogData.state === 3) {
        this.$nextTick(() => {
          this.stopMessage = '停用'
        })
      } else if (this.stopDialogData.state === 4) {
        this.$nextTick(() => {
          this.stopMessage = '启用'
        })
      } else if (this.stopDialogData.state === 2) {
        this.$nextTick(() => {
          this.stopMessage = '启用'
        })
      }
      this.$emit('getRowData', this.stopDialogData)
    },
    openCancelDialog(scope) {
      this.cancelDialogVisible = true
      this.cancelDialogData = scope.row
      this.$emit('getRowData', this.cancelDialogData)
    },
    sendSignalEdit() {
      this.$emit('getSignal', 'edit')
      this.editDialogVisible1 = false
    },
    sendSignalDelete() {
      this.$emit('getSignal', 'delete')
      this.deleteDialogVisible = false
    },
    sendSignalRepair() {
      this.$emit('getSignal', 'repair')
      this.repairDialogVisible = false
    },
    sendSignalStop() {
      this.$emit('getSignal', 'stop')
      this.stopDialogVisible = false
    },
    sendSignalAuditS() {
      this.$emit('getSignal', 'auditSuccess')
      this.auditDialogVisible = false
    },
    sendSignalAuditD() {
      this.$emit('getSignal', 'auditDefeat')
      this.auditDialogVisible = false
    },
    sendSignalCancel() {
      this.$emit('getSignal', 'cancel')
      this.cancelDialogVisible = false
    },
    sendSignalAdd() {
      this.addDialog = false
      this.$emit('getSignal', 'add')
    },
    sendSignalPrint() {
      var t
      clearTimeout(t)
      t = setTimeout(() => {
        this.printDialogVisible = false
      }, 500)
    },
    sendSignalDiy() {
      this.diyDialogVisible = false
      this.$emit('getSignal', 'diy')
    },
    getParams(params) {
      this.params = params
    },
    archive() { // 归档
      this.$emit('check-data', this.multipleSelection)
      this.$emit('getSignal', 'archive')
    },
    checkSure() { // 普通全选勾选确认
      this.$emit('check-data', this.multipleSelection)
      // this.$emit('getSignal', 'archive')
    },
    exportExcel() {
      this.downloadLoading = true
      const params = this.params
      // 默认最多1万条
      params.page = 0
      params.size = 10000
      this.fetch(params).then(res => {
        return res
      }).then(res => {
        import('@/vendor/export-excel/ExportToExcel').then(excel => {
          const columns = this.columns.flatMap(v => v.children ? v.children.flatMap(x => x) : v)
          const header = columns.map(v => {
            return v.label
          })
          const data = this.formatJson(columns.map(v => v.prop), res.data.content || res.data.dataObject.content)
          excel.export_json_to_excel({
            header,
            data,
            filename: this.formOptions.exportName || 'export'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    showOrderDetails(scope) {
      this.$emit('getRowData', scope.row)
      this.$emit('show-order-details', true)
    },
    // 停用按钮
    stopAction(row) {
      console.info()
      if (row.state === 3) {
        return true
      }
      if (row.activity_is_stop === 0) {
        return true
      }
    },
    // 启用按钮
    openAction(row) {
      if (row.state === 2 || row.state === 4) {
        return true
      }
      if (row.activity_is_stop === 1 || row.activity_is_stop === 2) {
        return true
      }
    },
    // 审核按钮
    auditAction(row) {
      if (row.state === 1 || row.state === 5) {
        return true
      }
      if (row.activity_is_stop === 3) {
        return true
      }
    },
    // 取消按钮
    cancelAction(row) {
      if (row.state === 2) {
        return true
      }
    },
    // 删除按钮
    deleteAction(row) {
      if (row.state === 1 || row.state === 2 || row.state === 4 || row.state === 5) {
        return true
      }
      if (row.activity_is_stop === 4 || row.activity_is_stop === 3) {
        return true
      }
    },
    // 编辑按钮
    editAction(row) {
      if (row.activity_is_stop !== '' && row.activity_is_stop !== undefined) {
        return true
      }
    }
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) {
        this.editIsShow = false // 编辑dialog是否show状态
        this.$emit('get-edit-status', this.editIsShow) // dialog是否show状态传递给父组件
      }
    },
    editDialogVisible1(val) {
      if (val === false) {
        this.$emit('get-edit-status', this.editIsShow) // dialog是否show状态传递给父组件
      }
    },
    addDialogVisible(val) {
      if (val === false) {
        this.$nextTick(() => {
          this.addDialog = false // 添加dialog是否show状态
        })
        this.$emit('get-add-status', this.addDialog) // dialog是否show状态传递给父组件
      }
    },
    printDialogVisible(val) {
      if (val === false) {
        this.$emit('getSignal', 'print')
      }
    }
  }
}
</script>

<style scoped>
.el-button.is-circle {
  padding: 5px;
}
</style>

