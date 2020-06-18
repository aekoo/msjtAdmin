import { message } from 'antd';
import { GetComplaint, GetComplaintByID, GetDictionaryStatus, EditComplaint, exportData } from '@/services/report';

const OrderModel = {
  namespace: 'report',
  state: {
    listData: {},
    rowData: [],
    statusData: [],
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(GetComplaint, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchById({ payload }, { call, put }) {
      const response = yield call(GetComplaintByID, payload);
      yield put({
        type: 'saveRow',
        payload: response,
      });
    },
    *fetchAllStatus({ payload }, { call, put }) {
      const response = yield call(GetDictionaryStatus, payload);
      yield put({
        type: 'saveStatus',
        payload: response,
      });
    },
    // 修改状态
    *editComplaint({ payload }, { call, put }) {
      const response = yield call(EditComplaint, payload);
      if (response.code !== 200) return message.error(response.msg);
      message.success('完成')
      yield put({ type: 'fetch' });
    },
    // 导出
    *exportData({ payload, callback }, { call, put }) {
      const response = yield call(exportData, payload);
      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.warning('导出数据出错');
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return { ...state, listData: action.payload.data || [] };
    },
    saveRow(state, action) {
      return { ...state, rowData: action.payload.data || [] };
    },
    saveStatus(state, action) {
      return { ...state, statusData: action.payload.data || [] };
    },
  },
};
export default OrderModel;
