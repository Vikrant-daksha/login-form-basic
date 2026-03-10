import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../api/axiosinstance";
import SortableUploader from "../components/SortableUploader.jsx";
import logo from "../assets/logo.png";
import { LuPlus } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";

export function Product() {
  const [product, setProduct] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [sale, setSale] = useState(false);
  const [productList, setProductList] = useState([]);
  const [files, setFiles] = useState([]);

  const [color, setColor] = useState(0);
  const [shape, setShape] = useState(0);
  const [size, setSize] = useState(0);
  const [stock, setStock] = useState(0);

  const [productId, setProductId] = useState(null);

  const [trackInventoryToggle, setTrackInventoryToggle] = useState(false);
  const [addPopUp, setAddPopUp] = useState(false);
  const [editPopUp, setEditPopUp] = useState(false);
  const [addVariantPopUp, setAddVariantPopUp] = useState(false);
  const [deletePopUp, setDeletePopUP] = useState(false);
  const [trackInventory, setTrackInventory] = useState(false);
  const [addColorPopup, setAddColorPopup] = useState(false);
  const [addShapePopup, setAddShapePopup] = useState(false);
  const [addSizePopup, setAddSizePopup] = useState(false);

  const [colorVariants, setColorVariants] = useState(null);
  const [sizeVariants, setSizeVariants] = useState(null);
  const [shapeVariants, setShapesVariants] = useState(null);

  const [addColorToDB, setAddColorToDB] = useState(null);
  const [addSizeToDB, setAddSizeToDB] = useState(null);
  const [addShapeToDB, setAddShapeToDB] = useState(null);

  const fetchingVariants = async () => {
    const res = await api.get("/api/auth/product/variants");

    if (!res) {
      console.log("No Variants", res.data);
    } else {
      setColorVariants(res.data.colors);
      setShapesVariants(res.data.shapes);
      setSizeVariants(res.data.sizes);
    }
  };

  useEffect(() => {
    fetchingVariants();
  }, [addColorPopup, addShapePopup, addSizePopup]);

  const clearFormData = () => {
    setProduct("");
    setDesc("");
    setAmount("");
    setSale(false);
    setFiles([]);
    setProductId(null);
  };

  const createFormData = () => {
    const slug = product
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const formData = new FormData();
    formData.append("name", product);
    formData.append("description", desc);
    formData.append("price", amount);
    formData.append("sale", sale);
    files.forEach((file) => {
      formData.append("image", file.file);
    });
    formData.append("slug", slug);

    return formData;
  };

  const deleteProduct = async (product_id) => {
    const res = await api.delete(`/api/auth/product/delete/${product_id}`);

    setProductList((product) =>
      product.filter((p) => p.product_id !== product_id)
    );
    console.log(res.data);
  };

  const editProduct = async (product_id) => {
    const formData = new FormData();
    formData.append("name", product);
    formData.append("description", desc);
    formData.append("price", amount);
    formData.append("sale", sale);
    const slug = product
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    formData.append("slug", slug);

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("image", file.file);
      });
    }

    const res = await api.post(
      `/api/auth/edit-product/${product_id}`,
      formData
    );

    if (!res) {
      console.log("Error Updating Product");
    } else {
      setEditPopUp(false);
      setProductList((product) =>
        product?.map((p) => (p?.product_id === productId ? res.data : p))
      );
      console.log(res.data);
    }
  };

  const addVariant = async (product_id) => {
    const variantData = { color, shape, size, stock, trackInventory };

    const res = await api.post(
      `/api/auth/product/add-variant/${product_id}`,
      variantData
    );

    console.log(res.data);
  };

  const addColor = async () => {
    if (!addColorToDB) {
      return;
    }
    const res = await api.post("/api/auth/add-color", { color: addColorToDB });
    console.log(res);
  };

  const addShape = async () => {
    if (!addShapeToDB) {
      return;
    }
    const res = await api.post("/api/auth/add-shape", { shape: addShapeToDB });
    console.log(res);
  };

  const addSize = async () => {
    if (!addSizeToDB) {
      return;
    }
    const res = await api.post("/api/auth/add-size", { size: addSizeToDB });
    console.log(res);
  };

  const submit = async () => {
    try {
      if (!product || !desc || !amount) {
        alert("All Field must be Filled");
        return;
      }

      const formData = createFormData();

      console.log(formData);

      const res = await api.post("/api/auth/create-product", formData);
      console.log(res.data);
      if (!res) {
        alert("Error Adding Product");
      } else {
        alert(`Product "${product}" Added Sucessfully!`);
        setProductList((list) => [...list, res.data]);
        clearFormData();
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
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

  return (
    <>
      {addPopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Add Product</div>
                <div>
                  <button
                    onClick={() => {
                      setAddPopUp(false);
                      clearFormData();
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col">
                <label className=" mb-1">Product Name</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  placeholder="product name"
                  onChange={(e) => {
                    setProduct(e.target.value);
                  }}
                ></input>
                <label className=" mb-1 mt-3">Product Descrition</label>
                <textarea
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg max-h-52"
                  placeholder="description"
                  rows={4}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                ></textarea>
                <label className=" mb-1 mt-3">Price</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  placeholder="price"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                ></input>
                <div className="flex items-center mx-1">
                  <input
                    type="checkbox"
                    className="border border-gray-300 p-2 pl-3 mr-2 rounded-lg"
                    checked={sale}
                    onChange={(e) => {
                      setSale(e.target.checked);
                    }}
                  ></input>
                  <label className=" mb-1 mt-3">Is On Sale</label>
                </div>
                <div className="mt-2 mb-6">
                  <SortableUploader files={files} setFiles={setFiles} />
                </div>
                {/* <label className=" mb-1 mt-3">
                    Product Name
                    </label>
                    <input
                    type="text"
                    className="border border-gray-300 p-2 pl-3 rounded-lg"
                    placeholder="Enter Product Name"
                    ></input> */}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setAddPopUp(false);
                    clearFormData();
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    submit();
                    setAddPopUp(false);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editPopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Edit Product</div>
                <div>
                  <button
                    onClick={() => {
                      setEditPopUp(false);
                      clearFormData();
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col">
                <label className=" mb-1">Edit Product Name</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  defaultValue={product}
                  placeholder="new product name"
                  onChange={(e) => {
                    setProduct(e.target.value);
                  }}
                ></input>
                <label className=" mb-1 mt-3">Edit Product Descrition</label>
                <textarea
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg max-h-52"
                  defaultValue={desc}
                  placeholder="edit description"
                  rows={4}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                ></textarea>
                <label className=" mb-1 mt-3">Edit Price</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  defaultValue={amount}
                  placeholder="edit price"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                ></input>
                <div className="flex items-center mx-1">
                  <input
                    type="checkbox"
                    className="border border-gray-300 p-2 pl-3 mr-2 rounded-lg"
                    checked={sale}
                    onChange={(e) => {
                      setSale(e.target.checked);
                    }}
                  ></input>
                  <label className=" mb-1 mt-3">Edit Is On Sale</label>
                </div>
                <div className="mt-2 mb-6">
                  <SortableUploader files={files} setFiles={setFiles} />
                </div>
                {/* <label className=" mb-1 mt-3">
                    Product Name
                    </label>
                    <input
                    type="text"
                    className="border border-gray-300 p-2 pl-3 rounded-lg"
                    placeholder="Enter Product Name"
                    ></input> */}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditPopUp(false);
                    clearFormData();
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    editProduct(productId);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {addVariantPopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Add Product Variants</div>
                <div>
                  <button
                    onClick={() => {
                      setAddVariantPopUp(false);
                      clearFormData();
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-2">
                <div className="flex justify-between items-center my-2">
                  <label className="">Add New Product Color</label>
                  <button
                    onClick={() => {
                      setAddColorPopup(true);
                      setAddVariantPopUp(false);
                    }}
                    className="w-1/6 flex justify-center items-center border border-black px-2 py-0.5 rounded-sm"
                  >
                    <LuPlus className="mr-2" />
                    Color
                  </button>
                </div>
                <select
                  className="border border-gray-700 active:border-gray-800 py-2 px-2 rounded-lg invalid:text-gray-500"
                  required
                  onChange={(e) => setColor(Number(e.target.value))}
                >
                  <option value={""} disabled selected hidden>
                    --select-color--
                  </option>
                  {colorVariants?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.color}
                    </option>
                  ))}
                </select>
                <div className="flex justify-between items-center my-2">
                  <label className="">Add New Product Shape</label>
                  <button
                    onClick={() => {
                      setAddShapePopup(true);
                      setAddVariantPopUp(false);
                    }}
                    className="w-1/6 flex justify-center items-center border border-black px-2 py-0.5 rounded-sm"
                  >
                    <LuPlus className="mr-3" />
                    Shape
                  </button>
                </div>
                <select
                  className="border border-gray-700 active:border-gray-800 py-2 px-2 rounded-lg invalid:text-gray-500"
                  required
                  onChange={(e) => setShape(Number(e.target.value))}
                >
                  <option value={""} disabled selected hidden>
                    --select-shape--
                  </option>
                  {shapeVariants?.map((sh) => (
                    <option key={sh.id} value={sh.id}>
                      {sh.shape}
                    </option>
                  ))}
                </select>
                <div className="flex justify-between items-center my-2">
                  <label className="">Add New Product Size</label>
                  <button
                    onClick={() => {
                      setAddSizePopup(true);
                      setAddVariantPopUp(false);
                    }}
                    className="w-1/6 flex justify-center items-center border border-black px-2 py-0.5 rounded-sm"
                  >
                    <LuPlus className="mr-3" />
                    Size
                  </button>
                </div>
                <select
                  className="border border-gray-700 active:border-gray-800 py-2 px-2 rounded-lg invalid:text-gray-500"
                  required
                  onChange={(e) => setSize(Number(e.target.value))}
                >
                  <option value={""} disabled selected hidden>
                    --select-size--
                  </option>
                  {sizeVariants?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.size}
                    </option>
                  ))}
                </select>
                <div className="my-3">
                  <input
                    type="checkbox"
                    value={trackInventoryToggle}
                    onChange={(e) => {
                      setTrackInventoryToggle(e.target.checked);
                      setTrackInventory(e.target.checked);
                    }}
                    className="mr-3"
                  ></input>
                  <label>Track Inventory</label>
                  {trackInventoryToggle && (
                    <div className="flex flex-col">
                      <label className=" mb-1">Stock</label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        defaultValue={""}
                        placeholder="stock"
                        onChange={(e) => {
                          setStock(e.target.value);
                        }}
                      ></input>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setAddVariantPopUp(false);
                    clearFormData();
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addVariant(productId);
                    setAddVariantPopUp(false);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Add Variant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deletePopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg text-red-600">
                  Do you want to Delete this Product?
                </div>
                <div>
                  <button
                    onClick={() => {
                      setDeletePopUP(false);
                      clearFormData();
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mx-5">
                <div className="">
                  <p className="text-lg text-left font-medium">
                    Do you really want to delete this Product?
                  </p>
                  <p className="text-lg text-left font-light">
                    This action will delete the product from everywhere such as
                    customers cart and products page.
                  </p>
                </div>
                <div className="text-sm font-semibold text-red-500 my-3">
                  *This Action is Irreversible!
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setDeletePopUP(false);
                    clearFormData();
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProduct(productId);
                    setDeletePopUP(false);
                    clearFormData();
                  }}
                  className="w-full border border-red-600 bg-red-600 text-white py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {addColorPopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-1/4 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Add Color</div>
                <div>
                  <button
                    onClick={() => {
                      setAddColorPopup(false);
                      setAddVariantPopUp(true);
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-2">
                <label className=" mb-1">Add New Color</label>
                <input
                  type="text"
                  className="border border-gray-700 py-2 px-2 rounded-lg"
                  placeholder="add color to db"
                  onChange={(e) => setAddColorToDB(e.target.value)}
                ></input>
              </div>
              <div className="grid grid-cols-1">
                <button
                  onClick={() => {
                    addColor();
                    setAddColorPopup(false);
                    setAddVariantPopUp(true);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {addShapePopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-1/4 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Add Color</div>
                <div>
                  <button
                    onClick={() => {
                      setAddShapePopup(false);
                      setAddVariantPopUp(true);
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-2">
                <label className=" mb-1">Add New Shape</label>
                <input
                  type="text"
                  className="border border-gray-700 py-2 px-2 rounded-lg"
                  placeholder="add shape to db"
                  onChange={(e) => setAddShapeToDB(e.target.value)}
                ></input>
              </div>
              <div className="grid grid-cols-1">
                <button
                  onClick={() => {
                    addShape();
                    setAddShapePopup(false);
                    setAddVariantPopUp(true);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {addSizePopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-1/4 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Add Color</div>
                <div>
                  <button
                    onClick={() => {
                      setAddSizePopup(false);
                      setAddVariantPopUp(true);
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-2">
                <label className=" mb-1">Add New Size</label>
                <input
                  type="text"
                  className="border border-gray-700 py-2 px-2 rounded-lg"
                  placeholder="add shape to db"
                  onChange={(e) => setAddSizeToDB(e.target.value)}
                ></input>
              </div>
              <div className="grid grid-cols-1">
                <button
                  onClick={() => {
                    addSize();
                    setAddSizePopup(false);
                    setAddVariantPopUp(true);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-3 mt-5">
        <div className="flex items-center justify-between mx-5 mb-2">
          <div className="text-lg">All Products</div>
          <div>
            <button
              onClick={() => {
                setProductId(product?.product_id);
                setAddPopUp(true);
              }}
              className=" flex items-center border border-black px-3 py-1.5 rounded-lg"
            >
              <LuPlus className="mr-2" /> Add Product
            </button>
          </div>
        </div>
        {productList.map((product) => (
          <div key={product?.product_id} className="mx-2">
            <div className="grid grid-cols-4 items-center px-1 py-1 w-full border border-solid rounded-xl">
              <div className="grid grid-cols-2 items-center overflow-hidden">
                <Link to={`/products/${product?.slug}`}>
                  <div className="overflow-hidden rounded-xl p-0.5 border mr-1 sm:mr-3 w-fit">
                    <div className="relative">
                      {product?.sale && (
                        <div className="absolute top-0 left-0 bg-black overflow-hidden rounded-br-md">
                          <div className="overflow-clip text-white text-center text-[10px] sm:text-xs px-0.5 py-0.5 sm:px-1 sm:py-0.5 ">
                            S
                          </div>
                        </div>
                      )}
                    </div>
                    <img
                      src={
                        product?.images?.[0]?.replace(
                          "/upload",
                          "/upload/w_80,h_80,c_fill/"
                        ) || logo
                      }
                      width={80}
                      height={80}
                      className="rounded-lg min-h-fit"
                    ></img>
                  </div>
                </Link>
                <div className="truncate">{product?.product}</div>
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={() => {
                    // setProductId(product?.product_id);
                    // setEditPopUp(true);
                    const p = productList.find(
                      (p) => p.product_id === product.product_id
                    );
                    setProductId(product.product_id);
                    setProduct(p.product);
                    setDesc(p.description);
                    setAmount(p.price);
                    setSale(p.sale);
                    setEditPopUp(true);
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="m-auto">
                <button
                  onClick={() => {
                    setProductId(product?.product_id);
                    setAddVariantPopUp(true);
                  }}
                >
                  Add Variant
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    setProductId(product?.product_id);
                    setDeletePopUP(true);
                  }}
                  className="text-red-600"
                >
                  <TbTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
