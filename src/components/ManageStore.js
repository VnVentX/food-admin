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
    idStore: "",
    searchText: "",
    searchedColumn: "",
    isAddProduct: false,
    isEditProduct: false,
    modalTitle: "",
    visible: false,
    edittingProduct: {},
    btnModal: ""
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

  //!Load list category
  showCategory = async () => {
    const jwt = getJwt();
    await axios
      .get("https://mffood.herokuapp.com/api/categories/", {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        const category = res.data;
        this.setState({
          category
        });
      })
      .catch(err => console.log(err));
  };

  showAddStoreModal = () => {
    this.showCategory();
    this.setState({
      visible: true,
      modalTitle: "Create new store",
      btnModal: "Create"
    });
  };

  //!Load category option
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
    this.setState({
      visible: false,
      isAddProduct: false,
      isEditProduct: false,
      edittingProduct: {}
    });
  };

  //!save form
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      if (
        this.state.isAddProduct === false &&
        this.state.isEditProduct === false
      ) {
        //!save store
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
      } else if (this.state.isAddProduct === true) {
        //!save product
        values.idStore = this.state.idStore;
        const jwt = getJwt();
        await axios
          .post("https://mffood.herokuapp.com/api/products/", values, {
            headers: {
              token: jwt
            }
          })
          .then(res => {
            this.storeData();
          })
          .catch(err => console.log(err));
      } else if (this.state.isEditProduct === true) {
        //!update product
        const jwt = getJwt();
        console.log("đang update");
        //gán value vào object
        values.idStore = this.state.edittingProduct.idStore;
        values.idProduct = this.state.edittingProduct.idProduct;
        values.imageLink = values.imagePath;
        values.idCategory = values.idCate;
        await axios
          .put("https://mffood.herokuapp.com/api/products/", values, {
            headers: {
              token: jwt
            }
          })
          .then(res => {
            this.storeData();
          })
          .catch(err => console.log(err));
      }
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
                    this.setState({ edittingProduct });
                    console.log(this.state.edittingProduct);
                  })
                  .catch(err => console.log(err));
                await this.setState({
                  btnModal: "Update",
                  visible: true,
                  isEditProduct: true,
                  modalTitle: "Edit product"
                });
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

    return (
      <>
        {!this.state.role === "ROLE_STOREADMIN" ? (
          //Admin
          <Table
            {...this.state}
            className="components-table-demo-nested"
            columns={storeColumns}
            rowKey={datasource => datasource.idStore}
            dataSource={datasource}
            expandedRowRender={storeDetail}
          />
        ) : (
          //User
          <>
            <div className="modal">
              <Button
                type="primary"
                onClick={this.showAddStoreModal}
                icon="plus"
              >
                Add Store
              </Button>
              <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                category={this.categoryOption()}
                isAddProduct={this.state.isAddProduct}
                isEditProduct={this.state.isEditProduct}
                title={this.state.modalTitle}
                btnModal={this.state.btnModal}
                edittingProduct={this.state.edittingProduct}
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
    reset = () => {
      this.props.form.resetFields();
    };

    render() {
      const {
        title,
        btnModal,
        visible,
        onCancel,
        onCreate,
        form,
        category,
        isAddProduct,
        isEditProduct,
        edittingProduct
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText={btnModal}
          onCancel={() => {
            onCancel();
            this.props.form.resetFields();
          }}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                initialValue: edittingProduct.name,
                rules: [
                  {
                    required: true,
                    message: "Please input name!"
                  }
                ]
              })(<Input placeholder="Input name" />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description", {
                initialValue: edittingProduct.description,
                rules: [
                  {
                    required: true,
                    message: "Please input description!"
                  }
                ]
              })(<Input placeholder="Input description" />)}
            </Form.Item>
            <Form.Item label="Category">
              {getFieldDecorator("idCate", {
                initialValue: edittingProduct.idCategory,
                rules: [{ required: true, message: "Please select category!" }]
              })(
                <Select
                  placeholder="Select a catergory"
                  onChange={this.handleSelectChange}
                  onClick={this.showCategory}
                >
                  {category}
                </Select>
              )}
            </Form.Item>
            {/* //!form condition */}
            {isAddProduct === true || isEditProduct === true ? (
              //Create Product
              <>
                <Form.Item label="Price">
                  {getFieldDecorator("price", {
                    initialValue: edittingProduct.price,
                    rules: [
                      {
                        required: true,
                        message: "Please input product's price!"
                      }
                    ]
                  })(<Input placeholder="Input price" type="number" />)}
                </Form.Item>
                <Form.Item label="Product Image">
                  {getFieldDecorator("imagePath", {
                    initialValue: edittingProduct.imageLink,
                    rules: [
                      {
                        required: true,
                        // pattern: new RegExp(
                        //   "^(https?|ftp|torrent|image|irc)://(-.)?([^s/?.#-]+.?)+(/[^s]*)?$"
                        // ),
                        message: "Please input valid link of your image!"
                      }
                    ]
                  })(<Input placeholder="Input store image url" />)}
                </Form.Item>
              </>
            ) : (
              // Create Store
              <Form.Item label="Store Image">
                {getFieldDecorator("imagePath", {
                  rules: [
                    {
                      required: true,
                      // pattern: new RegExp(
                      //   "^(https?|ftp|torrent|image|irc)://(-.)?([^s/?.#-]+.?)+(/[^s]*)?$"
                      // ),
                      message: "Please input valid link of your store's image!"
                    }
                  ]
                })(<Input placeholder="Input store image url" />)}
              </Form.Item>
            )}
          </Form>
        </Modal>
      );
    }
  }
);
