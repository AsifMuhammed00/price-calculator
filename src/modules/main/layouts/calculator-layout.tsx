import React from "react";
import { createComponent, Frontend } from "@skyslit/ark-frontend";
import { Button, Dropdown, Layout,message} from 'antd';
import {Link} from 'react-router-dom';
import './calculator-layout.scss';
import {
    HomeOutlined, LockOutlined, SearchOutlined, UserOutlined   
  } from '@ant-design/icons';
 
const { Header, Footer,Content } = Layout;



export default createComponent((props) => {
    
    return(
        <Layout className="layout-main-section">
            <Header className="header-wrapper">
                <span className="header-content">Dashboard</span>
            </Header>
            <Content style={{background: "black"}}>
                {props.children}
            </Content>
            <Footer className="footer-wrapper">
                <Link to="/" className="footer-buttons"><HomeOutlined className="icon-section"/></Link>
                <Link to="/log" className="footer-buttons"><SearchOutlined className="icon-section"/></Link>
                <Link to="/add-product" className="footer-buttons"><LockOutlined className="icon-section"/></Link>
                <Link to="/sign-out" className="footer-buttons"><UserOutlined className="icon-section" /></Link>
            </Footer>   
        </Layout>
    );
});