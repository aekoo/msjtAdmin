import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

// dict 字典
export async function getDict(params) {
  return request('admin/GetDictionary', { params });
}
// 添加
export async function addDict(params) {
  return request('api/v1/AddDictionary', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 修改
export async function editDict(params) {
  return request('api/v1/EditDictionary', {
    method: 'PUT',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteDict(params) {
  return request('api/v1/DeleteDictionary', {
    method: 'DELETE',
    data: jsonToFormData(params),
  });
}
