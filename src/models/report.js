import { message } from 'antd';
import { GetComplaint, exportData } from '@/services/report';

const OrderModel = {
  namespace: 'report',
  state: {
    listData: {},
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(GetComplaint, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *exportData({ payload, callback }, { call, put }) {
      const response = yield call(exportData, payload);
      // if (response.code !== 200) {
      //   return message.error(response.msg);
      // }
      // if (callback && typeof callback === 'function') {
      //   callback(response);
      // }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, listData: action.payload.data || [] };
    },
  },
};
export default OrderModel;
