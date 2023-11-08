import React from "react";
import { createComponent, Frontend } from "@skyslit/ark-frontend";
import { Col, Row, Typography, Layout, Button, Input, message, Divider, Card, List, Modal, InputNumber,Skeleton, Space  } from "antd";
// import '../styles/admin-page.scss';
import Lottie from "react-lottie";
import AbstractBlue from "../assets/lottie-files/abstract-blue-and-yellow.json";
import { useHistory } from "react-router-dom";
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet-async";
import Fade from "react-reveal/Fade";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './add-products-page.scss';

const { Title } = Typography;
const { Search } = Input;
const { Header, Content } = Layout; 


export default createComponent((props) => {
    const { useService } = props.use(Frontend);

    const addOrUpdateProduct = useService({ serviceId: "add-or-update-product" });
    const listAllProduct = useService({ serviceId: "list-all-products" });

    const [showEditModal, setShowEditModal] = React.useState(false);

    const [productName, setProductName] = React.useState("")
    const [price, setPrice] = React.useState(0)
    const [mode, setMode] = React.useState("")
    const [allProducts, setAllProducts] = React.useState([])
    const [productId, setProductId] = React.useState("")
    const [keyword, setKeyword] = React.useState("")


    const addNewProduct = React.useCallback(() => {
        addOrUpdateProduct.invoke({
            productName:productName.toLowerCase(),
            price,
            mode
        }, { force: true })
            .then((res) => {
                handleListAllProduct()
                setShowEditModal(false)
                setProductName("")
                setPrice(0)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [productName, price, mode])

    const editProduct = React.useCallback(() => {
        addOrUpdateProduct.invoke({
            productName: productName.toLowerCase(),
            price,
            productId,
            mode
        }, { force: true })
            .then((res) => {
                handleListAllProduct()
                setShowEditModal(false)
                setProductName("")
                setPrice(0)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [productName, price, mode, productId])

    const filteredProducts = React.useMemo(()=>{
        const regex = new RegExp(keyword, 'i');
        if(keyword){
            return allProducts.filter(product => regex.test(product.productName));
        } else{
            return allProducts
        }
    },[keyword,allProducts])

    const handleListAllProduct = React.useCallback(() => {
        listAllProduct.invoke({}, { force: true })
            .then((res) => {
                setAllProducts(res.data)
            })
            .catch((e) => {
                message.error(e.message)
            })
    }, [productName, price, mode])

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleModalCancel = () => {
        setShowEditModal(false);
        setMode("")
        setPrice(0)
        setProductName("")
    };

    React.useEffect(() => {
        handleListAllProduct()
    }, [])

    if (listAllProduct.isLoading) {
        return (
            <>
                <div style={{padding: "70px 25px 0px 25px"}}>
                    <Skeleton />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around",padding: "25px"}}>
                    <Skeleton.Button active={true} shape='square' className="skeleton-button"/>
                </div>
            </>
        );
    }
    
    return (
        <Layout>
            <Header>
                <Input placeholder="Search" onChange={(e)=>{setKeyword(e.target.value)}}/>
            </Header>
            <Content className="add-products-whole-content-wrapper">
                <div className="add-items-section">
                    <span className="item-top-heading">Items</span>
                    <Button type="text" onClick={() => { handleEditClick(), setMode("new") }} className="add-button">
                        <PlusOutlined/>
                    </Button>
                </div>

                    {filteredProducts.map((product: any, index) => (
                        <div key={index} className="all-item-wrapper" onClick={() => {
                            handleEditClick(),
                                setMode("edit"),
                                setPrice(product.price),
                                setProductName(product.productName),
                                setProductId(product._id)
                        }}>
                            {/* <div>
                                <Button onClick={() => {
                                    handleEditClick(),
                                        setMode("edit"),
                                        setPrice(product.price),
                                        setProductName(product.productName),
                                        setProductId(product._id)
                                }}>Edit</Button>
                            </div> */}
                            <div className="product-details">
                                <span className="product-name">{product.productName}</span>
                                <p className="product-price">{product.price}₹/Ea</p>
                            </div>
                            <div className="icon-main-section">
                                <CloseOutlined className="icon"/>
                            </div>
                        </div>
                    ))}
                
            </Content>
            <Modal
                title={addOrUpdateProduct.isLoading ? "Please Wait" : mode === "edit" ? "Edit Item" : "Add Item"} 
                visible={showEditModal}
                onOk={mode === "new" ? addNewProduct : editProduct}
                onCancel={handleModalCancel}
                okButtonProps={{ disabled: addOrUpdateProduct.isLoading || !price || !productName }}
                okText={addOrUpdateProduct.isLoading ? <LoadingOutlined/> : mode === "edit" ? "Edit" : "Add"}
                className="add-item-modal"
            >
                <Input
                    placeholder="Product Name" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="name-wrapper"
                />
                <InputNumber
                    style={{ marginTop: 20 }}
                    placeholder="Product Price"
                    value={price}
                    onChange={(value:any) => setPrice(value)}
                    className="price-wrapper"
                />

            </Modal>
        </Layout>
    );
});
