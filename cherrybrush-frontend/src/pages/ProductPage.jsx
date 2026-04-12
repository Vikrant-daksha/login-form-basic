import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axiosinstance";
import {
  FaHeart,
  FaUser,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { useAuth } from "../context/Authcontext";
import { IconSlider } from "../components/Carousel";
import { ProductList } from "../components/ProductList";

export function ProductDetails() {
  const { user } = useAuth();

  const { slug } = useParams();
  const [prod, setProd] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [cart, setCart] = useState([]);
  const [productQuantity, setProductQuantity] = useState(0);
  const [addCommentPopup, setAddCommentPopup] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedShape, setSelectedShape] = useState("");
  const [seletedVariant, setSelectedVariant] = useState(null);
  const [cartItemsId, setCartItemsId] = useState(null);

  const [productComments, setProductComments] = useState(null);
  const [title, setTitle] = useState(null);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState(null);
  const navigate = useNavigate();

  const SORT_SIZE = ["XS", "S", "M", "L", "XL", "XXL", "CUSTOM"];

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const res = await api.get("/api/auth/cart");
        if (!res.data) {
          return;
        } else {
          setCart(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await api.get(`/api/products/${slug}`);
        setProd(res.data.product);
        setVariants(res.data.variant);
        console.log(res.data);
      } catch (err) {
        console.error("Error Fecthing Products");
      }
    };

    getProduct();
  }, [slug]);

  useEffect(() => {
    if (!prod) return;

    const getComments = async () => {
      try {
        const res = await api.get(`/api/auth/get-comments/${prod.product_id}`);
        setProductComments(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error Getting Comments");
      }
    };

    getComments();
  }, [prod]);

  useEffect(() => {
    if (prod?.images?.length) {
      setSelectedImg(
        prod.images[0].replace("/upload/", "/upload/w_900,h_900,c_fill/")
      );
    }
  }, [prod]);

  const colors = [...new Set(variants?.map((v) => v.color))];
  const sizes = [...new Set(variants?.map((v) => v.size))];
  const shapes = [...new Set(variants?.map((v) => v.shape))];

  const sortSize = sizes.sort(
    (a, b) => SORT_SIZE.indexOf(a) - SORT_SIZE.indexOf(b)
  );

  const finalVariant = (value) => {
    if (selectedColor && selectedSize) {
      const finalVariant = variants
        .map((v) => {
          const size = v.size;
          const shape = v.shape;
          const color = v.color;

          if (
            shape === value &&
            size === selectedSize &&
            color === selectedColor
          ) {
            return v;
          }
        })
        .filter((v) => v !== undefined);
      console.log(finalVariant);
      setSelectedVariant(finalVariant);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    if (!cartItemsId) {
      alert("Add To Cart First!!!");
      return;
    }
    if (productQuantity > 0) {
      navigate(`/checkout?productId=${cartItemsId}`);
    }
  };

  const handleComment = async (product_id) => {
    if (!user) return;
    if (!title || !comment || !rating) {
      alert("Field Cannot be Empty.");
      return;
    }

    const commentData = {
      productId: product_id,
      title: title,
      rating: rating,
      comment: comment,
    };

    const res = await api.post("/api/auth/post-comment", commentData);
    console.log(res.data);
    // Refresh comments after posting
    const updatedComments = await api.get(
      `/api/auth/get-comments/${product_id}`
    );
    setProductComments(updatedComments.data);
    setAddCommentPopup(false);
    setTitle("");
    setRating(0);
    setComment("");
  };

  const StarRating = ({ rating, showText = false }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">{stars}</div>
        {showText && (
          <span className="text-sm font-medium text-gray-600">
            {rating} / 5
          </span>
        )}
      </div>
    );
  };

  const StarRatingInput = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null);

    return (
      <div className="flex gap-1 py-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative w-6 h-6 cursor-pointer">
            {/* Left half for .5 ratings */}
            <div
              className="absolute left-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHover(star - 0.5)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star - 0.5)}
            />
            {/* Right half for full ratings */}
            <div
              className="absolute right-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
            />
            {/* Visual representation */}
            <div className="text-xl">
              {(hover || rating) >= star ? (
                <FaStar className="text-yellow-400" />
              ) : (hover || rating) >= star - 0.5 ? (
                <FaStarHalfAlt className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-gray-300" />
              )}
            </div>
          </div>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm font-semibold">{rating} Stars</span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!user) return;
    if (cart) {
      const product = cart?.find((c) => c.product_id === prod?.product_id);
      const cartId = cart?.find((c) => {
        if (c.product_id === prod?.product_id) return c.cart_items_id;
      });
      if (product && cartId) {
        const { quantity } = product;
        const { cart_items_id } = cartId;
        setProductQuantity(quantity);
        setCartItemsId(cart_items_id);
        console.log(cart_items_id);
      }
    }
  }, [cart]);

  const removeFromCart = async (productId) => {
    if (!user) return;
    if (cartItemsId) {
      const res = await api.delete(`/api/remove/${cartItemsId}`);

      setCart((cart) => cart.filter((item) => item.product_id !== productId));
      setProductQuantity(0);
      setCartItemsId(null);

      console.log(res.data);
    }
  };

  const handleLocalChange = (pq) => {
    if (!user) return alert("Login To Add to Cart");

    setProductQuantity((pq) => Number(pq) + 1);
  };

  const addToCart = async (productId) => {
    if (!user) return;
    try {
      let productItem = {
        product_id: productId,
      };
      if (seletedVariant) {
        const id = seletedVariant.map((v) => v.id);
        productItem = {
          product_id: productId,
          product_variant_id: id[0],
        };
      }
      const res = await api.post("/api/add-to-cart/", productItem);
      console.log(res.data);
      setCartItemsId(res.data.cart_items_id);
    } catch (err) {
      console.error("error", err);
    }
  };

  if (!prod) return <p>Loading...</p>;

  return (
    <>
      <div className="w-full py-6">
        <div>
          <div className="grid grid-cols-1 px-6 pb-20 border-b md:grid-cols-2 md:mx-12">
            <div className="w-full flex justify-center top-24 h-min mb-5 md:sticky md:pr-5 md:mb-0">
              <ul className="min-w-10 pr-2">
                {prod?.images?.map((img, i) => (
                  <li
                    key={i}
                    className="aspect-square mb-1 max-h-14 cursor-pointer"
                    onClick={() => setSelectedImg(img)}
                  >
                    <img src={img} className="object-contain h-full w-full" />
                  </li>
                ))}
              </ul>

              <div className="relative w-full aspect-square min-w-64 max-w-md">
                <div className="absolute top-2 left-2 bg-white  p-2 rounded-full">
                  <FaHeart />
                </div>

                {selectedImg && (
                  <img
                    src={selectedImg}
                    className="object-cover aspect-square"
                  />
                )}
              </div>
            </div>
            <div className="px-4 w-full md:w-full md:mr-auto">
              <div className="mb-5 pb-3 border-b border-gray-400">
                <h1 className="uppercase text-[20px] pb-2">{prod.product}</h1>
                <div className="py-1 hidden">Tags</div>
                <p>
                  Price: <span className="">₹ {prod.price}</span>
                </p>
              </div>
              {variants && (
                <>
                  <div className="w-1/2 flex justify-between">
                    {sortSize?.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSize(s);
                        }}
                        className={
                          selectedSize === s
                            ? "border px-2 mr-3 border-black bg-gray-200"
                            : "border px-2 mr-3 border-black"
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-3 my-3">
                    {colors?.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setSelectedColor(c);
                        }}
                        className={`flex w-full border-2 border-${c.toLowerCase()}-500`}
                      >
                        <div
                          className={
                            selectedColor === c
                              ? `w-5 h-5 rounded-full bg-gray-200`
                              : `w-5 h-5 rounded-full bg-${c.toLowerCase()}-500 mr-1`
                          }
                        ></div>
                        {c}
                      </div>
                    ))}
                  </div>
                  {shapes.length !== 0 && (
                    <div className="mb-4">
                      <select
                        className="p-2 border"
                        value={selectedShape}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedShape(value);
                          finalVariant(value);
                        }}
                      >
                        <option value={""} disabled selected>
                          --select-shape--
                        </option>
                        {shapes?.map((sh) => (
                          <option key={sh} value={sh}>
                            {sh}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
              <div className="max-w-full">
                <div
                  className={
                    productQuantity > 0
                      ? "grid grid-cols-[2fr_1fr] gap-3 w-full mb-2"
                      : `grid grid-cols-1 mb-2`
                  }
                >
                  <div className="w-full">
                    {productQuantity > 0 ? (
                      <button
                        onClick={() => {
                          addToCart(prod?.product_id);
                          handleLocalChange();
                        }}
                        className="w-full h-full text-sm py-3 bg-black text-white font-semibold tracking-[0.5rem]"
                      >
                        {productQuantity}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addToCart(prod?.product_id);
                          handleLocalChange();
                        }}
                        className="w-full h-full text-sm py-3 bg-black text-white font-semibold tracking-[0.5rem]"
                      >
                        ADD TO CART
                      </button>
                    )}
                  </div>
                  {productQuantity > 0 && (
                    <div className="w-full">
                      <button
                        onClick={() => removeFromCart(Number(prod?.product_id))}
                        className="border w-full h-full flex justify-center items-center text-center text-red-600"
                      >
                        <TbTrash className="mr-3" />
                        <div className="flex justify-center items-center">
                          Remove
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full mb-3">
                  <button
                    onClick={() => handleCheckout()}
                    className="w-full border py-3"
                  >
                    Buy Now
                  </button>
                </div>
                <p className="text-[12px] font-light mb-6">
                  Free shipping on order above 2000/-
                </p>
                <div
                  className="text-sm font-medium mb-5"
                  dangerouslySetInnerHTML={{ __html: prod?.description }}
                />
                {/* <p className="text-[12px] font-light">
                  Punch up your look with This set, a white design on a nude
                  base and chrome finish, elevated with a long length.
                </p>
                <br></br>
                <p className="text-[12px] font-light">
                  Launched in India, Cherrybrush Press Ons are here to elevate
                  your look and change the DIY nail game.
                </p>
                <br></br>
                <p className="text-[12px] font-light">
                  Quick-change gel tabs + brush-on glue in every box.
                </p>
                <br></br>
                <details className="border-x border-t w-">
                  <summary className="py-2 cursor-pointer font-semibold list-none text-center">
                    Support
                  </summary>
                  <div className="border-b border mx-4"></div>
                  <div className="text-sm font-extralight px-4 py-4 w-full">
                    <p className="mb-4">
                      Our award-winning Cherrybrush Press Ons were created at
                      the iconic Paintbox studio in India — designed by the
                      tastemakers in nail art and favored by editors and nail
                      lovers alike.
                    </p>
                    <div className="mb-4">
                      <span className="font-normal">Custom Shape</span> - Our
                      iconic Cherrybrush oval shape and medium length give a
                      modern, sophisticated look <br />
                      <span className="font-normal">Non-Damaging</span> - Each
                      box comes with quick-change gel tabs, which allow for easy
                      application and fast, hassle-free removal <br />
                      <span className="font-normal">Versatility</span> - Opt for
                      either short term or longer wear with our inclusion of
                      both gel tabs and brush-on glue <br />
                      <span className="font-normal">Reusable</span> - Style and
                      rewear your press ons based on your mood, outfit, or
                      occasion <br />
                      <span className="font-normal">
                        Sustainable components{" "}
                      </span>{" "}
                      - Our Press Ons are made with recycled plastic, and the
                      luxe paper packaging aims to further reduce the
                      unnecessary use of plastic <br />
                    </div>
                    <p className="mb-4">
                      *We guarantee that our Press Ons will stay on for 14 days
                      when properly applied using the brush-on glue included. If
                      not, we'll give you your money back.
                    </p>
                  </div>
                </details>
                <details className="border-x border-y">
                  <summary className="py-2 cursor-pointer font-semibold list-none text-center">
                    Ingredients
                  </summary>
                  <div className="border-b border mx-4"></div>
                  <div className="text-sm font-extralight px-4 py-4">
                    <p className="mb-4">
                      Paintbox Press Ons are purposefully made with RCS
                      (Recycled Claim Standard) Plastic and the paper packaging
                      aims to reduce the unnecessary use of plastic
                    </p>
                    <p className="mb-4">
                      Glue Ingredients: Ethyl Cyanoacrylate, Polymethyl
                      Methacrylate, BHA, CI 15850
                    </p>
                    <p className="mb-4">
                      Gel Tab Ingredients: Ethylhexyl Acrylate, Polyethylene
                      Terephthalate, Polyethylene
                    </p>
                  </div>
                </details>
                <details className="border-x border-b">
                  <summary className="py-2 cursor-pointer font-semibold list-none text-center">
                    Whats Included
                  </summary>
                  <div className="border-b border mx-4"></div>
                  <div className="text-sm font-extralight px-4 py-4">
                    <p className="mb-4">
                      Two baggies of press ons, one for each hand, containing
                      sixteen tip sizes per hand
                    </p>
                    <p className="mb-4">- Gel Press On Tabs</p>
                    <p className="mb-4">- Brush-on glue</p>
                    <p className="mb-4">- Alcohol cleansing pad</p>
                    <p className="mb-4">- Wooden cuticle stick</p>
                    <p className="mb-4">- Nail file & buffer</p>
                    <p className="mb-4">- Card with written instructions</p>
                    <p className="mb-4">- QR code to a video tutorial</p>
                  </div>
                </details> */}
              </div>
            </div>
          </div>
          <div className="my-5 sm:my-8 md:mx-40 px-5">
            <h1 className="text-xl">Explore:</h1>
          </div>
          <div
            id="Product-List"
            className=" flex flex-col h-auto px-5 overflow-x-scroll overflow-auto scrollbar-hide md:mx-40"
          >
            <IconSlider>
              <ProductList amt={5} layout={"flex"} />
            </IconSlider>
          </div>
          <div className="my-10 md:my-16 md:mx-40 px-5">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-bold uppercase tracking-wider">
                Product Reviews
              </h2>
              {productComments && productComments.length > 0 && (
                <button
                  onClick={() => setAddCommentPopup(!addCommentPopup)}
                  className="bg-black text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors rounded-md"
                >
                  {addCommentPopup ? "Cancel" : "Add Review"}
                </button>
              )}
            </div>

            {addCommentPopup && (
              <div className="mb-10 p-6 border border-gray-200 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Title</label>
                    <input
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Review title"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Rating</label>
                    <StarRatingInput rating={rating} setRating={setRating} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Comment</label>
                    <textarea
                      onChange={(e) => setComment(e.target.value)}
                      className="border p-2 rounded h-24 focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Share your thoughts about this product..."
                    />
                  </div>
                  <button
                    onClick={() => handleComment(prod?.product_id)}
                    className="bg-black text-white py-3 font-bold uppercase tracking-widest hover:opacity-90 mt-2 rounded-md"
                  >
                    Post Review
                  </button>
                </div>
              </div>
            )}

            {productComments && productComments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {productComments.slice(0, 3).map((comment, i) => (
                  <div key={i}>
                    <div
                      id="Comment"
                      className="border px-5 py-5 overflow-hidden bg-white hover:border-black transition-colors"
                    >
                      <div className="mb-4 flex justify-between items-center">
                        <div id="Stars">
                          <StarRating rating={comment.rating} showText={true} />
                        </div>
                        <div
                          id="date"
                          className="font-extralight text-gray-500 text-sm"
                        >
                          {formatDate(comment.comment_date)}
                        </div>
                      </div>
                      <div className="mb-6">
                        <p id="Subject" className="font-semibold mb-2">
                          {comment.title}
                        </p>
                        <p
                          id="Content"
                          className="font-light text-gray-700 h-fit"
                        >
                          {comment.comment}
                        </p>
                      </div>
                      <div className="border-t pt-4 flex justify-between items-center">
                        <div className="flex text-sm items-center">
                          <div
                            id="User-profile"
                            className="h-10 w-10 flex shrink-0 border rounded-full p-2.5 items-center justify-center mr-3 text-gray-400"
                          >
                            <FaUser />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-medium">{comment.user}</span>
                            <span className="text-xs text-gray-400">
                              {comment.product_name}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 link-img">
                          <Link to={`/products/${comment.product_slug}`}>
                            <img
                              src={comment.product_images?.[0]}
                              width={40}
                              height={40}
                            ></img>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {productComments.length > 3 && (
                  <button
                    onClick={() => {
                      /* Maybe scroll to all reviews or expand */
                    }}
                    className="text-center mt-4 text-sm font-light text-gray-500 hover:text-black"
                  >
                    + View {productComments.length - 3} more reviews
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <FaStar className="text-gray-300 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500 mb-8 text-center max-w-xs">
                  Your opinion matters! Be the first to review this product and
                  share your experience.
                </p>
                <button
                  onClick={() => setAddCommentPopup(true)}
                  className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg rounded-md"
                >
                  Write First Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
