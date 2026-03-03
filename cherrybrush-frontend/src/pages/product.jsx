import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../api/axiosinstance";
import { DragDropProvider } from "@dnd-kit/react";
import { Draggable } from "../components/Draggable.jsx";
import Droppable from "../components/Droppable.jsx";
import SortableUploader from "../components/SortableUploader.jsx";

export function Product() {
  const [product, setProduct] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [sale, setSale] = useState(false);
  const [productList, setProductList] = useState([]);
  const [files, setFiles] = useState([]);

  async function submit(e) {
    e.preventDefault();

    try {
      if (!product || !desc || !amount) {
        alert("All Field must be Filled");
        return;
      }

      const slug = product
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      //const productData = {name: product, description: desc, price: amount, sale:sale, slug:slug};
      const formData = new FormData();

      formData.append("name", product);
      formData.append("description", desc);
      formData.append("price", amount);
      formData.append("sale", sale);
      files.forEach((file) => {
        formData.append("image", file.file);
      });
      formData.append("slug", slug);

      const res = await api.post("/api/auth/create-product", formData);
      //const imgUpload = await api.post("/api/auth/check", formData);
      console.log(res.data);
      if (!res) {
        alert("Error Adding Product");
      } else {
        alert(`Product "${product}" Added Sucessfully!`);
      }

      // if (!product || !price){
      //     alert("Cannot be Empty")
      // } else {

      // const res = await api.post("/product",{
      //     product,
      //     price: priceNum
      // }).then(async res => {
      //     if(res){
      //         const { message } = res.data
      //         alert(message)
      //         console.log(productList)
      //     } else {
      //         alert('E')
      //     }
      // }).catch(e => {
      //     console.log(e)
      // })
      // }
    } catch (e) {
      alert(e);
    }
  }

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

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <>
      <div className="no-select-global">
        <form>
          <div>Add Product</div>
          <div className="flex justify-between">
            <div className="flex">
              <label className="font-semibold mb-1">Product Name</label>
              <input
                type="text"
                className="border border-gray-300 p-2 pl-3 rounded-lg"
                onChange={(e) => {
                  setProduct(e.target.value);
                }}
                placeholder="Enter your username..."
                name="product"
                id="product"
                value={product}
              ></input>
            </div>
            <div className="flex">
              <label className="font-semibold mb-1">Description</label>
              <input
                type="text"
                className="border border-gray-300 p-2 pl-3 rounded-lg"
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                placeholder="• • • • • • • • • •"
                name="price"
                id="price"
                value={desc}
              ></input>
            </div>
            <div className="flex">
              <label className="font-semibold mb-1">Enter Amount</label>
              <input
                type="text"
                className="border border-gray-300 p-2 pl-3 rounded-lg"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder="• • • • • • • • • •"
                name="price"
                id="price"
                value={amount}
              ></input>
            </div>
            <div className="flex">
              <label className="font-semibold mb-1">Is On Sale</label>
              <input
                type="checkbox"
                checked={sale}
                onChange={(e) => {
                  setSale(e.target.checked);
                }}
                className="border border-gray-300 p-2 pl-3 rounded-lg"
              ></input>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed p-10 text-center"
            >
              Drop images here
            </div>
            {/* <div className="flex gap-2 flex-wrap">
                            {files.map((file,i)=>(
                                <img
                                draggable
                                onDragStart={()=>setDragIndex(i)}
                                onDrop={()=>handleReorder(i)}
                                onDragOver={(e)=>e.preventDefault()}
                                key={i}
                                src={URL.createObjectURL(file)}
                                className="w-24 h-24 object-cover"
                                />
                            ))}
                        </div> */}
          </div>
          {/* <DragDropProvider onDragEnd={(event) => {
            if (event.canceled) return;
    
            const {target} = event.operation;
            setIsDropped(target?.id === 'droppable');
          }}
        >
    {files.map((file,i)=>(
  <DraggableImage key={i} file={file} id={`img-${i}`} />
))}
            {isDropped && <Draggable />}
            {isDropped ? 'Draggable element is over me' : 'Drag something over me'}
          <Droppable id="droppable">
          {!isDropped && <Draggable />}
          </Droppable>
        </DragDropProvider> */}
          <div>
            <button onClick={submit}>Submit</button>
          </div>
          <SortableUploader files={files} setFiles={setFiles} />
        </form>
      </div>
      <div>
        {productList.map((product) => (
          <li key={product?.id} className="flex">
            <div>
              {product.product}
              {product.price}
              {product.description}
            </div>
          </li>
        ))}
      </div>
    </>
  );
}
