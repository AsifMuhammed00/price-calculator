import React from "react";
import { createComponent, Frontend } from "@skyslit/ark-frontend";
import { Col, Row, Typography, Form, Button, Input, message, Divider, Card, List, Modal, Calendar, theme, Table } from "antd";
import './sign-out-page.scss';

export default createComponent((props) => {
    const { useService,useContext } = props.use(Frontend);
    const context = useContext()
    const logoutService = useService({ serviceId: "user-logout" });
    const user = context.response.meta.currentUser.emailAddress;

    const logoutUser = () => {
        logoutService
            .invoke()
            .then((res) => { })
            .catch((e) => {
                message.error("Try again!");
            })
            .finally(() => context.invoke(null, { force: true }));
    };
    return (
        <>
            <div className="sign-out-mainsection">
                <span className="user-details">Hi {user} ,</span>
                <span className="sign-out-content">Please click the below button to logout.</span>
                <Button type="danger" onClick={logoutUser} className="log-out-button">
                    Logout
                </Button>
            </div>
        </>
    );
});
