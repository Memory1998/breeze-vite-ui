<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 角色管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteRole } from '@/api/auth/role'
import AddOrEdit from './components/RoleAddOrEdit.vue'
import MenuPermissionList from './components/RolePermissionList.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { RoleRecords } from '@/api/auth/role/type.ts'
import { RoleRecord, RoleQuery } from '@/api/auth/role/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Role',
  inheritAttrs: false,
})

const { t } = useI18n()
const roleQueryFormRef = ref(ElForm)
const roleAddOrEditRef = ref()
const rolePermissionListRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<RoleQuery>({
  roleCode: '',
  roleName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<RoleRecords>([])
let currentRows = reactive<RoleRecords>([])

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
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:role:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:role:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:role:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:role:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'roleName',
      showOverflowTooltip: true,
      label: t('role.fields.roleName'),
    },
    {
      prop: 'roleCode',
      showOverflowTooltip: true,
      label: t('role.fields.roleCode'),
    },
  ],
  handleBtn: {
    minWidth: 400,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 编辑
      {
        label: t('common.edit'),
        type: 'success',
        icon: 'edit',
        event: 'edit',
        permission: ['auth:role:modify'],
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:role:info'],
      },
      // 角色权限
      {
        label: t('common.rolePermission'),
        type: 'success',
        icon: 'role_permission',
        event: 'role_permission',
        permission: ['auth:role:list'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:role:delete'],
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
  roleQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
}

/**
 * 添加或者修改
 *
 * @param id 主键
 */
const AddOrEditHandle = (id?: number) => {
  roleAddOrEditRef.value.init(id)
}

/**
 * 设置角色的权限
 *
 * @param id 主键
 */
const setRolePermissionHandle = (id?: number) => {
  rolePermissionListRef.value.init(id)
}

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  switch (event) {
    case 'edit':
      handleUpdate(row)
      break
    case 'view':
      handleView(row)
      break
    case 'role_permission':
      handleRolePermission(row)
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
    case 'add':
      handleAdd()
      break
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
 * 设置角色的菜单权限
 *
 * @param row 参数
 */
const handleRolePermission = (row: any) => {
  setRolePermissionHandle(row.id)
}

/**
 * 添加
 */
const handleAdd = () => {
  AddOrEditHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: RoleRecords) => {
  const roleIds = rows.map((item: any) => item.id)
  await deleteRole(roleIds)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: any) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: RoleRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: RoleRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="roleQueryFormRef" :model="queryParams" :inline="true">
      <!-- 角色编码 -->
      <el-form-item :label="t('role.fields.roleCode')" prop="roleCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('role.fields.roleCode')"
          v-model="queryParams.roleCode"
        />
      </el-form-item>

      <!-- 角色名称 -->
      <el-form-item :label="t('role.fields.roleName')" prop="roleName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('role.fields.roleName')"
          v-model="queryParams.roleName"
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
    ref="roleTableRef"
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

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="roleAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 菜单权限 Dialog -->
  <menu-permission-list ref="rolePermissionListRef" @reload-data-list="reloadList" />
</template>
