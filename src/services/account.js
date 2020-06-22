import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

//修改密码
export async function EditPassword(params) {
  return request('/api/EditPassword', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
