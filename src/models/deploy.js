import { message } from 'antd';
import {
  GetComplaint,
  editDict,
  deleteDict,
} from '@/services/deploy';

const DeployModel = {
  namespace: 'deploy',
  state: {
    dictType: '3',
    dictData: {},
  },
  effects: {
    // dict 字典
    *fetchDict({ payload }, { call, put, select }) {
      // const { dictType } = yield select(_ => _.deploy);
      // const response = yield call(GetComplaint, payload || { dictType });
      const response = yield call(GetComplaint, payload);
      // if (payload || dictType != 3) {
      yield put({ type: 'saveDictData', payload: response, });
      // } else {
      //   yield put({ type: 'saveDictSelData', payload: response, });
      // }
    },
    *editDict({ payload }, { call, put }) {
      const response = yield call(editDict, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchDict',
      });
    },
    *deleteDict({ payload }, { call, put }) {
      const response = yield call(deleteDict, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchDict',
      });
    },
  },
  reducers: {
    saveDictData(state, { payload }) {
      return { ...state, dictData: payload.data || [] };
    },
    // saveDictSelData(state, { payload }) {
    //   return { ...state, dictSelData: payload.results || [] };
    // },
    dictTypeChange(state, { payload }) {
      return { ...state, dictType: payload };
    },
  },
};
export default DeployModel;
