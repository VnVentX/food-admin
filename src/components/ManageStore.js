import React, { Component } from "react";
import { getJwt, getRole } from "../helper/jwt";
import { Link } from "react-router-dom";
import { Table, Input, Button, Icon, Badge, Tag } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";

export default class ManageStore extends Component {
  state = {
    store: [],
    role: "",
    searchText: "",
    searchedColumn: ""
  };

  storeDataAdmin = async () => {
    const jwt = getJwt();
    await axios
      .get("https://mffood.herokuapp.com/api/stores/", {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        const store = res.data;
        this.setState({ store });
      })
      .catch(err => console.log(err));
  };

  storeData = async () => {
    const jwt = getJwt();
    await axios
      .get("https://mffood.herokuapp.com/api/stores/", {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        const store = res.data;
        this.setState({ store });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    //Get role phân quyền
    const role = getRole();
    this.setState({
      role
    });

    //Cập nhật list data
    if (this.state.role === "ROLE_STOREADMIN") {
      this.storeDataAdmin();
    }
    this.storeData();
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

  render() {
    //Store Columns
    const storeColumns = [
      {
        title: "ID",
        dataIndex: "idStore",
        key: "idStore",
        ...this.getColumnSearchProps("idStore")
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
      }
    ];

    //Ép kiểu về Array cho object
    const store = Array.of(this.state.store);
    var datasource = [];

    //Check list có bao nhiêu phần tử
    store[0].length === undefined
      ? (datasource = store)
      : (datasource = store[0]);

    //Store Detail
    const storeDetail = record => {
      const columns = [
        { title: "ID", dataIndex: "idCategory", key: "idCategory" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" }
      ];
      const data = record.categoryStoresByIdStore;

      return (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={data => data.idCategory}
          pagination={false}
        />
      );
    };

    return (
      <>
        {this.state.role === "ROLE_STOREADMIN" ? (
          <Table
            {...this.state}
            className="components-table-demo-nested"
            columns={storeColumns}
            rowKey={datasource => datasource.idStore}
            dataSource={datasource}
            expandedRowRender={storeDetail}
          />
        ) : (
          <h1>User View</h1>
        )}
      </>
    );
  }
}
