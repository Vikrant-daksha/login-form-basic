import React from "react";
import { useState, useEffect, useMemo } from "react";
import api from "../api/axiosinstance";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { href, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export function ProductList({ amt, layout, page = "" }) {
  const [productList, setProductList] = useState([]);
  const [cart, setCart] = useState([]);
  const [pageName, setPageName] = useState("");
  const [sortBy, setSortBy] = useState("");

  const addToCart = async (productId) => {
    try {
      const productItem = {
        product_id: productId,
      };
      const res = await api.post("/api/add-to-cart/", productItem);
      setCart((prev) => ({
        ...prev,
        [productItem.product_id]: parseInt(res.data.quantity),
      }));
      console.log(res.data);
    } catch (err) {
      console.error("error", err);
    }
  };
  // async function addToCart(productId) {
  //   try {
  //     const productItem = { product_id: productId, quantity: 1 };
  //     const res = await api.post("/api/add-to-cart/", productItem);
  //   } catch (err) {
  //     console.error("error", err);
  //   }
  // }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/auth/cart");
        if (!res.data) {
          return;
        } else {
          const Lookup = res.data.reduce((product, item) => {
            product[item.product_id] = parseInt(item.quantity);
            return product;
          }, {});

          setCart(Lookup);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    // const getProductList = async () => {
    //     try {
    //         const res = await api.get("/product");

    //         const response = res.data.response;

    //         setProductList(response);
    //         localStorage.setItem("products", JSON.stringify(response));
    //     } catch (err) {
    //         console.error("API error:", api, err);
    //     }
    // };

    // getProductList();

    const getProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProductList(res.data);
      } catch (err) {
        console.error("Error Fecthing Products");
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (page) {
      setPageName(page);
    }
  }, [page]);

  const sortedProducts = useMemo(() => {
    return [...productList].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.product.localeCompare(b.product);
      return 0;
    });
  }, [productList, sortBy]);

  const itemsToRender = sortedProducts.slice(amt);

  // useEffect(() => {
  //     console.log(productList)
  // }, [productList])

  return (
    <>
      {layout === "flex" ? (
        <div id="Product-List" className="flex flex-row">
          {itemsToRender.map((product) => (
            <div
              key={product?.product_id}
              className="min-w-[20%] md:min-w-[25%] lg:min-w-[20%] w-full border mr-2.5 "
            >
              <Link to={`/products/${product?.slug}`}>
                <div className="relative">
                  <img
                    src={
                      product?.images?.[0]?.replace(
                        "/upload/",
                        "/upload/w_400,h_400,c_fill/"
                      ) || logo
                    }
                    width={400}
                    height={400}
                  ></img>
                  {product.sale && (
                    <span className="absolute top-0 right-0 bg-black py-1 px-2 text-sm text-white">
                      Sale
                    </span>
                  )}
                </div>
                <div className="text-wrap text-center my-3">
                  <p className="mb-1">{product.product}</p>
                  <p className="">{product.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-2 py-5">
            <div className="font-semibold text-lg">
              <p>{pageName}</p>
            </div>
            <div id="Sort">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border px-4 py-1 rounded-sm appearance-none focus:outline-none focus:ring-0 focus-within:border"
              >
                <option value="" disabled>
                  Sort By
                </option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
              </select>
            </div>
          </div>

          <div
            id="Product-List"
            className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
          >
            {itemsToRender.map((product) => {
              const qty = cart[product?.product_id] || 0;
              return (
                <div
                  key={product?.product_id}
                  className="max-w-64 w-full h-fit mx-auto bg-pink-50 rounded-xl"
                >
                  <Link to={`/products/${product?.slug}`}>
                    <div className="relative rounded-xl overflow-clip">
                      <img
                        src={
                          product?.images?.[0]?.replace(
                            "/upload/",
                            "/upload/w_300,h_300,c_fill/"
                          ) || logo
                        }
                        width={300}
                        height={300}
                      ></img>
                      <span className="absolute top-2 left-2 bg-white rounded-full px-1 py-1 text-sm">
                        <FaHeart />
                      </span>
                      {product.sale && (
                        <span className="absolute uppercase top-0 right-0 bg-black py-1 px-2 text-[10px] tracking-widest text-white rounded-bl-lg">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-wrap my-3">
                      <p className="text-xl uppercase tracking-widest mb-1">
                        {product.product}
                      </p>
                      <p className="text-[16px]">
                        <span id="currency-symbol" className="pr-1">
                          ₹
                        </span>
                        {product.price}
                      </p>
                    </div>
                  </Link>
                  <div className="">
                    <button
                      onClick={() => {
                        addToCart(product?.product_id);
                      }}
                      className="w-full flex justify-center items-center rounded-lg py-1.5 text-[12px] uppercase tracking-wide bg-pink-100"
                    >
                      <FaCartShopping className="mr-3" />
                      {qty === 0 ? (
                        <div>ADD to Cart</div>
                      ) : (
                        <div>{cart[product?.product_id]}</div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
