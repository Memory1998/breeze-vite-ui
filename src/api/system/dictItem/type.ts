/**
 * @author: gaoweixuan
 * @since: 2024-03-01
 */
import { ResponseData } from '@/types/types.ts'

/**
 * 字典项列表类型声明
 */
export interface DictItemRecord {
  id?: number
  label: string
  value: string
  type: string
}

/**
 * 字典项列表数组类型声明
 */
export type DictItemRecords = DictItemRecord[]

/**
 * 字典项列表接口响应类型声明
 */
export interface DictItemResponseData extends ResponseData {
  data: {
    records: DictItemRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 字典项列表查询类型声明
 */
export interface DictItemQuery {
  dictId: number
  dictCode: string
  dictName: string
}
