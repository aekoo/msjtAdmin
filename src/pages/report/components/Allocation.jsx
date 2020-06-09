import { Form, Select, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ employee, loading }) => ({
  employee,
  loading: loading.models.employee,
}))
class Allocation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchEmployee();
  }

  // 查询爱宠官列表
  fetchEmployee = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchEmployee',
      payload: { approvalStatus: 2 },
    });
  };

  okHandle = () => {
    const { form, values, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        ...fieldsValue,
        orderNo: values.orderNo,
      };
      form.resetFields();
      handleAdd(params);
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleModalVisible,
      employee: {
        listData: { results = [] },
      },
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="分配爱宠官"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="爱宠官">
          {form.getFieldDecorator('shitId', {
            rules: [{ required: true }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择">
              {results.map(item => (
                <Option key={item.shitId} value={item.shitId}>
                  {item.realName}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(Allocation);
