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
    const { dispatch, values } = this.props;
    dispatch({
      type: 'orders/queryUserDetail',
      payload: { userId: values.userId },
    });
  };
  render() {
    const {
      handleUserModal,
      orders: {
        userData,
        addressData,
      },
    } = this.props;
    const {
      userId = '',
      nickName = "",
      gender = null,
      avatar = "",
      createTime = "",
      updateTime = "",
    } = userData.results || {};
    const {
      realName = "",
      phone = '',
      wechatNo = '',
      province = '',
      city = '',
      area = '',
      detailAddress = '',
    } = addressData.results || {};

    return (
      <Modal
        width={720}
        destroyOnClose
        visible={true}
        footer={false}
        onOk={() => handleUserModal()}
        onCancel={() => handleUserModal()}
      >
        <Descriptions title="用户信息" size="small" bordered>
          <Descriptions.Item label="ID" span={2}>{userId}</Descriptions.Item>
          <Descriptions.Item label="用户头像"><img style={{ width: 60, height: 60 }} src={avatar} /></Descriptions.Item>
          <Descriptions.Item label="用户昵称" span={2}>{nickName}</Descriptions.Item>
          <Descriptions.Item label="性别" >{sexType[gender]}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={3}>{createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间" span={3}>{updateTime}</Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions title="服务信息" size="small" bordered>
          <Descriptions.Item label="联系人">{realName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{phone}</Descriptions.Item>
          <Descriptions.Item label="微信">{wechatNo}</Descriptions.Item>
          <Descriptions.Item label="服务地址" span={3}>{province} {city} {area} {detailAddress}</Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
}

export default Form.create()(UserInfo);
