import React from "react";
import { Layout, Menu, Icon, Breadcrumb } from "antd";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Order from "./ManageOrder";
import Store from "./ManageStore";
import { getUser } from "../helper/jwt";

const { Header, Sider, Content } = Layout;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      breadcrumb: "Order",
      user: "",
      currentPage: []
    };
  }

  componentDidMount() {
    const user = getUser();
    this.setState({
      user
    });
  }

  UNSAFE_componentWillMount() {
    if (window.location.pathname === "/order") {
      const currentPage = ["1"];
      this.setState({
        currentPage
      });
    } else if (window.location.pathname === "/store") {
      const currentPage = ["2"];
      this.setState({
        currentPage
      });
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout>
        <BrowserRouter>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={this.state.currentPage}
            >
              <Menu.Item key="1">
                <Link
                  to="/order"
                  onClick={() => {
                    this.setState({
                      breadcrumb: "Order"
                    });
                  }}
                >
                  <Icon type="shopping" />
                  <span>Order</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link
                  to="/store"
                  onClick={() => {
                    this.setState({
                      breadcrumb: "Store"
                    });
                  }}
                >
                  <Icon type="shop" />
                  <span>Store</span>
                </Link>
              </Menu.Item>
              <div className="seperator"></div>
              <Menu.Item key="3">
                <Link
                  to=""
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    localStorage.removeItem("user");
                    localStorage.removeItem("id");
                    this.props.history.push("/login");
                  }}
                >
                  <Icon type="logout" />
                  <span>Logout</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
              <h1
                style={{ float: "right", marginRight: "1%" }}
              >{`Welcome ${this.state.user}`}</h1>
            </Header>
            <Breadcrumb style={{ margin: "16px 0 0 20px" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.breadcrumb}</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 280
              }}
            >
              <Switch>
                {/* Store trước */}
                <Route path="/store" exact component={Store} />
                {/* Order sau */}
                <Route path="/order" exact component={Order} />
              </Switch>
            </Content>
          </Layout>
        </BrowserRouter>
      </Layout>
    );
  }
}
