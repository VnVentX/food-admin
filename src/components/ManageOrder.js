import React, { Component } from "react";
import { getJwt, getRole, getID } from "../helper/jwt";
import { Table, Input, Button, Icon, Tag, Modal } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";
import "../modal.css";

export default class ManageOrder extends Component {
  state = {
    store: [],
    storeID: "",
    order: [],
    role: "",
    id: "",
    searchText: "",
    searchedColumn: ""
  };

  //!all store
  storeAdmin = async () => {
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

  //!Start ROLE_STOREADMIN
  storeData = async () => {
    const jwt = getJwt();
    const id = this.state.id;
    await axios
      .get("https://mffood.herokuapp.com/api/stores/byUser/" + id, {
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

  orderData = async id => {
    const jwt = getJwt();
    await axios
      .get("https://mffood.herokuapp.com/api/orders/byStore/" + id, {
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
      this.storeAdmin();
    } else if (this.state.role === "ROLE_STOREADMIN") {
      this.storeData();
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

  //Modal
  handleCancel = () => {
    this.setState({
      visible: false,
      order: []
    });
  };

  //!Verify Action
  verifyOrder = async record => {
    const jwt = getJwt();
    const idOrders = record.idOrders;
    try {
      await fetch(`https://mffood.herokuapp.com/api/orders/${idOrders}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          token: jwt
        }
      });
      this.orderData(this.state.storeID);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  render() {
    //Order Detail
    const orderDetailColumns = [
      {
        title: "ID Order",
        dataIndex: "idOrders",
        key: "idOrders",
        ...this.getColumnSearchProps("idOrders")
      },
      {
        title: "Customer Name",
        dataIndex: "userFullName",
        key: "userFullName",
        ...this.getColumnSearchProps("userFullName")
      },
      {
        title: "Total",
        dataIndex: "totalPrice",
        key: "totalPrice",
        ...this.getColumnSearchProps("totalPrice")
      },
      {
        title: "Time",
        dataIndex: "createAt",
        key: "createAt",
        ...this.getColumnSearchProps("createAt")
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: status => (
          <span>
            {status === "PENDING" ? (
              <Tag color={"volcano"} key={status}>
                PENDING
              </Tag>
            ) : (
              <Tag color={"green"} key={status}>
                DONE
              </Tag>
            )}
          </span>
        )
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: record => (
          <button
            className="ant-btn-link"
            onClick={async () => {
              this.verifyOrder(record);
            }}
          >
            Change Status
          </button>
        )
      }
    ];

    //Order Detail Admin
    const orderDetailAdminColumns = [
      {
        title: "ID Order",
        dataIndex: "idOrders",
        key: "idOrders",
        ...this.getColumnSearchProps("idOrders")
      },
      {
        title: "Customer Name",
        dataIndex: "userFullName",
        key: "userFullName",
        ...this.getColumnSearchProps("userFullName")
      },
      {
        title: "Total",
        dataIndex: "totalPrice",
        key: "totalPrice",
        ...this.getColumnSearchProps("totalPrice")
      },
      {
        title: "Time",
        dataIndex: "createAt",
        key: "createAt",
        ...this.getColumnSearchProps("createAt")
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: status => (
          <span>
            {status === "PENDING" ? (
              <Tag color={"volcano"} key={status}>
                PENDING
              </Tag>
            ) : (
              <Tag color={"green"} key={status}>
                DONE
              </Tag>
            )}
          </span>
        )
      }
    ];

    //Store Columns
    const storeColumns = [
      {
        title: "Store Name",
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
              this.orderData(record.idStore);
              this.setState({
                visible: true,
                storeID: record.idStore
              });
            }}
          >
            View Orders
          </button>
        )
      }
    ];

    //Ép kiểu về Array cho object
    const store = Array.of(this.state.store);
    var datasource = [];

    //Check list có bao nhiêu phần tử
    store[0].length === undefined
      ? (datasource = store)
      : (datasource = store[0]);

    return (
      <>
        <Table
          {...this.state}
          className="components-table-demo-nested"
          columns={storeColumns}
          rowKey={datasource => datasource.idStore}
          dataSource={datasource}
        />
        <OrderDetail
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          title={this.state.modalTitle}
          columnStore={orderDetailColumns}
          columnAdmin={orderDetailAdminColumns}
          datasource={this.state.order}
          role={this.state.role}
        />
      </>
    );
  }
}

const OrderDetail =
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible,
        onCancel,
        role,
        columnStore,
        columnAdmin,
        datasource
      } = this.props;

      const listOrderDetail = record => {
        const columns = [
          {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName"
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity"
          },
          { title: "Price", dataIndex: "unitPrice", key: "unitPrice" }
        ];
        const data = record.orderDetail;
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
        <Modal
          className="order-modal"
          visible={visible}
          title="Order Detail"
          onCancel={onCancel}
          okButtonProps={{ style: { display: "none" } }}
        >
          {role === "ROLE_STOREADMIN" ? (
            <Table
              className="components-table-demo-nested"
              columns={columnStore}
              rowKey={datasource => datasource.idOrders}
              dataSource={datasource}
              expandedRowRender={listOrderDetail}
            />
          ) : (
            <Table
              className="components-table-demo-nested"
              columns={columnAdmin}
              rowKey={datasource => datasource.idOrders}
              dataSource={datasource}
              expandedRowRender={listOrderDetail}
            />
          )}
        </Modal>
      );
    }
  };
