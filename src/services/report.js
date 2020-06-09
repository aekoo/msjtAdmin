import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function GetComplaint(params) {
  return request('/api/v1/GetComplaint', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

export async function queryOrder(params) {
  return request('/admin/order/queryOrderPageList', {
    params,
  });
}
// 用户信息
export async function queryUserDetail(params) {
  return request('/admin/order/queryUserDetail', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 订单地址信息
export async function queryUserAddressDetail(params) {
  return request('/admin/order/queryUserAddressDetail', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 修改价格
export async function editOrderMoney(params) {
  return request('/admin/order/editOrderMoney', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 修改备注
export async function editRemark(params) {
  return request('/admin/order/editRemark', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 分配爱宠官
export async function distribution(params) {
  return request('/admin/order/distribution', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 退款
export async function confirmRefund(params) {
  return request('/admin/order/confirmRefund', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
