/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PlatformResponseData, PlatformQuery, PlatformRecord, PlatformForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  PLATFORM_RESTFUL_URL = '/auth/v1/platform',
  CHECK_PLATFORM_CODE_URL = '/auth/v1/platform/checkPlatformCode',
  PLATFORM_SELECT_URL = '/sys/v1/common/selectPlatform',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: PlatformQuery): AxiosPromise<PlatformResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getPlatform(id: number): AxiosPromise<PlatformResponseData> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addPlatform(data: PlatformForm): AxiosPromise<ResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editPlatform(id: number, data: PlatformForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePlatform(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: PlatformRecord): AxiosPromise<any> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验平台编码是否重复
 *
 *  @param platformCode
 *  @param platformId
 */
export function checkPlatformCode(platformCode: string, platformId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_PLATFORM_CODE_URL,
    method: 'get',
    params: {
      platformId: platformId,
      platformCode: platformCode,
    },
  })
}

/**
 * 平台下拉框
 *
 */
export function selectPlatform(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.PLATFORM_SELECT_URL,
    method: 'get',
  })
}
