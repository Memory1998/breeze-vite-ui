<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 用户消息管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteMsgUser } from '@/api/system/messages/msgUser'
import { ElForm, ElMessage } from 'element-plus'
import type { MsgUserRecords } from '@/api/system/messages/msgUser/type.ts'
import { MsgUserRecord, MsgUserQuery } from '@/api/system/messages/msgUser/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'MsgUser',
  inheritAttrs: false,
})

const { t } = useI18n()
const msgUserQueryFormRef = ref(ElForm)

/**
 * 查询条件
 */
const queryParams = reactive<MsgUserQuery>({
  current: 1,
  size: 10,
})

let checkedRows = reactive<MsgUserRecords>([])
let currentRows = reactive<MsgUserRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: [],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['messages1:msgUser:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['messages1:msgUser:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['messages1:msgUser:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'title',
      showOverflowTooltip: true,
      label: t('msgUser.fields.title'),
    },
    {
      prop: 'code',
      showOverflowTooltip: true,
      label: t('msgUser.fields.code'),
    },
    {
      prop: 'type',
      showOverflowTooltip: true,
      label: t('msgUser.fields.type'),
    },
    {
      prop: 'level',
      showOverflowTooltip: true,
      label: t('msgUser.fields.level'),
    },
    {
      prop: 'username',
      showOverflowTooltip: true,
      label: t('msgUser.fields.username'),
    },
    {
      prop: 'createTime',
      showOverflowTooltip: true,
      label: t('msgUser.fields.createTime'),
    },
    {
      prop: 'isRead',
      showOverflowTooltip: true,
      label: t('msgUser.fields.isRead'),
    },
    {
      prop: 'isClose',
      showOverflowTooltip: true,
      label: t('msgUser.fields.isClose'),
    },
  ],
  handleBtn: {
    minWidth: 400,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['messages1:msgUser:info'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['messages1:msgUser:delete'],
      },
    ],
  },
})

/**
 * 刷新表格
 */
const reloadList = () => {
  tableInfo.refresh = Math.random()
}

/**
 * 重置查询
 */
const resetQuery = () => {
  msgUserQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
}

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  switch (event) {
    case 'view':
      handleView(row)
      break
    case 'delete':
      handleDelete([row])
      break
    default:
      break
  }
}

/**
 * 表格组件头部按钮事件分发
 *
 * @param event 事件
 * @param rows  行数据
 */
const handleTableHeaderBtnClick = (event: string, rows: any) => {
  switch (event) {
    case 'del':
      handleDelete(rows)
      break
    default:
      break
  }
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleView = (row: any) => {
  console.log(row)
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: MsgUserRecords) => {
  const MsgUserIds = rows.map((item: any) => item.id)
  await deleteMsgUser(MsgUserIds)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: MsgUserRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MsgUserRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="msgUserQueryFormRef" :model="queryParams" :inline="true">
      <!-- 消息标题 -->
      <el-form-item :label="t('msgUser.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('msgUser.fields.title')"
          v-model="queryParams.title"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">
          {{ $t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ $t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="msgUserTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :dict="tableInfo.dict"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @handle-table-row-btn-click="handleTableRowBtnClick"
    @handle-table-header-btn-click="handleTableHeaderBtnClick"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />
</template>
