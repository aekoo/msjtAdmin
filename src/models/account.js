import { message } from 'antd';
import { EditPassword } from '@/services/account';

const AccountModel = {
  namespace: 'account',
  state: {},
  effects: {
    *editPassword({ payload, callback }, { call, put }) {
      const response = yield call(EditPassword, payload);
      if (response.code !== 200) return message.error(response.msg);
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
  },
  reducers: {},
};
export default AccountModel;
