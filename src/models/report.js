import { message } from 'antd';
import { GetComplaint, queryUserDetail, queryUserAddressDetail, distribution, confirmRefund, editOrderMoney, editRemark } from '@/services/report';

const OrderModel = {
  namespace: 'report',
  state: {
    userData: {},
    addressData: {},
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

    *queryUserDetail({ payload }, { call, put }) {
      const response = yield call(queryUserDetail, payload);
      yield put({ type: 'saveUser', payload: response, });
    },
    *queryUserAddressDetail({ payload }, { call, put }) {
      const response = yield call(queryUserAddressDetail, payload);
      yield put({ type: 'saveAddress', payload: response, });
    },
    *editOrderMoney({ payload, callback }, { call, put }) {
      const response = yield call(editOrderMoney, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    *editRemark({ payload, callback }, { call, put }) {
      const response = yield call(editRemark, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    *distribution({ payload, callback }, { call, put }) {
      const response = yield call(distribution, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    *confirmRefund({ payload, callback }, { call, put }) {
      const response = yield call(confirmRefund, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      // yield put({
      //   type: 'fetch',
      // });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, listData: action.payload.data || [] };
    },
    saveUser(state, action) {
      return { ...state, userData: action.payload };
    },
    saveAddress(state, action) {
      return { ...state, addressData: action.payload };
    },
  },
};
export default OrderModel;
