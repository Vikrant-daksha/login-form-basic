import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosinstance';
import { FaHeart } from 'react-icons/fa';

export function ProductDetails(){
  
  const { slug } = useParams(); // Access the dynamic parameter
  const [prod, setProd] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const getProducts = async() => {
        try {
            const res = await api.get(`/api/products/${slug}`);
            console.log(res.data)
            setProd(res.data);
        } catch (err) {
            console.error('Error Fecthing Products')
        }
    }

    getProducts();
  }, [])  
  
  useEffect(() => {
    if (prod?.images?.length) {
      setSelectedImg(prod.images[0].replace("/upload/","/upload/w_900,h_900,c_fill/"));
    }
  }, [prod]);
  

  if (!prod) return <p>Loading...</p>;

  return (
    <>
    <div className='w-full py-6 h-[100000px]'>
      <div>
        <div className='w-full grid grid-cols-1 px-6 md:grid-cols-2 md:px-12'>
          {/* <div className='w-full flex justify-center top-24 pb-5 h-min md:sticky md:pr-5'> */}
            {/* <ul className='min-w-10 pr-2'>
              <li className='aspect-square mb-1 object-contain object-center max-h-14'><img src={prod.images[0]}></img></li>
              <li className='aspect-square mb-1 object-contain object-center max-h-14'><img src={prod.image}></img></li>
              <li className='aspect-square mb-1 object-contain object-center max-h-14'><img src={prod.image}></img></li>
              <li className='aspect-square mb-1 object-contain object-center max-h-14'><img src={prod.image}></img></li>
              <li className='aspect-square mb-1 object-contain object-center max-h-14'><img src={prod.image}></img></li>
            </ul>
            <div id='mainImg' className='relative w-fit aspect-square min-w-64 max-w-md'>
                <div className='absolute top-2 left-2 bg-white z-10 p-2 rounded-full'><FaHeart/></div>
                <div className='sticky object-contain aspect-square'><img src={prod.images[0]} className='sticky aspect-square '></img></div>
            </div> */}
            <div className='w-full flex justify-center top-24 h-min md:sticky md:pr-5'>

  <ul className='min-w-10 pr-2'>
    {prod?.images?.map((img,i)=>(
      <li
      key={i}
      className='aspect-square mb-1 max-h-14 cursor-pointer'
      onClick={()=>setSelectedImg(img)}
      >
        <img src={img} className='object-contain h-full w-full'/>
      </li>
    ))}
  </ul>

  <div className='relative w-full aspect-square min-w-64 max-w-md'>
    <div className='absolute top-2 left-2 bg-white  p-2 rounded-full'>
      <FaHeart/>
    </div>

    {selectedImg && <img src={selectedImg} className='object-contain aspect-square'/>}

  </div>
  {/* </div> */}
          </div>
          <div className='px-4'>
            <div className='mb-5 pb-3 border-b border-gray-400'>
              <h1 className='uppercase text-[20px] pb-2'>{prod.product}</h1>
              <div className='py-1 hidden'>
                Tags
              </div>
              <p>Price: <span className='' >₹ {prod.price}</span></p>
            </div>
            <div>
              <p className='text-[12px] font-light mb-4'>Free shipping on order above 2000/-</p>
              <button className='w-full text-sm py-3 bg-black text-white font-semibold tracking-[0.5rem] mb-6'>ADD TO CART</button>
              <p className='text-[12px] font-light'>Punch up your look with This set, a white design on a nude base and chrome finish, elevated with a long length.</p><br></br>
              <p className='text-[12px] font-light'>Launched in India, Cherrybrush Press Ons are here to elevate your look and change the DIY nail game.</p><br></br>
              <p className='text-[12px] font-light'>Quick-change gel tabs + brush-on glue in every box.</p><br></br>
              <details className="border-x border-t">
                <summary className="py-2 cursor-pointer font-semibold list-none text-center">
                    Support
                </summary>
                <div className='border-b border mx-4'></div>
                <div className='text-sm font-extralight px-4 py-4'>
                <p className='mb-4'>
                Our award-winning Cherrybrush Press Ons were created at the iconic Paintbox studio in India — designed by the tastemakers in nail art and favored by editors and nail lovers alike.
                </p>
                <div className='mb-4'>
                <span className='font-normal'>Custom Shape</span> - Our iconic Cherrybrush oval shape and medium length give a modern, sophisticated look <br/>
                <span className='font-normal'>Non-Damaging</span> - Each box comes with quick-change gel tabs, which allow for easy application and fast, hassle-free removal <br/>
                <span className='font-normal'>Versatility</span> - Opt for either short term or longer wear with our inclusion of both gel tabs and brush-on glue <br/>
                <span className='font-normal'>Reusable</span> - Style and rewear your press ons based on your mood, outfit, or occasion <br/>
                <span className='font-normal'>Sustainable components </span> - Our Press Ons are made with recycled plastic, and the luxe paper packaging aims to further reduce the unnecessary use of plastic <br/>
                </div>
                <p className='mb-4'>
                *We guarantee that our Press Ons will stay on for 14 days when properly applied using the brush-on glue included. If not, we'll give you your money back.
                </p>
                </div>
            </details>
            <details className="border-x border-y">
                <summary className="py-2 cursor-pointer font-semibold list-none text-center">
                    Ingredients
                </summary>
                <div className='border-b border mx-4'></div>
                <div className='text-sm font-extralight px-4 py-4'>
                <p className='mb-4'>
                Paintbox Press Ons are purposefully made with RCS (Recycled Claim Standard) Plastic and the paper packaging aims to reduce the unnecessary use of plastic
                </p>
                <p className='mb-4'>
                Glue Ingredients: Ethyl Cyanoacrylate, Polymethyl Methacrylate, BHA, CI 15850
                </p>
                <p className='mb-4'>
                Gel Tab Ingredients: Ethylhexyl Acrylate, Polyethylene Terephthalate, Polyethylene
                </p>
                </div>
            </details>
            <details className="border-x border-b">
                <summary className="py-2 cursor-pointer font-semibold list-none text-center">
                    Whats Included
                </summary>
                <div className='border-b border mx-4'></div>
                <div className='text-sm font-extralight px-4 py-4'>
                <p className='mb-4'>Two baggies of press ons, one for each hand, containing sixteen tip sizes per hand</p>
                <p className='mb-4'>- Gel Press On Tabs</p>
                <p className='mb-4'>- Brush-on glue</p>
                <p className='mb-4'>- Alcohol cleansing pad</p>
                <p className='mb-4'>- Wooden cuticle stick</p>
                <p className='mb-4'>- Nail file & buffer</p>
                <p className='mb-4'>- Card with written instructions</p>
                <p className='mb-4'>- QR code to a video tutorial</p>
                </div>
            </details>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </>
);
}
