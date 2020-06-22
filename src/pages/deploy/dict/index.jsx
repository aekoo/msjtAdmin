import { Row, Col, Button, Badge, Card, Divider, Form, Table, Icon, Input, Select, Popconfirm, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import styles from './style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
class DictList extends Component {
  state = {
    modalVisible: false,
    record: {},
  };

  p = {
    currentPage: 1,
    pageSize: 10,
  };
  columns = [
    {
      title: '类型ID',
      dataIndex: 'data_id',
    },
    {
      title: '类型名称',
      dataIndex: 'data_content',
    },
    {
      title: '状态',
      dataIndex: 'valid_flag',
      render: (text, record) => <Badge status={text == 1 ? 'success' : 'error'} text={text == 1 ? '启用' : '禁用'} />
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            okType="danger"
            onConfirm={() => this.deleteFunc(record)}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a>禁用</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  // 查询列表
  fetchListData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'deploy/fetchDict' });
  };
  // 添加-编辑
  editFunc = params => {
    const { dispatch } = this.props;
    if (params.data_id) {
      //编辑
      dispatch({
        type: 'deploy/editDict',
        payload: params,
      });
    } else {
      // 添加
      dispatch({
        type: 'deploy/addDict',
        payload: params,
      });
    }
    this.handleModalVisible();
  };
  // 删除
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { data_id } = record;
    dispatch({
      type: 'deploy/deleteDict',
      payload: { data_id },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record: record || {},
    });
  };


  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'deploy/dictTypeChange',
        payload: fieldsValue.dictType,
      });
      this.fetchListData();
    });
  };
  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'deploy/dictTypeChange',
      payload: '3',
    });
    this.fetchListData();
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类型名称">
              {getFieldDecorator('data_content', { initialValue: '' })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { deploy: { dictData }, loading, } = this.props;
    const { modalVisible, record } = this.state;

    const parentMethods = {
      handleAdd: this.editFunc,
      handleModalVisible: this.handleModalVisible,
      record,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加
              </Button>
            </div>
            <Table
              rowKey={record => record.com_id}
              loading={loading}
              columns={this.columns}
              dataSource={dictData}
            />
          </div>
        </Card>
        {modalVisible ? <CreateForm {...parentMethods} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(DictList);
