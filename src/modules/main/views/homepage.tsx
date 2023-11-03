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

const { Title } = Typography;
const { Search } = Input;

export default createComponent((props) => {
    const formRef = React.useRef();
    const history = useHistory();
    const { useService,useContext } = props.use(Frontend);

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
            products : items,
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
    }, [totalCost,items])


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
            setItems([...items, {  Qty: 1, total: item.price, productName:item.productName,price:item.price }]);

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

    // const decrementQty = (item) => {
    //     const updatedSelectedItems = selectedItems.map((selectedItem) => {
    //       if (selectedItem._id === item._id) {
    //         const updatedQty = Math.max(1, selectedItem.Qty - 1);
    //         return { ...selectedItem, Qty: updatedQty, total: selectedItem.price * (selectedItem.Qty > 1 ? selectedItem.Qty - 1 : 1) };
    //       }
    //       return selectedItem;
    //     });

    //     // const updatedSelectedItemsForLog = items.map((selectedItem) => {
    //     //     if (selectedItem.name === item.name) {
    //     //       const updatedQty = Math.max(1, selectedItem.Qty - 1);
    //     //       return { ...selectedItem, Qty: updatedQty, total: selectedItem.price * (selectedItem.Qty > 1 ? selectedItem.Qty - 1 : 1) };
    //     //     }
    //     //     return selectedItem;
    //     //   });
    //     setSelectedItems(updatedSelectedItems);
    //     // setSelectedItems(updatedSelectedItemsForLog);

    //   };
      

    return (
        <>
            <div style={{ padding: 16 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={4}>{moment().format('MMM DD')}</Title>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showModal}>
                            Add
                        </Button>
                    </Col>
                </Row>

                <Divider />
                {selectedItems.length > 0 ? (
                    selectedItems.map((item: any, index) => {
                        return (
                            <Card style={{ width: '100%' }} key={index}>
                                <Row align="middle" gutter={16}>
                                    <Col span={4}>
                                        <Button type="danger" icon={<MinusOutlined />} onClick={() => decrementQty(item)} disabled={item.Qty === 1} />
                                    </Col>
                                    <Col span={16}>
                                        <Title level={5} style={{ margin: "unset",textTransform:"capitalize" }}>{item.productName}</Title>
                                        <Title level={5} style={{ margin: "unset" }}>₹{item.price}</Title>
                                        <Title level={5} style={{ margin: "unset" }}>Qty:{item.Qty}</Title>
                                        <Title level={5} style={{ margin: "unset" }}>Total:{item.total}</Title>

                                    </Col>
                                    <Col span={4} style={{ textAlign: 'right' }}>
                                        <Button type="primary" icon={<PlusOutlined />} onClick={() => incrementQty(item)}  />
                                    </Col>
                                </Row>
                            </Card>
                        )
                    })
                ) : (
                    <>
                    <div>No Items Selected</div>
                    <Button type="primary" href="/log" style={{marginTop:20}}>View Logs</Button><br/>
                    <Button type="primary" href="add-product" style={{marginTop:20}}>Add New Products</Button><br/>
                    <Button type="danger" href="add-product" style={{marginTop:20}} onClick={logoutUser}>Logout</Button>
                    </>
                )}


                <Divider />

                <Title level={4} style={{ textAlign: 'right',display:selectedItems.length > 0 ? undefined : "none" }}>
                    Total: ₹{totalCost}
                </Title>
                <div style={{ textAlign: "center",display:selectedItems.length > 0 ? undefined : "none"}}><Button type="primary" onClick={handleAddToLog} disabled={addToLog.isLoading}>
                    {addToLog.isLoading ? (
                        "Adding..."
                    ):(
                        "Add to Log"
                    )}
                    </Button></div>

                <Modal
                    title="Add Items"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    centered
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
                                        <Title level={5} style={{textTransform:"capitalize"}}>{item.productName}</Title>
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
