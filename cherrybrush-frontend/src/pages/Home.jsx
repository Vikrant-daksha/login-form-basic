import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";
import FullBanner from "../assets/BannerFull.png";
import HalfBanner from "../assets/BannerHalf.png";
import prodimg from "../assets/Product-img.webp";
import robo from "../assets/cyborg.jpeg";
import PImage from "../assets/Product-img.webp";
import { FaUser } from "react-icons/fa6";
import { IconSlider } from "../components/Carousel.jsx";
import { ProductList } from "../components/ProductList.jsx";
import api from "../api/axiosinstance.jsx";
import { useState } from "react";

export function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [productComments, setProductComments] = useState(null);

  const [radius, setRadius] = useState(window.innerWidth < 640 ? 200 : 400);
  const [items, setItems] = useState(window.innerWidth < 640 ? 4 : 10);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRedirect = (slug) => {
    console.log(slug);
    if (!slug) return;
    navigate(`/products/${slug}`);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error Fecthing Products");
      }
    };

    getProducts();

    const handleResize = () => {
      setRadius(window.innerWidth < 640 ? 200 : 400);
      setItems(window.innerWidth < 640 ? 4 : 10);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!products) return;

    const getComments = async () => {
      try {
        const res = await api.get(`/api/auth/all-comments/`);
        setProductComments(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error Getting Comments");
      }
    };

    getComments();
  }, [products]);

  return (
    <>
      <div
        id="Hero-Banner"
        className="relative flex justify-center w-full h-[70vh] overflow-hidden"
      >
        <div className="absolute">
          <img src={robo} className="object-cover h-[70vh]"></img>
        </div>
        {/* <div className="absolute text-8xl text-black stroke-white stroke-[10px] bg-transparent">
          WEBSELL STORE
        </div> */}
        <div
          id="slider"
          className="absolute text-center sm:w-[150px] sm:h-[150px] h-[200px] w-[200px] top-[30%] left-[calc(50%-100px)] [transform-style:preserve-3d] translate-y-20 sm:translate-y-36 animate-rotate"
        >
          {products?.map((products, i) => (
            <button
              key={i}
              onClick={() => handleRedirect(products?.slug)}
              className="w-full h-full absolute inset-0 cursor-pointer"
              style={{
                transform: `rotateY(${
                  (i * 360) / items
                }deg) translateZ(${radius}px)`,
              }}
            >
              <img
                src={products?.images?.[0]}
                alt={`item-${i + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="my-5 sm:my-8 md:mx-40 px-5">
        <h1 className="text-xl">Explore: Press Ons</h1>
      </div>
      <div
        id="Product-List"
        className=" flex flex-col h-auto px-5 overflow-x-scroll overflow-auto scrollbar-hide md:mx-40"
      >
        <IconSlider>
          <ProductList amt={0} layout={"flex"} />
        </IconSlider>
      </div>
      <div id="Comments" className="mt-16 mb-12 px-6">
        <div className="mt-12 mb-8  text-center">
          <p className="font-semibold">Review from our customers</p>
          <p id="Overall-Rating" className="">
            4.2
          </p>
          <p className="text-[12px] font-light">Overall Reviews</p>
        </div>
        {productComments && (
          <div
            id="Comment-slider"
            className="grid gap-4 grid-cols-1 md:grid-cols-3 overflow-x-hidden "
          >
            {productComments?.map((comment, i) => (
              <div key={i}>
                <div
                  id="Comment"
                  key={i}
                  className="border px-4.5 py-4 overflow-hidden"
                >
                  <div className="mb-4 flex sm:flex justify-between">
                    <div id="Stars" className="font-bold">
                      {comment.rating} / 5
                    </div>
                    <div id="date" className="font-extralight text-gray">
                      {formatDate(comment.comment_date)}
                    </div>
                  </div>
                  <div className="mb-6">
                    <p id="Subject / order" className="font-semibold mb-3">
                      {comment.title}
                    </p>
                    <p id="Content" className="font-light text-wrap h-fit">
                      {comment.comment}
                    </p>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <div className="flex text-sm">
                      <div
                        id="User-profile"
                        className="h-10 w-10 flex shrink-0 border rounded-full p-3 items-center mr-3"
                      >
                        <FaUser />
                      </div>
                      <div className="flex flex-col truncate">
                        <a className="">{comment.user}</a>
                        <a className="text-left font-light">
                          {comment.product_name}
                        </a>
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
          </div>
        )}
      </div>
      <div className="bg-pink-200 py-16 px-10 text-center text-[16px] xl:px-40">
        <div className="py-7 text-[12px]">MEET CHERRYBRUSH</div>
        <div className="flex flex-wrap sm:text-2xl lg:px-40">
          A high design nail art studio based in NYC, Paintbox transcends and
          transforms every aspect of the traditional manicure experience.
          Paintbox offers seasonal collections of thoughtfully-edited nail
          designs and colors reminiscent of runway and editorial trends.
        </div>
      </div>
      <div className="text-center py-8 mb-5">
        <div className="pb-4 text-xl">As Seen On Instagram</div>
        <div className="">Instapage</div>
      </div>
      <div className="grid px-2.5 gap-4 sm:grid-cols-2 grid-cols-1">
        <div className="img-square relative overflow-hidden">
          <img src={HalfBanner}></img>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 sm:px-20 ">
            <p className="text-[14px] mb-3">NAMED</p>
            <p className="text-wrap text-2xl mb-2">
              "Best Press Ons" By Instagram
            </p>
            <p className="text-sm mb-3">2024 Awards</p>
            <button className="border-2 px-4 py-1 text-[10px] tracking-[0.2rem] hover:bg-white hover:text-black ">
              READ NOW
            </button>
          </div>
        </div>
        <div className="img-square relative overflow-hidden">
          <img src={HalfBanner}></img>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 sm:px-20 ">
            <p className="text-[14px] mb-3">NAMED</p>
            <p className="text-wrap text-2xl mb-2">
              "Best Press Ons" By Instagram
            </p>
            <p className="text-sm mb-3">2024 Awards</p>
            <button className="border-2 px-4 py-1 text-[10px] tracking-[0.2rem] hover:bg-white hover:text-black ">
              READ NOW
            </button>
          </div>
        </div>
      </div>
      <div className="bg-pink-100 py-14 text-center text-wrap lg:px-56">
        <div className="flex flex-col-reverse mx-10 mb-16 sm:flex-row">
          <div className="flex flex-col justify-center items-center sm:pr-10">
            <p className="text-sm font-light my-3 sm:mb-3">GIFT CARDS</p>
            <p className="text-sm sm:text-3xl mb-6">
              Give the gift of the Paintbox experience for a manicure that tells
              a story.
            </p>
            <button className="bg-black px-3 py-1.5 text-white text-[11px] tracking-[0.1rem]">
              BUY GIFT CARD
            </button>
          </div>
          <div className="flex shrink-0 text-right sm:w-1/2">
            <img src={HalfBanner}></img>
          </div>
        </div>
        <div className="flex flex-col mx-10 mb-16 sm:flex-row">
          <div className="flex shrink-0 text-left sm:w-1/2">
            <img src={HalfBanner}></img>
          </div>
          <div className="flex flex-col justify-center items-center sm:pl-10">
            <p className="text-sm font-light my-3 sm:mb-3">GET INSPIRED</p>
            <p className="text-sm sm:text-3xl mb-6">
              Follow us on Instagram & TikTok @paintboxnails
            </p>
            <button className="bg-black px-3 py-1.5 text-white text-[11px] tracking-[0.1rem]">
              FOLLOW
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:relative min-w-full sm:h-[35rem] overflow-y-hidden">
        <img
          src={HalfBanner}
          className="w-full sm:w-1/3 h-full object-cover object-center"
        ></img>
        <div className="flex flex-col w-full sm:absolute sm:top-8 sm:left-14 border bg-white sm:w-1/3 py-12 px-8 overflow-hidden">
          <h1 className="text-2xl">Visit Us</h1>
          <p className="py-3 text-sm">
            65 Greene Street
            <br />
            New York, NY 10012
          </p>
          <ul className="list-disc pl-5 text-sm font-light pb-4">
            <li>Mon, 12:00pm - 7:00pm</li>
            <li>Tues, 12:00pm - 7:00pm</li>
            <li>Wed, 11:00am - 7:00pm</li>
            <li>Thurs, Fri, 10:30am - 7:30pm</li>
            <li>Sat, 10:30am - 6:00pm</li>
            <li>Sun, 11:30am - 6:00pm</li>
          </ul>
          <p className="text-sm font-light pb-3">
            Send us an email at hi@paint-box.com for any studio-related
            inquiries
          </p>
          <p className="text-sm font-medium">
            Or text us at: +1 (402) 726-6817
          </p>
        </div>
      </div>
      <div className="mb-12 text-center">
        <p className="py-8 text-2xl">Join Our Community</p>
        <p className="px-6 font-light text-lg pb-6">
          Subscribe to our newsletter to be the first to know about new
          launches, sales and promotions, updates,
        </p>
        <form method="POST" className="overflow-x-hidden sm:px-20">
          <input
            type="text"
            placeholder="Enter your email"
            className="border py-1.5 px-6"
          ></input>
          <button
            type="submit"
            className="px-3 py-1.5 bg-black text-white tracking-widest"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </>
  );
}
