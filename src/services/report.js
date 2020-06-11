import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function GetComplaint(params) {
  return request('/api/GetComplaint', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

export async function exportData(params) {
  let queryString = ''
  for (let key in params) {
    if (queryString.length && params[key]) queryString += '&'
    queryString += key + '=' + params[key]
  }
  queryString = '?' + queryString + '&token=' + localStorage.getItem('token');
  const url = window.location.origin + '/api/download' + queryString
  // console.log(url)
  window.open(url)
  // return request('api/download', {
  //   params,
  // });
}