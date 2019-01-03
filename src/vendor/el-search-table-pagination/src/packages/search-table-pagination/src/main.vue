<template>
  <div>
    <search-form
      v-if="formOptions"
      ref="searchForm"
      :forms="formOptions.forms"
      :size="formOptions.size || 'small'"
      :fuzzy="formOptions.fuzzy"
      :inline="formOptions.inline || true"
      :label-width="formOptions.labelWidth"
      :item-width="formOptions.itemWidth || 100"
      :submit-handler="searchHandler"
      :submit-loading="loading"
      :showResetBtn="formOptions.showResetBtn"
      :submitBtnText="formOptions.submitBtnText || '查询'"
      :resetBtnText="formOptions.resetBtnText"/>

    <slot name="form" :loading="loading" :search="searchHandler" :tool="formOptions.tools"/>
    <slot/>

    <el-table v-loading.lock="loading"
              ref="table"
              :data="tableData"
              :border="border"
              :size="size"
              :stripe="stripe"
              :height="height"
              :max-height="maxHeight"
              :fit="fit"
              :show-header="showHeader"
              :highlight-current-row="highlightCurrentRow"
              :current-row-key="currentRowKey"
              :row-class-name="rowClassName"
              :row-style="rowStyle"
              :row-ket="rowKey"
              :empty-text="emptyText"
              :default-expand-all="defaultExpandAll"
              :expand-row-keys="expandRowKeys"
              :default-sort="defaultSort"
              :tooltip-effect="tooltipEffect"
              :show-summary="showSummary"
              :sum-text="sumText"
              :summary-method="summaryMethod"
              :style="tableStyle"
              @select="(selection, row) => emitEventHandler('select', selection, row)"
              @select-all="selection => emitEventHandler('select-all', selection)"
              @selection-change="selection => emitEventHandler('selection-change', selection)"
              @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
              @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
              @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
              @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
              @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
              @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
              @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
              @header-click="(column, event) => emitEventHandler('header-click', column, event)"
              @sort-change="args => emitEventHandler('sort-change', args)"
              @filter-change="filters => emitEventHandler('filter-change', filters)"
              @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
              @header-dragend="(newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)"
              @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)">

      <slot name="prepend"/>

      <el-table-column label="序号" align="center" width="50" v-if="indexShow" :fixed="true">
        <template slot-scope="scope">
          {{scope.$index + 1 + pagination.pageSize * (pagination.pageIndex - 1)}}
        </template>
      </el-table-column>

      <el-table-column type="selection" width="50" v-if="checkShow">
      </el-table-column>

      <el-table-column
        v-for="(column, columnIndex) in columns" :key="columnIndex"
        :column-key="column.columnKey"
        :prop="column.prop"
        :label="column.label"
        :width="column.minWidth ? '-' : (column.width || 80)"
        :minWidth="column.minWidth || column.width || 50"
        :fixed="column.fixed"
        :render-header="column.renderHeader"
        :sortable="column.sortable"
        :sort-method="column.method"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align || 'center'"
        :header-align="column.headerAlign || column.align"
        :class-name="column.className"
        :label-class-name="column.labelClassName"
        :selectable="column.selectable"
        :reserve-selection="column.reserveSelection"
        :filters="column.filters"
        :filter-placement="column.filterPlacement"
        :filter-multiple="column.filterMultiple"
        :filter-method="column.filterMethod"
        :filtered-value="column.filteredValue">
        <!-- 多级表头 -->
        <el-table-column
          v-for="(columnChildren, columnIndexChildren) in column.children" :key="columnIndexChildren"
          :column-key="columnChildren.columnKey"
          :prop="columnChildren.prop"
          :label="columnChildren.label"
          :width="columnChildren.minWidth ? '-' : (columnChildren.width || 60)"
          :minWidth="columnChildren.minWidth || columnChildren.width || 50"
          :align="column.align || 'center'">
          <template slot-scope="scope" :scope="newSlotScope ? 'scope' : false ">
          <span v-if="columnChildren.filter">
            {{ Vue.filter(columnChildren['filter'])(scope.row[columnChildren.prop]) }}
          </span>
            <span v-else-if="columnChildren.slotName">
            <slot :name="columnChildren.slotName" :row="scope.row" :$index="scope.$index"/>
          </span>
            <span v-else>
            {{ columnChildren.render ? columnChildren.render(scope.row) : scope.row[columnChildren.prop] }}
          </span>
          </template>
        </el-table-column>

        <template slot-scope="scope" :scope="newSlotScope ? 'scope' : false ">
          <span v-if="column.filter">
            {{ Vue.filter(column['filter'])(scope.row[column.prop]) }}
          </span>
          <span v-else-if="column.slotName">
            <slot :name="column.slotName" :action-options="actionOptions" :row="scope.row" :$index="scope.$index" :action="column.action"/>
          </span>
          <span v-else>
            {{ column.render ? column.render(scope.row) : scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column>

      <slot name="append"/>

    </el-table>

    <div v-if="checkShow" class="checkNum">
      已勾选&nbsp;<b class="checkNumDetail">{{checkNumber}}</b>&nbsp;记录
    </div>
    <div v-if="showPagination">
      <el-pagination
        style="margin-top: 10px;text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageIndex"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import props from './props'
  import searchForm from '../../search/src/main.vue'

  export default {
    name: 'ElSearchTablePagination',
    components: {
      searchForm
    },
    props,
    data() {
      const _this = this
      return {
        Vue,
        pagination: {
          pageIndex: 1,
          pageSize: (() => {
            const { pageSizes } = _this
            if (pageSizes.length > 0) {
              return pageSizes[0]
            }
            return 20
          })()
        },
        total: 0,
        loading: false,
        tableData: [],
        checkData: [],
        allSelected: [], // 保存已经选择的
        hasSelected: [], // 保存当前页选择的
        cacheLocalData: []
      }
    },
    computed: {
      newSlotScope() {
        return Number(Vue.version.replace(/\./g, '')) >= 250
      }
    },
    methods: {
      handleSizeChange(size) {
        this.pagination.pageSize = size
        this.dataChangeHandler()
      },
      handleCurrentChange(pageIndex) {
        this.pagination.pageIndex = pageIndex
        this.dataChangeHandler()
      },
      searchHandler(resetPageIndex = true) {
        if (resetPageIndex) {
          this.pagination.pageIndex = 1
        }
        this.dataChangeHandler(arguments[0])
      },
      dataChangeHandler() {
        const { type } = this
        if (type === 'local') {
          this.dataFilterHandler(arguments[0])
        } else if (type === 'remote') {
          this.fetchHandler(arguments[0])
        }
      },
      dataFilter(data) {
        const { pageIndex, pageSize } = this.pagination
        return data.filter((v, i) => {
          return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize
        })
      },
      dataFilterHandler(formParams) {
        const { cacheLocalData, params } = this
        const mergeParams = Object.assign(params, formParams)
        const validParamKeys = Object.keys(mergeParams).filter(v => {
          return mergeParams[v] !== undefined && mergeParams[v] !== ''
        })
        const searchForm = this.$refs['searchForm']
        let paramFuzzy
        if (searchForm) {
          paramFuzzy = searchForm.getParamFuzzy()
        }

        if (validParamKeys.length > 0) {
          const validData = cacheLocalData.filter(v => {
            const valids = []
            validParamKeys.forEach(vv => {
              if (typeof v[vv] === 'number') {
                valids.push(
                  paramFuzzy && paramFuzzy[vv] ? (String(v[vv]).indexOf(String(mergeParams[vv])) !== -1)
                    : (String(v[vv]) === String(mergeParams[vv]))
                )
              } else {
                valids.push(
                  paramFuzzy && paramFuzzy[vv] ? (v[vv].indexOf(mergeParams[vv]) !== -1) : (v[vv] === mergeParams[vv])
                )
              }
            })
            return valids.every(vvv => {
              return vvv
            })
          })

          this.tableData = this.dataFilter(validData)
          this.total = validData.length
        } else {
          this.total = cacheLocalData.length
          this.tableData = this.dataFilter(cacheLocalData)
        }
      },
      fetchHandler(formParams = {}) {
        this.loading = true
        const {
          fetch, url, $axios, headers,
          listField, pageIndexKey, pageSizeKey,
          totalField, showPagination,
          pagination
        } = this
        let { method, params } = this
        params = JSON.parse(JSON.stringify(Object.assign(params, formParams)))

        if (showPagination) {
          params = Object.assign(params, {
            [pageIndexKey]: pagination.pageIndex,
            [pageSizeKey]: pagination.pageSize
          })
        }
        this.$emit('get-params', params)
        let requestObject = null

        if (fetch) {
          requestObject = fetch(params)
        } else {
          $axios.interceptors.request.use(
            config => {
              Object.keys(headers).forEach(v => {
                config.headers[v] = headers[v]
              })
              return config
            },
            error => {
              return Promise.reject(error)
            }
          )

          method = method.toLowerCase()

          if (method === 'get') {
            requestObject = $axios[method](url, { params })
          } else {
            requestObject = $axios[method](url, params)
          }
        }

        requestObject.then(response => {
          let result = response

          if (response && !(response instanceof Array)) {
            if (listField && listField.indexOf('.') !== -1) {
              listField.split('.').forEach(vv => {
                result = result[vv]
              })
            } else {
              result = response[listField]
            }
          }

          if (!result || !(result instanceof Array)) {
            this.loading = false
            throw new Error(`The result of key:${listField} is not Array.`)
          }

          if (this.dataHandler) {
            this.tableData = result.map(this.dataHandler)
          } else {
            this.tableData = result
            /**
             * 多选 2018.12.24
             * */
            this.$nextTick(() => {
              this.allSelected = this.uniqueArr(this.allSelected, this.hasSelected)
              this.allSelected.forEach(e => {
                this.tableData.forEach((item, i) => {
                  if (this.isObjectValueEqual(item, e)) {
                    this.$refs.table.toggleRowSelection(this.tableData[i])
                  }
                })
              })
              this.$emit('selection-change', this.allSelected)
            })
            /**
             * 多选 2018.12.24
             * */
          }

          let totalValue = response
          if (Object.prototype.toString.call(response) === '[object Array]') {
            totalValue = response.length
          } else if (typeof response === 'object') {
            if (totalField && totalField.indexOf('.') !== -1) {
              totalField.split('.').forEach(vv => {
                totalValue = totalValue[vv]
              })
            } else {
              totalValue = response[totalField]
            }
          } else {
            totalValue = 0
          }
          this.total = totalValue

          this.loading = false
        }).catch(error => {
          console.error('Get remote data failed. ', error)
          this.loading = false
        })
      },
      /**
       * 多选 数组去重 2018.12.24
       * */
      uniqueArr(arr1, arr2) {
        // 合并两个数组
        arr1.push(...arr2) // 或者arr1 = [...arr1, ...arr2]
        // 去重
        const arr3 = Array.from(new Set(arr1)) // let arr3 = [...new Set(arr1)]
        return arr3
      },
      /**
       * 多选 数组去重 2018.12.24
       * */
      /**
       * 多选 判断对象是否相等 2018.12.21
       * */
      isObjectValueEqual(a, b) { // 判断对象是否相等
        const aProps = Object.getOwnPropertyNames(a)
        const bProps = Object.getOwnPropertyNames(b) // 创建属性名称数组
        if (aProps.length !== bProps.length) { // 如果属性数量不同 对象是相等的
          return false
        }
        for (let i = 0; i < (aProps.length - 1); i++) { // 如果相同属性的值不相等 对象是不相等的
          const propName = aProps[i]
          if (a[propName] !== b[propName]) {
            return false
          }
        }
        return true
      },
      /**
       * 多选 判断对象是否相等 2018.12.21
       * */
      emitEventHandler(event) {
        /**
         * 多选 2018.12.24start
         * */
        if (event === 'select') {
          const newSelected = this.allSelected
          for (let i = 0; i < newSelected.length; i++) {
            for (let j = 0; j < this.tableData.length; j++) {
              if (this.isObjectValueEqual(newSelected[i], this.tableData[j])) {
                this.allSelected.splice(i, 1)
              }
            }
          }
          this.hasSelected = []
          Array.from(arguments).slice(1)[0].forEach(e => {
            this.hasSelected.push(e)
          })
          arguments[1] = []
          this.allSelected.forEach(item => {
            arguments[1].push(item)
          })
          this.hasSelected.forEach(item => {
            arguments[1].push(item)
          })
        } else if (event === 'select-all') {
          const newSelected = this.allSelected
          for (let i = 0; i < newSelected.length; i++) {
            for (let j = 0; j < this.tableData.length; j++) {
              if (this.isObjectValueEqual(newSelected[i], this.tableData[j])) {
                this.allSelected.splice(i, 1)
              }
            }
          }
          this.hasSelected = []
          Array.from(arguments).slice(1)[0].forEach(e => {
            this.hasSelected.push(e)
          })
          arguments[1] = []
          this.allSelected.forEach(item => {
            arguments[1].push(item)
          })
          this.hasSelected.forEach(item => {
            arguments[1].push(item)
          })
        }
        /**
         * 多选 2018.12.24end
         * */
        this.$emit(event, ...Array.from(arguments).slice(1))
      },
      loadLocalData(data) {
        const { autoLoad } = this
        if (!data) {
          this.showPagination = false
          throw new Error(`When the type is 'local', you must set attribute 'data' and 'data' must be a array.`)
        }
        const cacheData = JSON.parse(JSON.stringify(data))
        this.cacheLocalData = cacheData
        if (autoLoad) {
          this.tableData = this.dataFilter(cacheData)
          this.total = cacheData.length
        }
      }
    },
    mounted() {
      // event: expand changed to `expand-change` in Element v2.x
      this.$refs['table'].$on('expand', (row, expanded) => this.emitEventHandler('expand', row, expanded))
      const { type, autoLoad, data, formOptions, params } = this
      if (type === 'remote' && autoLoad) {
        if (formOptions) {
          this.$refs['searchForm'].getParams((error, formParams) => {
            if (!error) {
              this.fetchHandler(Object.assign(formParams, params))
            }
          })
        } else {
          this.fetchHandler(params)
        }
      } else if (type === 'local') {
        this.loadLocalData(data)
      }
    },
    watch: {
      data: function(value) {
        this.loadLocalData(value)
      }
    }
  }
</script>

<style>
  .el-table * {
    font-size: 8px;
  }
  .el-table .cell {
    font-size: 8px;
    line-height: 14px;
  }
  .checkNum{
    margin-top: 5px;
    font-size: 16px;
    font-family: Consolas;
  }
  .checkNumDetail{
    color: #FF0000;
  }
</style>
