import {
  Button,
  Card,
  Col,
  Divider,
  DatePicker,
  Form,
  Input,
  Icon,
  Popover,
  Popconfirm,
  Table,
  Select,
  Row,
  Modal,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import InfoDetils from './components/infoDetils';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';

/* eslint react/no-multi-comp:0 */
@connect(({ report, loading }) => ({
  report,
  loading: loading.models.report,
}))
class ReportLIst extends Component {
  state = {
    modalVisible: false,
    infoModalVisible: false,
    isDispose: false,
    formValues: {},
    peview: '',
    findID: '',
  };

  p = {
    currentpage: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '举报ID',
      dataIndex: 'com_id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '车牌号码',
      dataIndex: 'com_carno',
      width: 120,
    },
    {
      title: '举报内容',
      dataIndex: 'com_content',
      width: 300,
      render: text => (
        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</p>
      ),
    },
    {
      title: '举报时间',
      dataIndex: 'com_date',
      width: 200,
    },
    {
      title: '举报人',
      dataIndex: 'com_name',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'com_tel',
      width: 120,
    },
    {
      title: '身份证号码',
      dataIndex: 'com_cardid',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'data_contents',
      width: 100,
    },
    {
      title: '补充图片',
      dataIndex: 'com_pic',
      width: 100,
      render: val => {
        const photoList = val ? val.split(',') : [];
        return val ? (
          <div>
            {photoList.map(item => (
              <img
                style={{ width: 30, height: 30, marginRight: 5 }}
                src={`${item}`}
                onClick={() => this.handleModalVisible(true, item)}
              />
            ))}
          </div>
        ) : (
            '-'
          );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      render: text => (
        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</p>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      render: (text, record) =>
        record.data_contents != '已归档' ? (
          <span>
            <Button
              type="primary"
              size="small"
              onClick={() => this.handleInfoModal(true, record.com_id)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Button
              type="primary"
              size="small"
              onClick={() => this.handleInfoModal(true, record.com_id, true)}
            >
              处理
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除？"
              okType="danger"
              onConfirm={() => this.editComplaint(record.com_id, 5)}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <Button type="danger" ghost size="small">
                归档
              </Button>
            </Popconfirm>
          </span>
        ) : (
            <Button
              type="primary"
              size="small"
              onClick={() => this.handleInfoModal(true, record.com_id)}
            >
              查看
            </Button>
          ),
    },
  ];

  componentDidMount() {
    this.fetchListData();
    this.fetchAllStatus();
  }
  fetchListData = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetch',
      payload: params,
    });
  };
  fetchAllStatus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetchAllStatus',
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
      const rangeValue = fieldsValue['searchDate'];
      this.setState({ formValues: fieldsValue });
      let params = {
        ...fieldsValue,
        start_time: rangeValue ? rangeValue[0].format('YYYY-MM-DD') : '',
        end_time: rangeValue ? rangeValue[1].format('YYYY-MM-DD') : '',
      };
      // delete params.searchDate;
      this.fetchListData(params);
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
    this.fetchListData();
  };

  handleModalVisible = (flag, images) => {
    this.setState({
      modalVisible: !!flag,
      peview: images || '',
    });
  };
  handleInfoModal = (flag, findID, isDispose) => {
    this.setState({
      infoModalVisible: !!flag,
      findID,
      isDispose: !!isDispose
    });
  };

  // 处理&归档
  editComplaint = (com_id, com_status, remark) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/editComplaint',
      payload: { com_id, com_status, remark },
    });
    this.handleInfoModal();
  };

  // 导出
  handleDownload = () => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const rangeValue = formValues['searchDate'];
    let params = {
      ...formValues,
      start_time: rangeValue ? rangeValue[0].format('YYYY-MM-DD') : '',
      end_time: rangeValue ? rangeValue[1].format('YYYY-MM-DD') : '',
    };
    var now = moment()
      .locale('zh-cn')
      .format('YYYY-MM-DD');
    const fileName = now + '.xlsx';
    dispatch({
      type: 'report/exportData',
      payload: params,
      callback: blob => {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');
          const evt = document.createEvent('MouseEvents');
          link.style.display = 'none';
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link); // 此写法兼容可火狐浏览器
          evt.initEvent('click', false, false);
          link.dispatchEvent(evt);
          document.body.removeChild(link);
        }
        message.success('导出成功');
      },
    });
  };

  renderForm() {
    const {
      report: { statusData = [] },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="举报时间">
              {getFieldDecorator('searchDate', { initialValue: '' })(
                <RangePicker format={dateFormat} />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="举报人">
              {getFieldDecorator('name', { initialValue: '' })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('tel', { initialValue: '' })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="身份证号码">
              {getFieldDecorator('cardId', { initialValue: '' })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="举报类容">
              {getFieldDecorator('com_content', { initialValue: '' })(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key="0" value="">
                    全部
                  </Option>
                  {statusData.map(item => (
                    <Option key={item.data_id} value={item.data_id}>
                      {item.data_content}
                    </Option>
                  ))}
                </Select>,
              )}
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
  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const { current, pageSize } = pagination;
    this.p = {
      currentpage: parseInt(current),
      pageSize: parseInt(pageSize),
    };
    const params = {
      currentpage: parseInt(current),
      pageSize: parseInt(pageSize),
      ...formValues,
    };

    this.fetchListData(params);
  };

  render() {
    const {
      report: { listData },
      loading,
    } = this.props;
    const { list = [] } = listData || {};

    const { modalVisible, infoModalVisible, peview, findID, isDispose } = this.state;

    const infoMethods = {
      handleInfoModal: this.handleInfoModal,
      handleInfoModalOk: this.editComplaint,
      findID,
      isDispose
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              scroll={{ x: 1300 }}
              size="small"
              rowKey={record => record.com_id}
              loading={loading}
              columns={this.columns}
              dataSource={list}
              onChange={this.handleStandardTableChange}
              pagination={{
                // showQuickJumper: true,
                // showSizeChanger: true,
                current: (listData && listData.currentPage) || 1,
                pageSize: (listData && listData.pageSize) || 10,
                total: (listData && listData.totalCount) || 0,
                showTotal: t => <div>共{t}条</div>,
              }}
              footer={() => (
                <Button type="primary" onClick={this.handleDownload}>
                  导出数据
                </Button>
              )}
            />
          </div>
        </Card>

        <Modal
          width={1000}
          destroyOnClose
          title=""
          visible={modalVisible}
          footer={null}
          onCancel={() => this.handleModalVisible()}
        >
          <img style={{ width: '96%' }} src={peview} />
        </Modal>

        {infoModalVisible ? <InfoDetils {...infoMethods} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ReportLIst);
