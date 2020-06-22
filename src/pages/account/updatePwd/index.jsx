import { Row, Col, Card, Form, Input, Button, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
/* eslint react/no-multi-comp:0 */
@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
class UpdatePwd extends Component {
  state = {};

  componentDidMount() { }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两个新密码不一致！');
    } else {
      callback();
    }
  };
  // 修改
  EditPassword = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/editPassword',
          payload: { password: values.password },
          callback: res => {
            message.success('密码修改成功，请重新登录');
            setTimeout(() => {
              dispatch({
                type: 'login/logout',
              });
            }, 2e3);
          }
        });
      }
    });
  };

  render() {
    const { form, account: { dictData }, loading, } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form {...layout}>
            <Form.Item label="旧密码">
              {getFieldDecorator('old_password', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码',
                  },
                ],
              })(
                <Input.Password placeholder="请输入旧密码" />
              )}
            </Form.Item>

            <Form.Item
              label="新密码"
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/,
                    message: '密码应包含 数字、英文、字符中的两种以上，长度8~20位',
                  },
                ],
              })(
                <Input.Password placeholder="请输入新密码" />
              )}
            </Form.Item>

            <Form.Item
              label="确认新密码"
            >
              {getFieldDecorator('confirm_password', {
                rules: [
                  {
                    required: true,
                    pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/,
                    message: '请再次输入新密码',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(
                <Input.Password placeholder="请再次输入新密码" />
              )}
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" onClick={this.EditPassword}>确认修改</Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(UpdatePwd);
