import React, { Component } from "react";
import { getJwt, getRole, getID } from "../helper/jwt";
import { Table, Input, Button, Icon } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";

export default class ManageOrder extends Component {
  state = {
    order: [],
    role: "",
    id: "",
    searchText: "",
    searchedColumn: ""
  };

  //!all store
  orderDataAdmin = async () => {
    const jwt = getJwt();
    await axios
      .get("https://mffood.herokuapp.com/api/stores/", {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        const order = res.data;
        this.setState({ order });
      })
      .catch(err => console.log(err));
  };

  //!store by ROLE_STOREADMIN
  orderData = async () => {
    const jwt = getJwt();
    const id = this.state.id;
    await axios
      .get("https://mffood.herokuapp.com/api/stores/byUser/" + id, {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        const order = res.data;
        this.setState({ order });
      })
      .catch(err => console.log(err));
  };

  retrievedData() {
    if (this.state.role === "ROLE_ADMIN") {
      this.orderDataAdmin();
    } else if (this.state.role === "ROLE_STOREADMIN") {
      this.orderData();
    }
  }

  async componentDidMount() {
    //Get role phân quyền
    const role = getRole();
    const id = getID();
    await this.setState({
      role,
      id
    });
    //Cập nhật list data
    this.retrievedData();
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
    const orderColumns = [
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
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <button
            className="ant-btn-link"
            onClick={async () => {
              const idStore = record.idStore;
              await this.setState({
                btnModal: "Create",
                visible: true,
                isAddProduct: true,
                modalTitle: "Create new product",
                idStore
              });
              this.showCategory();
            }}
          >
            Add Product
          </button>
        )
      }
    ];

    const orderColumnsAdmin = [
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
    const order = Array.of(this.state.order);
    var datasource = [];

    //Check list có bao nhiêu phần tử
    order[0].length === undefined
      ? (datasource = order)
      : (datasource = order[0]);

    //Order Detail
    const orderDetail = record => {
      const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Price", dataIndex: "price", key: "price" },
        {
          title: "Action",
          dataIndex: "",
          key: "x",
          render: record => (
            <button
              className="ant-btn-link"
              onClick={async () => {
                const jwt = getJwt();
                console.log("Product ID: " + record.idProduct);
                await axios
                  .get(
                    "https://mffood.herokuapp.com/api/products/" +
                      record.idProduct,
                    {
                      headers: {
                        token: jwt
                      }
                    }
                  )
                  .then(res => {
                    const edittingProduct = res.data;
                    this.setState({
                      edittingProduct,
                      btnModal: "Update",
                      visible: true,
                      isEditProduct: true,
                      modalTitle: "Edit product"
                    });
                  })
                  .catch(err => console.log(err));
                this.showCategory();
              }}
            >
              Edit Product
            </button>
          )
        }
      ];

      const data = record.productsByIdStore;
      return (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={data => data.idProduct}
          pagination={false}
        />
      );
    };
    const orderDetailAdmin = record => {
      const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Price", dataIndex: "price", key: "price" }
      ];

      const data = record.productsByIdStore;
      return (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={data => data.idProduct}
          pagination={false}
        />
      );
    };

    return (
      <>
        {this.state.role === "ROLE_ADMIN" ? (
          //ADMIN
          <Table
            {...this.state}
            className="components-table-demo-nested"
            columns={orderColumnsAdmin}
            rowKey={datasource => datasource.idStore}
            dataSource={datasource}
            expandedRowRender={orderDetailAdmin}
          />
        ) : (
          //STOREADMIN
          <>
            <Table
              {...this.state}
              className="components-table-demo-nested"
              columns={orderColumns}
              rowKey={datasource => datasource.idStore}
              dataSource={datasource}
              expandedRowRender={orderDetail}
            />
          </>
        )}
      </>
    );
  }
}
