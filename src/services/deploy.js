import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

// dict 字典
export async function getDict(params) {
  return request('/api/GetDictionaryAll', { params });
}
// 添加
export async function addDict(params) {
  return request('/api/AddDictionary', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 修改
export async function editDict(params) {
  return request('/api/EditDictionary', {
    method: 'PUT',
    data: jsonToFormData(params),
  });
}
// 启用
export async function enableDict(params) {
  return request('/api/EnableDictionary', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 禁用
export async function disableDict(params) {
  return request('/api/DisableDictionary', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteDict(params) {
  return request('/api/DeleteDictionary', {
    method: 'DELETE',
    data: jsonToFormData(params),
  });
}
