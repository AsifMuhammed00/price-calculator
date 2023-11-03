import React from "react";
import { createComponent, Frontend } from "@skyslit/ark-frontend";
import { Col, Row, Typography, Form, Button, Input, message, Divider, Card, List, Modal, Calendar, theme, Table } from "antd";
// import '../styles/admin-page.scss';
import Lottie from "react-lottie";
import AbstractBlue from "../assets/lottie-files/abstract-blue-and-yellow.json";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet-async";
import Fade from "react-reveal/Fade";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import moment from "moment";

const { Title } = Typography;
const { Search } = Input;


export default createComponent((props) => {
    const formRef = React.useRef();
    const history = useHistory();
    const { useService } = props.use(Frontend);
    const addToLog = useService({ serviceId: "get-logs" });
    const [logDetails, setLogDetails] = React.useState()

    const columns = [
        {
            title: 'Products',
            dataIndex: 'itemName',
            key: 'name',
            render: text => text.charAt(0).toUpperCase() + text.slice(1)
        },
        {
            title: 'Number of products sold',
            dataIndex: 'count',
            key: 'count',
        },
    ];




    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid black`,
        borderRadius: 3,
    };


    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        const date = value ? value.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        addToLog.invoke({
            date
        }, { force: true })
            .then((res) => {
                console.log("res", res)
                setLogDetails(res.data)
            })
            .catch((e) => {
                message.error(e.message)
            })
    };

    React.useEffect(() => {
        onPanelChange()
    }, [])

    return (
        <>
            <div style={{ padding: 16 }}>
                <h2><b>Select Date to show the log</b></h2>
                <div style={wrapperStyle}>
                    <Calendar fullscreen={false} onChange={onPanelChange} />
                </div>
                <div style={{marginTop:30}}>
                    <h2><b>Sold Products</b></h2>
                    <Table dataSource={logDetails?.products} columns={columns} pagination={false}/>
                </div>
                <div style={{marginTop:20}}>
                    {logDetails?.total ? (
                        <h1><b>Total: ₹{logDetails?.total}</b></h1>
                    ) : (
                        null
                    )}
                </div>
            </div>
        </>
    );
});
