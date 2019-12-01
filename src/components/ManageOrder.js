import React, { Component } from "react";
import { getJwt, getRole } from "../helper/jwt";
import { Table, Badge } from "antd";
// import { Link } from "react-router-dom";
import axios from "axios";

export default class ManageOrdee extends Component {
  state = {
    order: [],
    role: ""
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
    const columns = [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Description", dataIndex: "description", key: "description" }
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
            columns={columns}
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
