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
import './log-page.scss';

const { Title } = Typography;
const { Search } = Input;


export default createComponent((props) => {
    const formRef = React.useRef();
    const history = useHistory();
    const { useService } = props.use(Frontend);
    const addToLog = useService({ serviceId: "get-logs" });
    const [logDetails, setLogDetails] = React.useState();
    const [isCalendarOpen, setCalendarOpen] = React.useState();
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [show, setShow] = React.useState(false);

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

    const wrapperStyle = {
        display: isCalendarOpen ? 'block' : 'none'
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

    const toggleCalendar = () => {
        setCalendarOpen(!isCalendarOpen);
    };

    const onSelect = (value) => {
        setSelectedDate(value);
        setCalendarOpen(false);
    };

    React.useEffect(() => {
        setShow(true);
        const handleBeforeUnload = () => {
            setShow(false);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <>
        <Fade duration={2000}>
            <div className={`log-section-main ${show ? 'fade-enter-active' : 'fade-exit-active'}`}>
                <h2 className="heading">
                    <b className="top-heading">Logs</b>
                </h2>
                <div className="date-main-section" onClick={toggleCalendar}>
                    <div className="date">{selectedDate ? selectedDate.format('DD MMM YY') : moment().format('DD MMM YY')}</div>
                </div>
                <div style={wrapperStyle} className="calendar-section">
                    <Calendar fullscreen={false} onChange={onPanelChange} onSelect={onSelect}/>
                </div>
                <div className="product-heading">
                    <h2><b className="heading-content">Sold Products</b></h2>
                    <Table dataSource={logDetails?.products} columns={columns} pagination={false} loading={!logDetails?.products} className="odd-row-background"/>
                </div>
                <div className="total-section">
                    {logDetails?.total ? (
                        <h1 className="amount-section-whole">
                            <b className="amount">Total: ₹{logDetails?.total}</b>
                        </h1>
                    ) : (
                        null
                    )}
                </div>
            </div>
            </Fade>
        </>
    );
});
