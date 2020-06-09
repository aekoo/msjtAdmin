import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function GetComplaint(params) {
  return request('/api/v1/GetComplaint', {
    method: 'POST',
    // data: jsonToFormData(updateQueryParams(params)),
    data: jsonToFormData(params),
  });
}
// dict 字典
export async function getDict(params) {
  return request('/admin/dict/getDict', { params });
}
// 添加/修改
export async function editDict(params) {
  return request('/admin/dict/addOrUpdateDict', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteDict(params) {
  return request('/admin/dict/deleteDict', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
