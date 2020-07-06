import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function GetComplaint(params) {
  return request('/api/GetComplaint', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

export async function GetComplaintByID(params) {
  return request('/api/GetComplaintByID', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

export async function GetDictionaryStatus(params) {
  return request('/api/GetDictionaryStatus', { params });
}

export async function EditComplaint(params) {
  return request('/api/EditComplaint', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
export async function DeleteComplaint(params) {
  return request('/api/DeleteComplaint', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

// export async function exportData(params) {
//   return request('/api/download', {
//     method: 'GET', // GET / POST 均可以
//     data: params,
//     responseType: 'blob', // 必须注明返回二进制流
//   });
// }

export async function exportData(params) {
  return request('/api/download', { responseType: 'blob', params });
}