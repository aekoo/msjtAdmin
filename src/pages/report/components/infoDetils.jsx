import { Row, Col, Form, Button, Modal, Descriptions, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ report }) => ({
  report,
}))
class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchDetail();
  }
  fetchDetail = () => {
    const { dispatch, findID } = this.props;
    dispatch({
      type: 'report/fetchById',
      payload: { com_id: findID },
    });
  };
  // 确定
  okHandle = () => {
    const { form, findID, handleInfoModalOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const remark = fieldsValue['remark'];
      handleInfoModalOk(findID, 4, remark);
    });
  };
  render() {
    const {
      form,
      handleInfoModal,
      isDispose,
      report: { rowData = [] },
    } = this.props;
    const {
      com_cardid = '',
      com_carno = '',
      com_content = '',
      com_date = '',
      com_id = '',
      com_name = '',
      com_pic = '',
      com_tel = '',
      data_content = '',
      data_contents = '',
      remark = '',
      write_date = '',
    } = rowData[0] || {};
    let images = com_pic.split(',');
    return (
      <Modal
        width={720}
        destroyOnClose
        maskClosable={false}
        visible={true}
        onOk={() => okHandle()}
        onCancel={() => handleInfoModal()}
        footer={isDispose ? [
          <Button key="back" onClick={() => handleInfoModal()}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => this.okHandle()}>
            确定
          </Button>,
        ] : null}
      >
        <Descriptions title="举报信息" layout="vertical" size="small" bordered>
          <Descriptions.Item label="ID">{com_id}</Descriptions.Item>
          <Descriptions.Item label="车牌号码">{com_carno}</Descriptions.Item>
          <Descriptions.Item label="举报时间">{com_date}</Descriptions.Item>
          <Descriptions.Item label="举报内容" span={3}>
            {com_content}
          </Descriptions.Item>
          <Descriptions.Item label="补充图片" span={3}>
            {images.map((item, i) => (
              <img key={i} style={{ width: 600, marginBottom: 10 }} src={item} />
            ))}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions title="举报人" size="small" bordered>
          <Descriptions.Item label="联系人">{com_name}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={2}>
            {com_tel}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号码" span={3}>
            {com_cardid}
          </Descriptions.Item>
        </Descriptions>
        <br />
        {
          isDispose ?
            <Descriptions title="备注" size="small">
              <Descriptions.Item>
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                      <FormItem>
                        {form.getFieldDecorator('remark', {
                          initialValue: remark,
                          rules: [{ required: true, message: '请输入处理建议或备注信息！' }],
                        })(<TextArea
                          rows={5}
                          placeholder="请输入处理建议或备注信息"
                          style={{ width: 660 }}
                        />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Descriptions.Item>
            </Descriptions>
            :
            <Descriptions size="small">
              <Descriptions.Item label="备注">
                {remark}
              </Descriptions.Item>
            </Descriptions>
        }
      </Modal>
    );
  }
}

export default Form.create()(UserInfo);
