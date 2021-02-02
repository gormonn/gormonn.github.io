import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Table } from "./table";
import { PRODUCTS_FETCH_REQUESTED } from "../reducers/products/const";
import { Name, Count, Price } from "./blocks";

const columns = [
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    sortDirections: ["default", "asc", "desc"],
    size: 30,
    onFilter: (value, item) => item.name.indexOf(value) === 0,
    render: (item) => (
      <>
        <Name>{item.name}</Name>
        <Count>{item.count}</Count>
      </>
    )
  },
  {
    key: "price",
    title: "Price",
    dataIndex: "price",
    sortDirections: ["default", "asc", "desc"],
    size: 20,
    render: (item) => <Price price={item.price} />
  },
  {
    key: "actions",
    title: "Actions",
    size: 20,
    render: (item, action = { edit: () => {}, delete: () => {} }) => (
      <>
        <button onClick={action.edit(item)}>Edit</button>
        <button onClick={action.delete(item)}>Delete</button>
      </>
    )
  }
];

function ProductsPage({ products, dispatch }) {
  const { data, loading, error } = products;
  useEffect(() => {
    dispatch({ type: PRODUCTS_FETCH_REQUESTED, payload: { count: 100 } });
  }, [dispatch]);
  return (
    <div className="products">
      <Table {...{ data, loading, error, columns }} />
    </div>
  );
}

export default connect((state) => ({
  products: state.products
}))(ProductsPage);
