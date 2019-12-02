import React, { Component } from "react";
import { getJwt, getRole, getID } from "../helper/jwt";
import { Table, Input, Button, Icon, Modal, Form, Select } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";
const { Option } = Select;

export default class ManageStore extends Component {
  state = {
    store: [],
    category: [],
    role: "",
    id: "",
    searchText: "",
    searchedColumn: "",
    visible: false
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
    const id = getID();
    this.setState({
      role,
      id
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

  //Modal

  //Load list category
  showModal = async () => {
    const jwt = getJwt();
    await axios
      .get("https://mffood.herokuapp.com/api/categories/", {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        const category = res.data;
        this.setState({ category, visible: true });
      })
      .catch(err => console.log(err));
  };

  //Load category option
  categoryOption() {
    return this.state.category.map((obj, i) => {
      return (
        <Option key={i} value={obj.idCategory}>
          {obj.name}
        </Option>
      );
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  //save Store
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      values.idUser = this.state.id;
      const jwt = getJwt();
      await axios
        .post("https://mffood.herokuapp.com/api/stores/", values, {
          headers: {
            token: jwt
          }
        })
        .then(res => {
          this.storeData();
        })
        .catch(err => console.log(err));
      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  //End modal

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
        {!this.state.role === "ROLE_STOREADMIN" ? (
          <Table
            {...this.state}
            className="components-table-demo-nested"
            columns={storeColumns}
            rowKey={datasource => datasource.idStore}
            dataSource={datasource}
            expandedRowRender={storeDetail}
          />
        ) : (
          <>
            <div className="modal">
              <Button type="primary" onClick={this.showModal} icon="plus">
                Add Store
              </Button>
              <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                category={this.categoryOption()}
              />
            </div>
            <Table
              {...this.state}
              className="components-table-demo-nested"
              columns={storeColumns}
              rowKey={datasource => datasource.idStore}
              dataSource={datasource}
              expandedRowRender={storeDetail}
            />
          </>
        )}
      </>
    );
  }
}

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, category } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add a new store"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input store's name!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description", {
                rules: [
                  {
                    required: true,
                    message: "Please input store's description!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Category">
              {getFieldDecorator("idCate", {
                rules: [
                  { required: true, message: "Please select store's category!" }
                ]
              })(
                <Select
                  placeholder="Select a catergory"
                  onChange={this.handleSelectChange}
                >
                  {category}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
