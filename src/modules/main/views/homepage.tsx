import React from "react";
import { createComponent, Frontend } from "@skyslit/ark-frontend";
import { Col, Row, Typography, Form, Button, Input, message, Divider, Card, List, Modal } from "antd";
// import '../styles/admin-page.scss';
import Lottie from "react-lottie";
import AbstractBlue from "../assets/lottie-files/abstract-blue-and-yellow.json";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet-async";
import Fade from "react-reveal/Fade";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from "moment";
import './homepage.scss';
import { Prompt } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

export default createComponent((props) => {
    const formRef = React.useRef();
    const history = useHistory();
    const { useService, useContext } = props.use(Frontend);

    const context = useContext()

    const [allProducts, setAllProducts] = React.useState([])
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [items, setItems] = React.useState([]);
    const logoutService = useService({ serviceId: "user-logout" });


    const [keyword, setKeyword] = React.useState("")

    const listAllProduct = useService({ serviceId: "list-all-products" });
    const addToLog = useService({ serviceId: "add-to-log" });

    function priceCalculator(products) {
        const itemRates = products.map((p) => {
            return (
                p.total
            )
        })
        return itemRates.reduce((accumulator, current) => accumulator + current, 0);
    }

    const totalCost = priceCalculator(selectedItems)



    const logoutUser = () => {
        logoutService
            .invoke()
            .then((res) => { })
            .catch((e) => {
                message.error("Try again!");
            })
            .finally(() => context.invoke(null, { force: true }));
    };

    const handleListAllProduct = React.useCallback(() => {
        listAllProduct.invoke({}, { force: true })
            .then((res) => {
                setAllProducts(res.data)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [])

    const handleAddToLog = React.useCallback(() => {
        addToLog.invoke({
            products: items,
            totalPrice: totalCost
        }, { force: true })
            .then((res) => {
                setSelectedItems([])
                setItems([])
                message.success("Added to log")
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [totalCost, items])


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    React.useEffect(() => {
        handleListAllProduct()
    }, [])

    const filteredProducts = React.useMemo(() => {
        const regex = new RegExp(keyword, 'i');
        if (keyword) {
            return allProducts.filter(product => regex.test(product.productName));
        } else {
            return allProducts
        }
    }, [keyword, allProducts])


    const toggleSelection = (item: any) => {
        if (selectedItems.some((selectedItem: any) => selectedItem._id === item._id)) {
            setSelectedItems(selectedItems.filter((selectedItem: any) => selectedItem._id !== item._id));
            setItems(items.filter((selectedItem: any) => selectedItem.productName !== item.productName))
        } else {
            setSelectedItems([...selectedItems, { ...item, Qty: 1, total: item.price }]);
            setItems([...items, { Qty: 1, total: item.price, productName: item.productName, price: item.price }]);

        }
    };

    const incrementQty = (item: any) => {
        const updatedSelectedItems = selectedItems.map((selectedItem: any) =>
            selectedItem._id === item._id ? { ...selectedItem, Qty: selectedItem.Qty + 1, total: selectedItem.price * (selectedItem.Qty + 1) } : selectedItem
        );
        const updatedSelectedItemsForLog = items.map((selectedItem: any) =>
            selectedItem.productName === item.productName ? { ...selectedItem, Qty: selectedItem.Qty + 1, total: selectedItem.price * (selectedItem.Qty + 1) } : selectedItem
        );
        setSelectedItems(updatedSelectedItems);
        setItems(updatedSelectedItemsForLog);

    };

    const decrementQty = (item: any) => {
        const updatedSelectedItems = selectedItems.map((selectedItem: any) =>
            selectedItem._id === item._id ? { ...selectedItem, Qty: Math.max(1, selectedItem.Qty - 1), total: selectedItem.price * (selectedItem.Qty > 1 ? selectedItem.Qty - 1 : 1) } : selectedItem
        );
        const updatedSelectedItemsForLog = items.map((selectedItem: any) =>
            selectedItem.name === item.name ? { ...selectedItem, Qty: Math.max(1, selectedItem.Qty - 1), total: selectedItem.price * (selectedItem.Qty > 1 ? selectedItem.Qty - 1 : 1) } : selectedItem
        );
        setSelectedItems(updatedSelectedItems);
        setItems(updatedSelectedItemsForLog);
    };

    React.useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (selectedItems.length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.onbeforeunload = handleBeforeUnload;

        return () => {
            window.onbeforeunload = null;
        };
    }, [selectedItems]);

    return (
        <>
            <Prompt
                when={selectedItems.length > 0}
                message="Are you sure you want to leave this page? Your changes may not be saved."
            />
            <div className="home-page-main-section">
                <Row gutter={16}>
                    <Col span={12} className="date-section-main">
                        <Title level={4} className="date-section">{moment().format('MMM DD YYYY')}</Title>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showModal} className="add-button">
                            Add
                        </Button>
                    </Col>
                </Row>
                {selectedItems.length > 0 ? (
                    <Divider className="product-divider" />
                ) : (
                    null
                )}

                {selectedItems.length > 0 ? (
                    <div className="items-whole-section">
                        <span className="heading-main">Items</span>
                    </div>
                ) : (
                    null
                )}

                {selectedItems.length > 0 ? (
                    selectedItems.map((item: any, index) => {
                        return (
                            <Card className="item-wrapper" key={index}>
                                <Row align="middle" gutter={16} className="product-content-wrapper" style={{ marginRight: "unset" }}>
                                    <div className="title-section">
                                        <Title level={5} className="name-wrapper">{item.productName}</Title>
                                        <Title level={5} className="price-section">₹{item.price}/Ea</Title>
                                    </div>
                                    <div className="quantity-main-section">
                                        <Col span={4} style={{ padding: "unset" }}>
                                            <Button className="minus-button" type="danger" icon={<MinusOutlined />} onClick={() => decrementQty(item)} disabled={item.Qty === 1} />
                                        </Col>
                                        <Col span={16} className="quantity-content">
                                            <Title level={5} className="heading">{item.Qty}</Title>
                                        </Col>
                                        <Col span={4} style={{ padding: "unset" }}>
                                            <Button className="plus-button" type="primary" icon={<PlusOutlined />} onClick={() => incrementQty(item)} />
                                        </Col>
                                    </div>
                                    <div>
                                        <Title level={5} style={{ margin: "unset" }} className="total-price-product">₹{item.total}</Title>
                                    </div>
                                </Row>
                            </Card>
                        )
                    })
                ) : (
                    <>
                        {/* <div>No Items Selected</div>
                    <Button type="primary" href="/log" style={{marginTop:20}}>View Logs</Button><br/>
                    <Button type="primary" href="add-product" style={{marginTop:20}}>Add New Products</Button><br/>
                    <Button type="danger" href="add-product" style={{marginTop:20}} onClick={logoutUser}>Logout</Button> */}
                    </>
                )}

                {selectedItems.length > 0 ? (
                    <Divider className="product-divider" />
                ) : (
                    null
                )}

                <Title level={4} style={{ textAlign: 'right', display: selectedItems.length > 0 ? undefined : "none" }} className="main-total-section">
                    <span style={{ color: "lightgray" }}>Total:</span>
                    <span style={{ fontSize: "30px" }}>₹{totalCost}</span>
                </Title>
                <div style={{ textAlign: "center", display: selectedItems.length > 0 ? undefined : "none" }}>
                    <Button type="primary" onClick={handleAddToLog} disabled={addToLog.isLoading} className="log-button">
                        {addToLog.isLoading ? (
                            "Adding..."
                        ) : (
                            "Add to Log"
                        )}
                    </Button></div>

                <Modal
                    title="Add Items"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    centered
                    className="add-items-modal"
                >
                    <Input
                        placeholder="Search items"
                        onChange={(e) => { setKeyword(e.target.value) }}
                    />
                    <List
                        dataSource={filteredProducts}
                        renderItem={(item: any) => (
                            <Card style={{ margin: '8px 0', border: selectedItems.some((i: any) => i._id === item._id) ? "1px solid red" : undefined }} onClick={() => toggleSelection(item)} >
                                <Row align="middle" gutter={16}>
                                    <Col span={16}>
                                        <Title level={5} style={{ textTransform: "capitalize" }}>{item.productName}</Title>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'right' }}>
                                        ₹{item.price}
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    />
                </Modal>
            </div>
        </>
    );
});
