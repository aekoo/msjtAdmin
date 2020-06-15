import { Button, Card, Col, DatePicker, Form, Input, Table, Row, Modal, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

/* eslint react/no-multi-comp:0 */
@connect(({ report, loading }) => ({
	report,
	loading: loading.models.report,
}))
class ReportLIst extends Component {
	state = {
		modalVisible: false,
		formValues: {},
		peview: '',
	};

	p = {
		currentpage: 1,
		pageSize: 10,
	};

	columns = [
		{
			title: '举报ID',
			dataIndex: 'com_id',
			width: 120,
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
			title: '补充图片',
			dataIndex: 'com_pic',
			width: 300,
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
			title: '操作',
			dataIndex: 'action',
			width: 200,
			align: 'center',
			// render: (text, record) =>
			//   record.dictId != 3 ? (
			//     <span>
			//       <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
			//       <Divider type="vertical" />
			//       <Popconfirm
			//         title="确定要删除？"
			//         okType="danger"
			//         onConfirm={() => this.deleteFunc(record)}
			//         icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
			//       >
			//         <a>删除</a>
			//       </Popconfirm>
			//     </span>
			//   ) : null,
		},
	];

	componentDidMount() {
		this.fetchListData();
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
		if (e) { e.preventDefault(); }
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

	handleModalVisible = (flag, record) => {
		this.setState({
			modalVisible: !!flag,
			peview: record || '',
		});
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
		var now = moment().locale('zh-cn').format('YYYY-MM-DD');
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
				message.success('导出成功')
			},
		});
	};

	renderForm() {
		const {
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
							{getFieldDecorator('tel', { initialValue: '' })(
								<Input placeholder="请输入" />,
							)}
						</FormItem>
					</Col>
					<Col md={6} sm={24}>
						<FormItem label="身份证号码">
							{getFieldDecorator('cardId', { initialValue: '' })(<Input placeholder="请输入" />)}
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

		const { modalVisible, peview } = this.state;

		return (
			<PageHeaderWrapper>
				<Card bordered={false}>
					<div className={styles.tableList}>
						<div className={styles.tableListForm}>{this.renderForm()}</div>
						<Table
							scroll={{ x: 1300 }}
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
							footer={() => <Button type="primary" onClick={this.handleDownload} >导出数据</Button>}
						/>
					</div>
				</Card>

				<Modal
					destroyOnClose
					title=""
					visible={modalVisible}
					footer={null}
					onCancel={() => this.handleModalVisible()}
				>
					<img style={{ width: 450 }} src={peview} />
				</Modal>
			</PageHeaderWrapper>
		);
	}
}

export default Form.create()(ReportLIst);
