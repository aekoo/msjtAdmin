import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function GetComplaint(params) {
  return request('/api/v1/GetComplaint', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

export async function exportData(params) {
  return request('api/v1/download', {
    params,
  });
}