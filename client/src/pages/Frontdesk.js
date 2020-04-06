import React, { Component } from "react";
import './frontdeskstyle.css';
import { Link } from "react-router-dom";
import API from "../utils/API";
import Small from "../components/TableExamples/Small";
import Medium from "../components/TableExamples/Medium";
import Large from "../components/TableExamples/Large";
import XL from "../components/TableExamples/XL";
import ViewMenuModal from "../components/ViewMenuModal/ViewMenuModal"
import Draggable, { DraggableCore } from 'react-draggable';
import OrderingSysModal from "../components/OrderingSysModal/OrderingSysModal"

import { List, ListItem } from "../components/List";
import OrderListModal from "../components/OrderListModal/OrderListModal";


class Frontdesk extends Component {
    state = {
        tables: [],
        menu: [],
        tableHistory: []
    }
    // functions for diningroom collection testing!!


    getSavedTable = () => {
        API.getTables().then(res => {
            this.setState({ tables: res.data })
        })
    };

    buildTable = type => {
        console.log("come into buildTable function")
        let tableData = {};
        if (type === 2) {
            tableData = {
                seats: 2
            }
        } else if (type === 4) {
            tableData = {
                seats: 4
            }
        } else if (type === 6) {
            tableData = {
                seats: 6
            }
        } else if (type === 8) {
            tableData = {
                seats: 8
            }
        }

        API.createNewTable(tableData)
            .then(res => {
                console.log("res.data: ", res.data);
                this.getSavedTable()
            })
            .catch(err => console.log(err));
    }

    changeTableAvalibility = (tableId, availability) => {
        if (availability === true) {
            availability = false
            this.state.tables.map(table => {
                if (table._id === tableId) {
                    let newTable = {
                        seats: parseInt(table.seats),
                        order: "",
                        order_quantity: "",
                        color: "primary",
                        status: "Unoccupied",
                        availability: availability
                    }
                    this.updateTableAvalibility(tableId,newTable)
                    this.getSavedTable()
                }
            })
        } else {
            availability = true
            this.state.tables.map(table => {
                if (table._id === tableId) {
                    let newTable = {
                        seats: parseInt(table.seats),
                        order: "",
                        order_quantity: "",
                        color: "Success",
                        status: "Occupied",
                        availability: availability
                    }
                    this.updateTableAvalibility(tableId,newTable)
                    this.getSavedTable()
                }
            })
        }

    }

    updateTableAvalibility = (tableId, newTablestatus) => {
        API.changeTableAvalibility(tableId, newTablestatus)
            .then(result => {
                console.log(result)
            })
    }
    // functions for menu collection testing!!

    getMenu = () => {
        API.getMenu().then(res => {
            console.log(res.data)
            const savedMenu = res.data;
            this.setState({ menu: savedMenu });
        })
            .catch(err => console.log(err));
    }

    //  functions for table this.state.specificTableHistory testing
    getTableHistoryById = TableId => {
        console.log("Table Id: ", TableId)
        API.findTableHistoryById(TableId).then(res => {
            console.log(res.data)
            const specificTableHistory = res.data;
            this.setState({ tableHistory: specificTableHistory });
        })
            .catch(err => console.log(err));
    }
    AddTableHistory = () => {
        console.log("go into add Table History function")
        const testOrder =
        {
            // start_at: Date(),
            order: "test dish 2, test dish 3",
            order_quantity: "1, 2",
        }



        API.createTableHistory(testOrder)
            .then(res => {
                console.log("res.data: ", res.data);
                this.retriveSavedTableHistoryById(res.data._id)
            })
            .catch(err => console.log(err));
    }


    componentDidMount = () => {
        this.getSavedTable()
        this.getMenu()
    }


    render() {
        console.log("state: ", this.state)
        return (
            <>
                <div className="sidenav">
                    <div className="logo-box">
                        <h1 style={{ fontSize: "80px", textAlign: "center" }}>T</h1>
                    </div>
                    <button onClick={() => this.buildTable(2)}>
                        Build Small
                    </button>
                    <button onClick={() => this.buildTable(4)}>
                        Build Medium
                    </button>
                    <button onClick={() => this.buildTable(6)}>
                        Build Large
                    </button>
                    <button onClick={() => this.buildTable(8)}>
                        Build XL
                    </button>

                    <ViewMenuModal
                        menu={this.state.menu}
                        getMenu={this.getMenu}
                    />

                    <button onClick={() => this.AddTableHistory()}>
                        Add Table this.state.specificTableHistory
                    </button>
                    <Link to="/">
                        <button>Home</button>
                    </Link>
                </div>

                <div id="main">
                    {/* create tables */}
                    {!this.state.tables ? (
                        <h2 style={{ color: "white" }}>No Tables Generated Yet</h2>
                    ) : (this.state.tables.map(table => {
                        if (table.seats === 2) {
                            if (table.availability === true){
                                return(
                                    <OrderingSysModal
                                    availability={table.availability}
                                    key={table._id}
                                    tableId={table._id}
                                    menu={this.state.menu}
                                    changeTableAvalibility={this.changeTableAvalibility}
                                />
                                )
                            }else{
                                return(
                                    <OrderListModal 
                                    availability={table.availability}
                                    tableHistoyr={table}
                                    changeTableAvalibility={this.changeTableAvalibility}
                                    />
                                )
                            }
                                
                            
                            // return (
                                
                            //     <OrderingSysModal
                            //         key={table._id}
                            //         tableId={table._id}
                            //         menu={this.state.menu}
                            //         getMenu={this.getMenu}
                            //     />
                            // )
                        } else if (table.seats === 4) {
                            return (
                                <Medium />
                            )
                        } else if (table.seats === 6) {
                            return (
                                <Large />
                            )
                        } else {
                            return (
                                <XL />
                            )
                        }

                    }))}


                </div>

            </>
        );
    }
}

export default Frontdesk;