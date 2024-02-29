/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PostResponseData, PostQuery, PostRecord } from './type'

enum API {
  POST_RESTFUL_URL = '/post',
  CHECK_POST_CODE_URL = '/post/checkPostCode',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: PostQuery): AxiosPromise<PostResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getPost(id: number): AxiosPromise<PostResponseData> {
  return request({
    url: `${API.POST_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addPost(data: PostRecord): AxiosPromise<PostResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editPost(data: PostRecord): AxiosPromise<PostResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePost(ids: number[]): AxiosPromise<PostResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: PostQuery): AxiosPromise<PostResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验权限编码是否重复
 *
 *  @param postCode
 *  @param postId
 */
export function checkPostCode(postCode: string, postId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_POST_CODE_URL,
    method: 'get',
    params: {
      postId,
      postCode,
    },
  })
}