import { Badge, Button, Card, Col, Divider, Form, Input, Icon, Table, Row, Rate, Select, Popover, Popconfirm, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import Details from './components/Details';
import UserInfo from './components/UserInfo';
import Allocation from './components/Allocation';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const serverType = ['上门喂猫', '上门遛狗'];
const payStatusMap = ['warning', 'success', 'processing', 'purple', 'default'];
const payStatus = ['待支付', '已支付', '已申请退款', '已退款', '已取消'];
const serverStatusMap = ['success', 'processing', 'default'];
const serverStatus = ['未服务', '进行中', '已结束'];

/* eslint react/no-multi-comp:0 */
@connect(({ report, loading }) => ({
  report,
  loading: loading.models.report,
}))
class ReportLIst extends Component {
  state = {
    detailsModalVisible: false,
    userModalVisible: false,
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    editRemarkOrderNo: '',
    editMoneyOrderNo: '',
    money: '',
    remark: '',
    record: {},
  };
  p = {
    currentPage: 1,
    pageSize: 10,
  }

  columns = [
    {
      title: '举报ID',
      dataIndex: 'com_id',
    },
    {
      title: '车牌号码',
      dataIndex: 'com_carno',
    },
    {
      title: '举报内容',
      dataIndex: 'com_content',
    },
    {
      title: '举报时间',
      dataIndex: 'com_date',
    },
    {
      title: '举报人',
      dataIndex: 'com_name',
    },
    {
      title: '联系电话',
      dataIndex: 'com_tel',
    },
    {
      title: '身份证号码',
      dataIndex: 'com_cardid',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) =>
        record.dictId != 3 ? (
          <span>
            <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除？"
              okType="danger"
              onConfirm={() => this.deleteFunc(record)}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ) : null,
    },
  ];

  componentDidMount() {
    const {
      form,
      location: { query = {} },
    } = this.props;
    if (query.lovePetOfficerName) {
      form.setFieldsValue({ lovePetOfficerName: query.lovePetOfficerName });
      this.handleSearch();
    } else {
      this.fetchListData();
    }
  }
  fetchListData = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetch',
      payload: params,
    });
  };
  // 查询
  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({ formValues: fieldsValue });
      this.fetchListData(fieldsValue);
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
    this.fetchListData();
  };

  handleDetailsModal = (flag, record) => {
    this.setState({
      detailsModalVisible: !!flag,
      record: record || {},
    });
  };
  handleUserModal = (flag, record) => {
    this.setState({
      userModalVisible: !!flag,
      record: record || {},
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record: record || {},
    });
  };
  // 分配爱宠官
  handleAdd = params => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'report/distribution',
      payload: params,
      callback: response => {
        const params = {
          currentPage: this.p.currentPage,
          pageSize: this.p.pageSize,
          ...formValues
        }
        this.fetchListData(params);
      },
    });
    this.handleModalVisible();
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  // 确认退款
  confirmRefund = orderNo => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'report/confirmRefund',
      payload: { orderNo },
      callback: response => {
        const params = {
          currentPage: this.p.currentPage,
          pageSize: this.p.pageSize,
          ...formValues
        }
        this.fetchListData(params);
      },
    });
  };
  // 更新价格
  editOrderMoney = () => {
    const { dispatch } = this.props;
    const { editMoneyOrderNo, money, formValues } = this.state;
    dispatch({
      type: 'report/editOrderMoney',
      payload: { orderNo: editMoneyOrderNo, money },
      callback: response => {
        const params = {
          currentPage: this.p.currentPage,
          pageSize: this.p.pageSize,
          ...formValues
        }
        this.fetchListData(params);
      },
    });
    this.setState({ editMoneyOrderNo: '', money: '' });
  };
  // 编辑价格
  renderMoney(record) {
    const { editMoneyOrderNo } = this.state;
    const { orderNo, totalMoney: money } = record;
    return (
      <Popover
        title="修改价格"
        trigger="click"
        placement="topRight"
        visible={editMoneyOrderNo == orderNo}
        content={
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem>
                  <Input placeholder="请输入数字,最多两位小数" defaultValue={money} onChange={e => this.setState({ money: e.target.value })} style={{ width: 260 }} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <Button type="primary" onClick={() => this.editOrderMoney()}>保存</Button>
              </Col>
              <Col md={6} sm={24}>
                <Button onClick={() => this.setState({ editMoneyOrderNo: '' })}>取消</Button>
              </Col>
            </Row>
          </Form>
        }
      >
        <span onClick={() => this.setState({ editMoneyOrderNo: orderNo, money })}><a>{money ? money : '--'} </a>元</span>
      </Popover>
    );
  }
  // 更新备注
  editRemark = () => {
    const { dispatch } = this.props;
    const { editRemarkOrderNo, remark, formValues } = this.state;
    dispatch({
      type: 'report/editRemark',
      payload: { orderNo: editRemarkOrderNo, remark },
      callback: response => {
        const params = {
          currentPage: this.p.currentPage,
          pageSize: this.p.pageSize,
          ...formValues
        }
        this.fetchListData(params);
      },
    });
    this.setState({ editRemarkOrderNo: '', remark: '' });
  };
  // 编辑备注
  renderRemark(record) {
    const { editRemarkOrderNo } = this.state;
    const { orderNo, remark } = record;
    return (
      <Popover
        title="备注信息"
        trigger="click"
        placement="topRight"
        visible={editRemarkOrderNo == orderNo}
        content={
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem>
                  <TextArea
                    rows={3}
                    placeholder="请输入备注信息"
                    defaultValue={remark}
                    onChange={e => this.setState({ remark: e.target.value })}
                    style={{ width: 260 }}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <Button type="primary" onClick={() => this.editRemark()}>
                  保存
                </Button>
              </Col>
              <Col md={6} sm={24}>
                <Button onClick={() => this.setState({ editRemarkOrderNo: '' })}>取消</Button>
              </Col>
            </Row>
          </Form>
        }
      >
        <span onClick={() => this.setState({ editRemarkOrderNo: orderNo, remark })}>
          {remark ? remark : <a>编辑</a>}
        </span>
      </Popover>
    );
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="服务类型">
              {getFieldDecorator('serverType', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">上门喂猫</Option>
                  <Option value="1">上门遛狗</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="-1">支付失败</Option>
                  <Option value="0">待支付</Option>
                  <Option value="1">已支付</Option>
                  <Option value="2">已申请退款</Option>
                  <Option value="3">已退款</Option>
                  <Option value="4">已取消</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="爱宠官">
              {getFieldDecorator('lovePetOfficerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  // 切换页码
  handleStandardTableChange = (pagination) => {
    const { formValues } = this.state;
    const { current, pageSize } = pagination;
    this.p = {
      currentPage: parseInt(current),
      pageSize: parseInt(pageSize),
    }
    const params = {
      currentPage: parseInt(current),
      pageSize: parseInt(pageSize),
      ...formValues,
    };

    this.fetchListData(params);
  };

  render() {
    const { report: { dictData }, loading, } = this.props;
    const { list = [] } = dictData || {};

    const {
      detailsModalVisible,
      userModalVisible,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      record,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const detailsMethods = {
      handleDetailsModal: this.handleDetailsModal,
    };
    const userMethods = {
      handleUserModal: this.handleUserModal,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              scroll={{ x: 1300 }}
              rowKey={record => record.orderNo}
              loading={loading}
              columns={this.columns}
              dataSource={list}
              onChange={this.handleStandardTableChange}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                current: (dictData && dictData.currentPage) || 1,
                pageSize: (dictData && dictData.pageSize) || 10,
                total: (dictData && dictData.recordSum) || 0,
                showTotal: t => <div>共{t}条</div>,
              }}
            />
          </div>
        </Card>
        {detailsModalVisible ? (
          <Details {...detailsMethods} detailsModalVisible={detailsModalVisible} values={record} />
        ) : null}
        {userModalVisible ? (
          <UserInfo {...userMethods} userModalVisible={userModalVisible} values={record} />
        ) : null}
        {modalVisible ? (
          <Allocation {...parentMethods} modalVisible={modalVisible} values={record} />
        ) : null}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ReportLIst);
