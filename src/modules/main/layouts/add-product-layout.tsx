import React from "react";
import { createComponent , Frontend} from "@skyslit/ark-frontend";
import { Layout,message,Button,Dropdown} from 'antd';
import {Link} from 'react-router-dom';
import './calculator-layout.scss';
import {
    BookOutlined,
    CodeSandboxOutlined,
    HomeOutlined, LockOutlined, SearchOutlined, UserOutlined   
  } from '@ant-design/icons';
 
const {Footer,Content } = Layout;

export default createComponent((props) => {
    
    return(
        <Layout className="layout-main-section">
            <Content style={{background: "black"}}>
                {props.children}
            </Content>
            <Footer className="footer-wrapper">
                <Link to="/" className="footer-buttons"><HomeOutlined className="icon-section"/></Link>
                <Link to="/log" className="footer-buttons"><BookOutlined className="icon-section"/></Link>
                <Link to="/add-product" className="footer-buttons"><CodeSandboxOutlined className="icon-section"/></Link>
                <Link to="/sign-out" className="footer-buttons"><UserOutlined className="icon-section" /></Link>
            </Footer>
        </Layout>
    );
});