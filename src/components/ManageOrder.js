import React, { Component } from "react";
import { getJwt, getRole } from "../helper/jwt";
import { Link } from "react-router-dom";
import { Table, Input, Button, Icon, Badge, Tag } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";

export default class ManageOrdee extends Component {
  state = {
    order: [],
    orderDetail: [],
    role: "",
    searchText: "",
    searchedColumn: ""
  };

  orderData = async () => {
    const jwt = getJwt();
    await axios
      .get("http://localhost:8080/ETutor/api/course", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      .then(res => {
        const order = res.data;
        this.setState({ order });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    //Cập nhật list data
    this.orderData();

    //Get role phân quyền
    const role = getRole();

    this.setState({
      role
    });
  }

  //Begin Search
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  //End Search

  //Expand OrderDetail
  expandedRowRender = () => {
    const columns = [
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Status",
        key: "state",
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        )
      },
      { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" }
    ];

    const data = [];
    data.push({
      key: 1,
      date: "2014-12-24 23:12:00",
      name: "This is production name",
      upgradeNum: "Upgraded: 56"
    });
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  render() {
    //Order Columns
    const orderColumns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        ...this.getColumnSearchProps("id")
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name")
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ...this.getColumnSearchProps("description")
      },
      {
        title: "Status",
        dataIndex: "name",
        key: "name",
        render: record =>
          record === "Java" ? (
            <Tag color="volcano" key={record}>
              {record.toUpperCase()}
            </Tag>
          ) : (
            <Tag color="green" key={record}>
              {record.toUpperCase()}
            </Tag>
          )
      },
      {
        title: "Action",
        dataIndex: "status",
        key: "status",
        render: () => (
          <Link to="">
            <span>Xác nhận</span>
          </Link>
        )
      }
    ];

    //Ép kiểu về Array cho object
    const order = Array.of(this.state.order);
    var datasource = [];

    //Check list có bao nhiêu phần tử
    order[0].length === undefined
      ? (datasource = order)
      : (datasource = order[0]);

    return (
      <>
        {this.state.role === "ROLE_ADMIN" ? (
          <Table
            className="components-table-demo-nested"
            columns={orderColumns}
            rowKey={datasource => datasource.id}
            dataSource={datasource}
            expandedRowRender={this.expandedRowRender}
          />
        ) : (
          <h1>User View</h1>
        )}
      </>
    );
  }
}
