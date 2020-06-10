import { Form, Input, Modal, Select, message } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data_id: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { data_id, data_content } = record;
      this.setState({ data_id });
      form.setFieldsValue({ data_content });
    }
  }

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { data_id = '' } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        data_id,
      };
      handleAdd(params);
    });
  };

  render() {
    const { record, form, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title={`${record.data_id ? '编辑' : '添加'}类型`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型名称">
          {form.getFieldDecorator('data_content', {
            rules: [{ required: true, message: '请输入类型名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
