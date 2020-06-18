import { Row, Col, Form, Modal, Descriptions, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const sexType = ['未知', '男', '女'];

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
  render() {
    const {
      handleInfoModal,
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
        visible={true}
        footer={false}
        onOk={() => handleInfoModal()}
        onCancel={() => handleInfoModal()}
      >
        <Descriptions title="举报信息" layout="vertical" size="small" bordered>
          <Descriptions.Item label="ID">{com_id}</Descriptions.Item>
          <Descriptions.Item label="车牌号码">{com_carno}</Descriptions.Item>
          <Descriptions.Item label="举报时间">{com_date}</Descriptions.Item>
          <Descriptions.Item label="举报内容" span={3}>
            {com_content}
          </Descriptions.Item>
          <Descriptions.Item label="补充图片" span={3}>
            {images.map(item => (
              <img style={{ width: 600, marginBottom: 10 }} src={item} />
            ))}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions title="举报人" size="small" bordered>
          <Descriptions.Item label="联系人">{com_name}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={2}>
            {com_tel}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号码" span={2}>
            {com_cardid}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions size="small">
          <Descriptions.Item label="备注">{remark}</Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
}

export default Form.create()(UserInfo);
