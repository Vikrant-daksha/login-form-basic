--
-- PostgreSQL database dump
--

\restrict glO6P9z3MaznPRiTALaH8yr8V23KIFbVTB9JMXMX3fLtHjnpRGmQEKMZeXbYYVh

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: cbrush
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO cbrush;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    id integer NOT NULL,
    user_id integer NOT NULL,
    address_name character varying(50),
    apt character varying(50),
    address text NOT NULL,
    area character varying(100),
    state_name character varying(100),
    city character varying(100),
    pincode character varying(50),
    mobile_no character varying(30) NOT NULL
);


ALTER TABLE public.address OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_id_seq OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_items_id integer NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint,
    cart_id bigint,
    product_variant_id integer
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_cart_items_id_seq OWNED BY public.cart_items.cart_items_id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    user_id bigint,
    coupon_id integer
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_cart_id_seq OWNER TO postgres;

--
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- Name: colors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colors (
    id integer NOT NULL,
    color character varying(255) NOT NULL
);


ALTER TABLE public.colors OWNER TO postgres;

--
-- Name: colors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colors_id_seq OWNER TO postgres;

--
-- Name: colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colors_id_seq OWNED BY public.colors.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    comment text NOT NULL,
    rating numeric(2,1),
    created_at timestamp with time zone DEFAULT now(),
    title character varying(100)
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: coupon_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_products (
    id integer NOT NULL,
    coupon_id integer,
    product_id integer
);


ALTER TABLE public.coupon_products OWNER TO postgres;

--
-- Name: coupon_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupon_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupon_products_id_seq OWNER TO postgres;

--
-- Name: coupon_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupon_products_id_seq OWNED BY public.coupon_products.id;


--
-- Name: coupon_redemptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_redemptions (
    id integer NOT NULL,
    user_id integer,
    order_id integer,
    coupon_id integer
);


ALTER TABLE public.coupon_redemptions OWNER TO postgres;

--
-- Name: coupon_redemptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupon_redemptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupon_redemptions_id_seq OWNER TO postgres;

--
-- Name: coupon_redemptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupon_redemptions_id_seq OWNED BY public.coupon_redemptions.id;


--
-- Name: discount_coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_coupons (
    id integer NOT NULL,
    discount_code character varying(50) CONSTRAINT discount_coupons_dicount_code_not_null NOT NULL,
    discount_price numeric(10,0),
    referal_id integer,
    created_at timestamp with time zone DEFAULT now(),
    discount_percent numeric(3,2),
    discount_description character varying(255),
    expires_at timestamp without time zone,
    redemption_per_user integer,
    max_redemption integer,
    current_usage_count integer
);


ALTER TABLE public.discount_coupons OWNER TO postgres;

--
-- Name: discount_coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discount_coupons_id_seq OWNER TO postgres;

--
-- Name: discount_coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_coupons_id_seq OWNED BY public.discount_coupons.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    variant_id integer,
    quantity integer NOT NULL,
    price_at_purchase integer NOT NULL,
    product_name text NOT NULL,
    variant_color character varying(50),
    variant_size character varying(50),
    variant_shape character varying(50)
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_amount bigint NOT NULL,
    status character varying(50) NOT NULL,
    payment_method character varying(50),
    created_at timestamp with time zone,
    address_id integer,
    is_email_sent boolean DEFAULT false,
    discount numeric(10,2)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer,
    color_id integer,
    size_id integer,
    shape_id integer,
    stock integer,
    track_inventory boolean DEFAULT true NOT NULL,
    CONSTRAINT product_variants_check CHECK ((((track_inventory = true) AND (stock IS NOT NULL)) OR (track_inventory = false)))
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variants_id_seq OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id bigint NOT NULL,
    product text,
    description text,
    price numeric(10,2),
    sale boolean,
    slug text,
    images text[],
    created_at timestamp with time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: shapes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shapes (
    id integer NOT NULL,
    shape character varying(255) NOT NULL
);


ALTER TABLE public.shapes OWNER TO postgres;

--
-- Name: shapes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shapes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shapes_id_seq OWNER TO postgres;

--
-- Name: shapes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shapes_id_seq OWNED BY public.shapes.id;


--
-- Name: sizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sizes (
    id integer NOT NULL,
    size character varying(255) NOT NULL
);


ALTER TABLE public.sizes OWNER TO postgres;

--
-- Name: sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sizes_id_seq OWNER TO postgres;

--
-- Name: sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sizes_id_seq OWNED BY public.sizes.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    order_id integer,
    gateway_txn_id character varying(100),
    payment_method character varying(50),
    amount numeric(10,2) NOT NULL,
    status character varying(50) NOT NULL,
    gateway_response jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email text,
    phone_no text,
    password_hash text NOT NULL,
    username text,
    is_verified boolean,
    is_active boolean,
    role text,
    failed_login_attempt integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    last_login timestamp with time zone,
    CONSTRAINT at_least_one_identifier CHECK (((email IS NOT NULL) OR (phone_no IS NOT NULL))),
    CONSTRAINT users_check CHECK (((email IS NOT NULL) OR (phone_no IS NOT NULL)))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: cart_items cart_items_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_items_id SET DEFAULT nextval('public.cart_items_cart_items_id_seq'::regclass);


--
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- Name: colors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colors ALTER COLUMN id SET DEFAULT nextval('public.colors_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: coupon_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_products ALTER COLUMN id SET DEFAULT nextval('public.coupon_products_id_seq'::regclass);


--
-- Name: coupon_redemptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions ALTER COLUMN id SET DEFAULT nextval('public.coupon_redemptions_id_seq'::regclass);


--
-- Name: discount_coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_coupons ALTER COLUMN id SET DEFAULT nextval('public.discount_coupons_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: shapes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shapes ALTER COLUMN id SET DEFAULT nextval('public.shapes_id_seq'::regclass);


--
-- Name: sizes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes ALTER COLUMN id SET DEFAULT nextval('public.sizes_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (id, user_id, address_name, apt, address, area, state_name, city, pincode, mobile_no) FROM stdin;
1	45	Vikrant	F - 701	Rashmi Height, Near Venom Gym	\N	\N	Mumbai	401 209	9022903498
2	45	Vikrant	F - 701	Rashmi Height, Near Venom Gym	\N	Maharastra	Mumbai	401 209	9022903498
3	45	Nam	F23	2323	\N	Maharastra	Mumbai	401209	9022903498
4	63	Daksja	fjkwef	dfsgety4et	\N	MAHA	NAHA	738297	9819991544
5	63	MAn	fds	fasd	\N	asd	asd	asd	900000
6	63	DAs	dfsf	dsfs	\N	sdf	sfd	sdf	NaN
7	64	Vd	dsa	asd	\N	ads	asd	asd	902784723
8	65	Sad	F -dnasjkn	asdasd	\N	dasvc	asdxa	906631	4324163455
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (cart_items_id, product_id, quantity, cart_id, product_variant_id) FROM stdin;
81	30	6	7	\N
1370	47	1	40	\N
1374	31	1	42	\N
1372	40	2	41	\N
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (cart_id, user_id, coupon_id) FROM stdin;
7	46	\N
8	47	\N
9	48	\N
12	49	\N
13	51	\N
14	52	\N
15	53	\N
16	54	\N
17	55	\N
18	56	\N
19	57	\N
40	63	\N
42	65	\N
41	64	8
6	45	\N
\.


--
-- Data for Name: colors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colors (id, color) FROM stdin;
6	Blue
7	Black
8	Pink
9	Brown
10	Violet
11	Cyan
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, product_id, comment, rating, created_at, title) FROM stdin;
1	45	31	This so good.	2.5	2026-03-23 23:32:41.498248+05:30	Flask with Nails
2	45	31	No Comment	3.5	2026-03-24 01:15:04.040747+05:30	New
3	45	40	IDK maybe comment or something	4.0	2026-03-24 01:29:47.537454+05:30	New Product Comment
4	64	50	Comment Bro Really Commented	3.6	2026-03-24 01:39:42.190907+05:30	OAS Comment
\.


--
-- Data for Name: coupon_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_products (id, coupon_id, product_id) FROM stdin;
\.


--
-- Data for Name: coupon_redemptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_redemptions (id, user_id, order_id, coupon_id) FROM stdin;
1	45	89	2
2	45	90	5
3	45	91	6
4	45	92	7
5	64	93	5
6	64	94	2
7	64	95	8
8	45	96	8
9	45	97	7
\.


--
-- Data for Name: discount_coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discount_coupons (id, discount_code, discount_price, referal_id, created_at, discount_percent, discount_description, expires_at, redemption_per_user, max_redemption, current_usage_count) FROM stdin;
3	VIK23	9000	45	2026-04-03 13:59:25.113316+05:30	\N	Smoe discount	2026-04-25 00:00:00	\N	\N	\N
4	NON	500	\N	2026-04-06 19:10:01.286052+05:30	\N	onon sdis coupon	2026-04-30 00:00:00	\N	\N	\N
6	OPA	300	\N	2026-04-06 19:44:21.312645+05:30	\N	200	2026-04-25 00:00:00	1	1	1
5	SOLP	800	\N	2026-04-06 19:19:22.940445+05:30	\N	discount  for 800	2026-04-29 00:00:00	1	1000	2
2	MYCOUPON	1000	\N	2026-04-02 00:29:15.364836+05:30	\N	Gives 1000/- off	2026-04-16 00:00:00	\N	\N	\N
8	LINKED	100	45	2026-04-07 01:31:54.27307+05:30	\N	Linked to suer	\N	1	10	2
9	SDS	120	29	2026-04-11 17:00:14.846358+05:30	\N	Linked to SDS	\N	\N	\N	0
7	SAVE2	2	\N	2026-04-06 20:10:41.849828+05:30	\N	Save 2 Rupees	2026-04-11 00:00:00	2	2	2
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, variant_id, quantity, price_at_purchase, product_name, variant_color, variant_size, variant_shape) FROM stdin;
146	67	40	\N	1	1000	New ProDucT	\N	\N	\N
148	69	47	\N	1	2000	also nw	\N	\N	\N
150	71	40	\N	1	1000	New ProDucT	\N	\N	\N
151	72	48	\N	1	1000	dsadascxca	\N	\N	\N
144	65	\N	\N	2	1200	Rave Nails	\N	\N	\N
101	30	\N	\N	1	1200	Rave Nails	\N	\N	\N
106	31	\N	\N	1	1200	Rave Nails	\N	\N	\N
139	64	\N	\N	1	1200	Rave Nails	\N	\N	\N
104	30	\N	\N	1	910	TesT OsRdEr	\N	\N	\N
109	31	\N	\N	1	910	TesT OsRdEr	\N	\N	\N
153	74	40	\N	2	1000	New ProDucT	\N	\N	\N
154	74	31	\N	2	800	Flask With Nails	\N	\N	\N
155	74	30	\N	1	1000	Water Line Nails	\N	\N	\N
156	74	48	\N	1	1000	dsadascdsf	\N	\N	\N
161	76	40	\N	2	1000	New ProDucT	\N	\N	\N
162	76	31	\N	2	800	Flask With Nails	\N	\N	\N
163	76	30	\N	1	1000	Water Line Nails	\N	\N	\N
164	76	48	\N	1	1000	dsadascdsf	\N	\N	\N
169	78	40	\N	2	1000	New ProDucT	\N	\N	\N
170	78	31	\N	2	800	Flask With Nails	\N	\N	\N
171	78	30	\N	1	1000	Water Line Nails	\N	\N	\N
172	78	48	\N	1	1000	dsadascdsf	\N	\N	\N
177	80	40	\N	2	1000	New ProDucT	\N	\N	\N
178	80	31	\N	2	800	Flask With Nails	\N	\N	\N
179	80	30	\N	1	1000	Water Line Nails	\N	\N	\N
180	80	48	\N	1	1000	dsadascdsf	\N	\N	\N
185	82	40	\N	2	1000	New ProDucT	\N	\N	\N
186	82	31	\N	2	800	Flask With Nails	\N	\N	\N
187	82	30	\N	1	1000	Water Line Nails	\N	\N	\N
188	82	48	\N	1	1000	dsadascdsf	\N	\N	\N
193	84	40	\N	2	1000	New ProDucT	\N	\N	\N
194	84	31	\N	2	800	Flask With Nails	\N	\N	\N
195	84	30	\N	1	1000	Water Line Nails	\N	\N	\N
196	84	48	\N	1	1000	dsadascdsf	\N	\N	\N
201	86	40	\N	2	1000	New ProDucT	\N	\N	\N
202	86	31	\N	2	800	Flask With Nails	\N	\N	\N
203	86	30	\N	1	1000	Water Line Nails	\N	\N	\N
204	86	48	\N	1	1000	dsadascdsf	\N	\N	\N
209	88	40	\N	2	1000	New ProDucT	\N	\N	\N
210	88	31	\N	2	800	Flask With Nails	\N	\N	\N
211	88	30	\N	1	1000	Water Line Nails	\N	\N	\N
212	88	48	\N	1	1000	dsadascdsf	\N	\N	\N
213	89	40	\N	2	1000	New ProDucT	\N	\N	\N
214	89	31	\N	2	800	Flask With Nails	\N	\N	\N
215	89	30	\N	1	1000	Water Line Nails	\N	\N	\N
216	89	48	\N	1	1000	dsadascdsf	\N	\N	\N
217	90	40	\N	2	1000	New ProDucT	\N	\N	\N
218	90	31	\N	1	800	Flask With Nails	\N	\N	\N
219	90	30	12	1	1000	Water Line Nails	Blue	S	Short Almond
220	90	30	\N	1	1000	Water Line Nails	\N	\N	\N
221	90	48	\N	1	1000	dsadascdsf	\N	\N	\N
227	92	40	\N	2	1000	New ProDucT	\N	\N	\N
228	92	31	\N	1	800	Flask With Nails	\N	\N	\N
229	92	30	12	1	1000	Water Line Nails	Blue	S	Short Almond
230	92	30	\N	1	1000	Water Line Nails	\N	\N	\N
231	92	48	\N	1	1000	dsadascdsf	\N	\N	\N
232	93	40	\N	1	1000	New ProDucT	\N	\N	\N
234	95	40	\N	2	1000	New ProDucT	\N	\N	\N
235	96	30	\N	2	1000	Water Line Nails	\N	\N	\N
236	97	31	\N	1	800	Flask With Nails	\N	\N	\N
102	30	40	\N	2	1000	New ProDucT	\N	\N	\N
103	30	31	\N	2	800	Flask With Nails	\N	\N	\N
105	30	30	\N	1	1000	Water Line Nails	\N	\N	\N
107	31	40	\N	2	1000	New ProDucT	\N	\N	\N
108	31	31	\N	2	800	Flask With Nails	\N	\N	\N
110	31	30	\N	1	1000	Water Line Nails	\N	\N	\N
140	64	40	\N	2	1000	New ProDucT	\N	\N	\N
141	64	31	\N	2	800	Flask With Nails	\N	\N	\N
143	64	30	\N	1	1000	Water Line Nails	\N	\N	\N
147	68	40	\N	2	1000	New ProDucT	\N	\N	\N
152	73	31	\N	1	800	Flask With Nails	\N	\N	\N
145	66	\N	\N	1	1200	Rave Nails	\N	\N	\N
149	70	\N	\N	1	1200	Rave Nails	\N	\N	\N
142	64	\N	\N	1	910	TesT OsRdEr	\N	\N	\N
157	75	40	\N	2	1000	New ProDucT	\N	\N	\N
158	75	31	\N	2	800	Flask With Nails	\N	\N	\N
159	75	30	\N	1	1000	Water Line Nails	\N	\N	\N
160	75	48	\N	1	1000	dsadascdsf	\N	\N	\N
165	77	40	\N	2	1000	New ProDucT	\N	\N	\N
166	77	31	\N	2	800	Flask With Nails	\N	\N	\N
167	77	30	\N	1	1000	Water Line Nails	\N	\N	\N
168	77	48	\N	1	1000	dsadascdsf	\N	\N	\N
173	79	40	\N	2	1000	New ProDucT	\N	\N	\N
174	79	31	\N	2	800	Flask With Nails	\N	\N	\N
175	79	30	\N	1	1000	Water Line Nails	\N	\N	\N
176	79	48	\N	1	1000	dsadascdsf	\N	\N	\N
181	81	40	\N	2	1000	New ProDucT	\N	\N	\N
182	81	31	\N	2	800	Flask With Nails	\N	\N	\N
183	81	30	\N	1	1000	Water Line Nails	\N	\N	\N
184	81	48	\N	1	1000	dsadascdsf	\N	\N	\N
189	83	40	\N	2	1000	New ProDucT	\N	\N	\N
190	83	31	\N	2	800	Flask With Nails	\N	\N	\N
191	83	30	\N	1	1000	Water Line Nails	\N	\N	\N
192	83	48	\N	1	1000	dsadascdsf	\N	\N	\N
197	85	40	\N	2	1000	New ProDucT	\N	\N	\N
198	85	31	\N	2	800	Flask With Nails	\N	\N	\N
199	85	30	\N	1	1000	Water Line Nails	\N	\N	\N
200	85	48	\N	1	1000	dsadascdsf	\N	\N	\N
205	87	40	\N	2	1000	New ProDucT	\N	\N	\N
206	87	31	\N	2	800	Flask With Nails	\N	\N	\N
207	87	30	\N	1	1000	Water Line Nails	\N	\N	\N
208	87	48	\N	1	1000	dsadascdsf	\N	\N	\N
222	91	40	\N	2	1000	New ProDucT	\N	\N	\N
223	91	31	\N	1	800	Flask With Nails	\N	\N	\N
224	91	30	12	1	1000	Water Line Nails	Blue	S	Short Almond
225	91	30	\N	1	1000	Water Line Nails	\N	\N	\N
226	91	48	\N	1	1000	dsadascdsf	\N	\N	\N
233	94	40	\N	2	1000	New ProDucT	\N	\N	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, payment_method, created_at, address_id, is_email_sent, discount) FROM stdin;
30	45	6710	pending	stripe	2026-03-10 00:42:06.182238+05:30	2	f	\N
31	45	6710	pending	stripe	2026-03-10 00:53:49.566408+05:30	2	f	\N
64	45	6710	paid	stripe	2026-03-10 00:59:21.197962+05:30	2	f	\N
65	45	2400	paid	stripe	2026-03-10 12:24:01.766587+05:30	2	f	\N
66	45	1200	paid	stripe	2026-03-10 12:31:30.387232+05:30	2	f	\N
67	63	1000	paid	stripe	2026-03-10 14:56:16.815672+05:30	\N	f	\N
68	63	2000	pending	stripe	2026-03-10 15:05:51.763522+05:30	\N	f	\N
69	63	2000	paid	stripe	2026-03-10 15:07:09.924629+05:30	6	f	\N
70	64	1200	paid	stripe	2026-03-10 16:53:58.325024+05:30	7	f	\N
71	64	1000	paid	stripe	2026-03-10 16:57:48.506731+05:30	7	t	\N
72	45	1000	paid	stripe	2026-03-10 22:25:24.094013+05:30	2	f	\N
73	65	800	paid	stripe	2026-03-11 01:08:01.280346+05:30	8	t	\N
74	45	5600	pending	stripe	2026-04-03 23:18:07.118916+05:30	3	f	\N
75	45	5600	pending	stripe	2026-04-03 23:27:41.791973+05:30	3	f	\N
76	45	5600	pending	stripe	2026-04-03 23:33:55.015936+05:30	3	f	\N
77	45	5600	pending	stripe	2026-04-03 23:34:37.934987+05:30	3	f	\N
78	45	5600	pending	stripe	2026-04-03 23:34:48.039395+05:30	3	f	\N
79	45	5600	pending	stripe	2026-04-03 23:35:00.340233+05:30	3	f	\N
80	45	5600	pending	stripe	2026-04-03 23:35:51.224001+05:30	3	f	\N
81	45	5600	pending	stripe	2026-04-03 23:36:03.484333+05:30	3	f	\N
82	45	5600	pending	stripe	2026-04-03 23:53:10.282555+05:30	2	f	\N
83	45	5600	pending	stripe	2026-04-04 00:06:26.324475+05:30	3	f	\N
84	45	5600	pending	stripe	2026-04-04 01:09:31.88305+05:30	2	f	\N
85	45	5600	pending	stripe	2026-04-04 01:10:03.929709+05:30	3	f	\N
86	45	5600	paid	stripe	2026-04-04 01:18:55.644041+05:30	3	f	\N
87	45	4600	paid	stripe	2026-04-04 01:24:24.278504+05:30	3	f	\N
88	45	4600	paid	stripe	2026-04-04 01:40:04.722372+05:30	3	f	1000.00
89	45	4600	paid	stripe	2026-04-05 16:36:47.779729+05:30	3	f	1000.00
90	45	5000	paid	stripe	2026-04-06 19:26:18.114844+05:30	3	f	800.00
91	45	5500	paid	stripe	2026-04-06 19:44:39.093102+05:30	3	f	300.00
92	45	5798	paid	stripe	2026-04-06 20:11:21.39239+05:30	3	f	2.00
93	64	200	paid	stripe	2026-04-07 01:24:02.720212+05:30	7	f	800.00
94	64	1000	pending	stripe	2026-04-07 01:30:40.962238+05:30	7	f	1000.00
95	64	1900	paid	stripe	2026-04-07 01:33:05.968725+05:30	7	f	100.00
96	45	1900	paid	stripe	2026-04-08 01:04:37.007243+05:30	3	f	100.00
97	45	798	paid	stripe	2026-04-11 23:21:47.138484+05:30	3	f	2.00
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, product_id, color_id, size_id, shape_id, stock, track_inventory) FROM stdin;
11	40	6	6	6	\N	f
12	30	6	6	6	\N	f
13	31	6	6	6	\N	f
14	32	6	6	6	\N	f
15	40	6	7	6	\N	f
16	40	6	8	6	\N	f
17	40	6	9	6	\N	f
23	32	7	7	6	\N	f
24	32	6	7	7	\N	f
25	40	7	6	6	\N	f
26	40	7	7	6	\N	f
27	40	7	7	7	\N	f
30	32	6	7	6	\N	f
31	32	6	8	6	\N	f
32	43	7	7	7	\N	f
33	31	7	8	7	\N	f
34	46	7	6	7	\N	f
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product, description, price, sale, slug, images, created_at) FROM stdin;
32	Pink Blue Nails	pink with Hint of Blue	900.00	f	pink-blue-nails	{https://res.cloudinary.com/dfvb261lu/image/upload/v1771500675/products/pink-blue-nails/pink-blue-nails-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1771500674/products/pink-blue-nails/pink-blue-nails-2.webp}	2026-02-19 17:01:22.363265+05:30
40	New ProDucT	duct	1000.00	t	new-product	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772449728/products/new-product/new-product-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772449728/products/new-product/new-product-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772449728/products/new-product/new-product-3.webp}	2026-03-04 16:56:49.486528+05:30
31	Flask With Nails	Falsk and Nails	800.00	t	flask-with-nails	{https://res.cloudinary.com/dfvb261lu/image/upload/v1771500443/products/flask-with-naills/flask-with-naills-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1771500442/products/flask-with-naills/flask-with-naills-2.webp}	2026-03-04 16:57:08.500304+05:30
30	Water Line Nails	Water	1000.00	t	water-line-nails	{https://res.cloudinary.com/dfvb261lu/image/upload/v1771500239/products/water-line-nails/water-line-nails-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1771500246/products/water-line-nails/water-line-nails-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772652993/products/water-line-nails/water-line-nails-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772652993/products/water-line-nails/water-line-nails-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772652993/products/water-line-nails/water-line-nails-3.webp}	2026-03-05 01:06:34.946721+05:30
43	My prodas	ew	2000.00	t	my-prodas	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772561972/products/my-prodas/my-prodas-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772561973/products/my-prodas/my-prodas-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772561972/products/my-prodas/my-prodas-3.webp}	2026-03-03 23:49:33.61969+05:30
46	newMakSe	New Dsian	2000.00	t	newmakse	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772562186/products/newmakse/newmakse-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772562187/products/newmakse/newmakse-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772562186/products/newmakse/newmakse-3.webp}	2026-03-03 23:53:07.805423+05:30
47	also nw	Testing Agian	2000.00	t	also-nw	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772562235/products/also-nw/also-nw-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772562235/products/also-nw/also-nw-2.webp}	2026-03-05 00:56:39.008683+05:30
49	dasdasdascscs	rgsd	1500.00	f	dasdasdascscs	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772617029/products/dasdasdascscs/dasdasdascscs-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772617029/products/dasdasdascscs/dasdasdascscs-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772617029/products/dasdasdascscs/dasdasdascscs-3.webp}	2026-03-05 00:56:49.366827+05:30
50	New oas	sdadadas	1200.00	f	new-oas	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772617258/products/new-oas/new-oas-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772617258/products/new-oas/new-oas-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772617258/products/new-oas/new-oas-3.webp}	2026-03-05 00:56:55.675325+05:30
51	csac	xascasc	500.00	f	csac	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772617536/products/csac/csac-1.webp}	2026-03-05 00:57:04.307171+05:30
45	New A	A new Product aded as AU	2000.00	t	new-a	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772562128/products/a/a-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772562129/products/a/a-2.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772562128/products/a/a-3.webp}	2026-03-07 12:25:36.430421+05:30
48	dsadascdsf	dfasfsdfsdfs	1000.00	f	dsadascdsf	{https://res.cloudinary.com/dfvb261lu/image/upload/v1772616924/products/dsadascxca/dsadascxca-1.webp,https://res.cloudinary.com/dfvb261lu/image/upload/v1772616924/products/dsadascxca/dsadascxca-2.webp}	2026-03-17 23:16:52.373358+05:30
\.


--
-- Data for Name: shapes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shapes (id, shape) FROM stdin;
6	Short Almond
7	Medium Almond
8	Short
\.


--
-- Data for Name: sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sizes (id, size) FROM stdin;
6	S
7	M
8	L
9	CUSTOM
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, order_id, gateway_txn_id, payment_method, amount, status, gateway_response, created_at) FROM stdin;
61	67	pi_3T9MYe2L7isJb6lY00zUZ1Bv	card	1000.00	paid	{"id": "pi_3T9MYe2L7isJb6lY00zUZ1Bv", "amount": 100000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773134792, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9MYe2L7isJb6lY00zUZ1Bv_secret_mzR2wmGmTnzjRhywFkVYzR5lX", "latest_charge": "ch_3T9MYe2L7isJb6lY04dVsZUD", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9MYe2L7isJb6lYmlkmpaGG", "transfer_group": null, "amount_received": 100000, "payment_details": {"order_reference": "cs_test_a1yK2YyoOiZIWmCSj4NGyUD1TzubBy00w4Mpj8Q9GExqYGZQ7ktaWdAcQv", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 14:56:36.9435+05:30
3	30	pi_3T99EF2L7isJb6lY0CEryM75	card	6710.00	paid	{"id": "pi_3T99EF2L7isJb6lY0CEryM75", "amount": 671000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773083555, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T99EF2L7isJb6lY0CEryM75_secret_0KK2BKyFYO2hKzv8p686xGmvZ", "latest_charge": "ch_3T99EF2L7isJb6lY012ElMZb", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T99EE2L7isJb6lY0douen8G", "transfer_group": null, "amount_received": 671000, "payment_details": {"order_reference": "cs_test_b1gPLeYVwsO6vCiFD3nsH8xIYRScxDDr6RxCKx2zFKQ5sj9hiDNCxundMS", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 00:42:38.952914+05:30
69	72	pi_3T9TZI2L7isJb6lY03advKDX	card	1000.00	paid	{"id": "pi_3T9TZI2L7isJb6lY03advKDX", "amount": 100000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773161740, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9TZI2L7isJb6lY03advKDX_secret_oivCztLhGgeFgrkJLbts0n72L", "latest_charge": "ch_3T9TZI2L7isJb6lY0kYg14yI", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9TZH2L7isJb6lYdYpNVs7h", "transfer_group": null, "amount_received": 100000, "payment_details": {"order_reference": "cs_test_a1nl4ZPDz18Mm8sT0Py8IPXtEdt0T4FeKZAZNTjJlvNCFC3X40XwvAs5ZR", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 22:25:45.354532+05:30
5	64	pi_3T99Uq2L7isJb6lY14K8JiSK	card	6710.00	paid	{"id": "pi_3T99Uq2L7isJb6lY14K8JiSK", "amount": 671000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773084584, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T99Uq2L7isJb6lY14K8JiSK_secret_iA0vbiPftTkUpDfTg1NdLwQvL", "latest_charge": "ch_3T99Uq2L7isJb6lY13XPNMJF", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T99Up2L7isJb6lYzCIvkwrk", "transfer_group": null, "amount_received": 671000, "payment_details": {"order_reference": "cs_test_b13vtsvnT8JqgWp5RPNY3bQKlqhK6Vi0IPyVyubqgLP7TekDBDd192bQae", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 00:59:59.004209+05:30
6	65	pi_3T9KBQ2L7isJb6lY0dCRrWy1	card	2400.00	paid	{"id": "pi_3T9KBQ2L7isJb6lY0dCRrWy1", "amount": 240000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773125664, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9KBQ2L7isJb6lY0dCRrWy1_secret_JmtiSj7LmSjCsnWkpVs9qWLys", "latest_charge": "ch_3T9KBQ2L7isJb6lY0Nkf0JWb", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9KBP2L7isJb6lYUy2OuYB4", "transfer_group": null, "amount_received": 240000, "payment_details": {"order_reference": "cs_test_a12XqlsnK9DK7XA6AXwZV9JptagbyYAC1blcBIC7AIwbOS1TM14rvPbttu", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 12:24:28.112091+05:30
63	69	pi_3T9MjF2L7isJb6lY1DOVNX2u	card	2000.00	paid	{"id": "pi_3T9MjF2L7isJb6lY1DOVNX2u", "amount": 200000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773135449, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9MjF2L7isJb6lY1DOVNX2u_secret_4WyRuCzWyeuloRI3Y8AjrLyoB", "latest_charge": "ch_3T9MjF2L7isJb6lY1wkURC3N", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9MjE2L7isJb6lYjaf0ml10", "transfer_group": null, "amount_received": 200000, "payment_details": {"order_reference": "cs_test_a16Z43JaYskstETuNMZMXF3ksurvsXQ0VlWx90oYYgmaMXc7Tb7Ocx5ZES", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 15:07:33.659147+05:30
65	70	pi_3T9OOa2L7isJb6lY1VpHmZol	card	1200.00	paid	{"id": "pi_3T9OOa2L7isJb6lY1VpHmZol", "amount": 120000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773141856, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9OOa2L7isJb6lY1VpHmZol_secret_vDt4zXsdP2LCEdPfK1i8qzTwI", "latest_charge": "ch_3T9OOa2L7isJb6lY1enMuffH", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9OOZ2L7isJb6lYToLQVk66", "transfer_group": null, "amount_received": 120000, "payment_details": {"order_reference": "cs_test_a1opiIpAuslziDzeRw1rYBSmZjIiA7uXfua5k6SvnvQibqOUl4YH9DJuPh", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 16:54:20.815299+05:30
75	87	pi_3TIDo92L7isJb6lY0nUCv0OO	card	4600.00	paid	{"id": "pi_3TIDo92L7isJb6lY0nUCv0OO", "amount": 460000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775246109, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TIDo92L7isJb6lY0nUCv0OO_secret_4d4aul6mfFjqVGdw53r1Yntxy", "latest_charge": "ch_3TIDo92L7isJb6lY0kR14E30", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TIDo92L7isJb6lY0VU7TjnR", "transfer_group": null, "amount_received": 460000, "payment_details": {"order_reference": "cs_test_b1MlP9IUKB8crmL3g0hTfMifVFvnfrgqbxq4z1JIKneeR2ngF0cTODm2I2", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-04 01:25:19.229758+05:30
67	71	pi_3T9OSE2L7isJb6lY0RFG96If	card	1000.00	paid	{"id": "pi_3T9OSE2L7isJb6lY0RFG96If", "amount": 100000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773142082, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9OSE2L7isJb6lY0RFG96If_secret_lL1LgHxvS5bDwc7Vvq4ElYVEv", "latest_charge": "ch_3T9OSE2L7isJb6lY0mcUmQcl", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9OSD2L7isJb6lYx9O6NuwX", "transfer_group": null, "amount_received": 100000, "payment_details": {"order_reference": "cs_test_a1LoXWPI7fCGs7ZFkvxGqasIfKnnBgyoOQanxgdon2kK6DMVvdXEOQejkK", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 16:58:07.01613+05:30
71	73	pi_3T9W6s2L7isJb6lY1h9BCjHt	card	800.00	paid	{"id": "pi_3T9W6s2L7isJb6lY1h9BCjHt", "amount": 80000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773171510, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9W6s2L7isJb6lY1h9BCjHt_secret_t8tFHx5dh49OT2SqxVMg5tL9Q", "latest_charge": "ch_3T9W6s2L7isJb6lY1UiOLuEN", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9W6r2L7isJb6lYygz6K8WZ", "transfer_group": null, "amount_received": 80000, "payment_details": {"order_reference": "cs_test_a1gfwE2x6E1Z3AysZZ1pqyLNSINxzTrPYvAEMu46oPUOHlDg8hIUxnMpd1", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-11 01:08:33.527178+05:30
17	66	pi_3T9KIX2L7isJb6lY0Pz6DErP	card	1200.00	paid	{"id": "pi_3T9KIX2L7isJb6lY0Pz6DErP", "amount": 120000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1773126105, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3T9KIX2L7isJb6lY0Pz6DErP_secret_fGPXYvxdKvM9MWjfYw1XmV9VK", "latest_charge": "ch_3T9KIX2L7isJb6lY0v2XOFGR", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1T9KIX2L7isJb6lYEvvXvMew", "transfer_group": null, "amount_received": 120000, "payment_details": {"order_reference": "cs_test_a1VNwLlxZOF9Ow4U3N4HCzYQqRuTc0w9Khio6KfyMYNND3Sf0UXULP8Anr", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-03-10 12:31:49.926419+05:30
73	86	pi_3TIDic2L7isJb6lY1qEESNCD	card	5600.00	paid	{"id": "pi_3TIDic2L7isJb6lY1qEESNCD", "amount": 560000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775245766, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TIDic2L7isJb6lY1qEESNCD_secret_QhStdRWdvmDLNISHB2PXL0jcb", "latest_charge": "ch_3TIDic2L7isJb6lY17SFu2sk", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TIDic2L7isJb6lYmNVxlxw0", "transfer_group": null, "amount_received": 560000, "payment_details": {"order_reference": "cs_test_b1CRmsgsHmX7RDtH2Oe17xXqErVW8Kv6xVL58bbGylxXXF3It6XkjRg7XE", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-04 01:19:36.130238+05:30
78	88	pi_3TIE382L7isJb6lY0kp5UEcS	card	4600.00	paid	{"id": "pi_3TIE382L7isJb6lY0kp5UEcS", "amount": 460000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775247038, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TIE382L7isJb6lY0kp5UEcS_secret_tdz4FKTdaxEJ9W5vpulPFdpIg", "latest_charge": "ch_3TIE382L7isJb6lY0ApgnG3b", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TIE382L7isJb6lYsalkM6GX", "transfer_group": null, "amount_received": 460000, "payment_details": {"order_reference": "cs_test_b19IUmAk38gP5GqVNnU5PcXDUBO83vq6uq5jt2BHpRIuqOEIHG3i3WMSSh", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-04 01:40:48.184908+05:30
84	89	pi_3TIodF2L7isJb6lY1fcuYunr	card	4600.00	paid	{"id": "pi_3TIodF2L7isJb6lY1fcuYunr", "amount": 460000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775387661, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TIodF2L7isJb6lY1fcuYunr_secret_qwCIpTQktoowCIZntThtLWHyW", "latest_charge": "ch_3TIodF2L7isJb6lY1ELWM1q4", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TIodE2L7isJb6lYWVDSGAx1", "transfer_group": null, "amount_received": 460000, "payment_details": {"order_reference": "cs_test_b1Hj9hQVArfXvOw38tj7oIXKzne1kdOXkMNXAgxysTZ7kdn0k8jOwcoTYP", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-05 16:44:34.480364+05:30
86	90	pi_3TJDdw2L7isJb6lY0fjshjZt	card	5000.00	paid	{"id": "pi_3TJDdw2L7isJb6lY0fjshjZt", "amount": 500000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775483804, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TJDdw2L7isJb6lY0fjshjZt_secret_zRppeMYf6IJM720uDiKEkbzON", "latest_charge": "ch_3TJDdw2L7isJb6lY0hJ7Pc2D", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TJDdv2L7isJb6lYbpDS8UDq", "transfer_group": null, "amount_received": 500000, "payment_details": {"order_reference": "cs_test_b16HfCxdXMz9zlEXNwEQ1I4DngsfPYaCCRtz3OvQHeKtoGNAq8RAIUvVWy", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-06 19:26:49.678997+05:30
88	91	pi_3TJDvY2L7isJb6lY1buqnTV6	card	5500.00	paid	{"id": "pi_3TJDvY2L7isJb6lY1buqnTV6", "amount": 550000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775484896, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TJDvY2L7isJb6lY1buqnTV6_secret_5PPPxv3ryu8IWUaj1MBB9qMSN", "latest_charge": "ch_3TJDvY2L7isJb6lY1XOQo8SF", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TJDvX2L7isJb6lYT6oRtU3l", "transfer_group": null, "amount_received": 550000, "payment_details": {"order_reference": "cs_test_b14QNFD0Ubix7NrEOgCfyCjAKM9fz25jczeCgjUiua2nb4ZLyDB0Yv7tKD", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-06 19:45:01.018084+05:30
90	92	pi_3TJELN2L7isJb6lY0uHHRo7b	card	5798.00	paid	{"id": "pi_3TJELN2L7isJb6lY0uHHRo7b", "amount": 579800, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775486497, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TJELN2L7isJb6lY0uHHRo7b_secret_cjlpiKJHxuqtIn6v5tlhDxVTd", "latest_charge": "ch_3TJELN2L7isJb6lY0znESfM0", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TJELM2L7isJb6lYsXMDoUxp", "transfer_group": null, "amount_received": 579800, "payment_details": {"order_reference": "cs_test_b1TnrjLGiMl9WhMD0gs96EkiXNYNJwxBnXbAwMKPW2gC4bg62pIdvHrxrr", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-06 20:11:42.419754+05:30
92	93	pi_3TJJDz2L7isJb6lY0S20oy4k	card	200.00	paid	{"id": "pi_3TJJDz2L7isJb6lY0S20oy4k", "amount": 20000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775505259, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TJJDz2L7isJb6lY0S20oy4k_secret_YOBw7VCTAcDFa2ZQxgvqZuU3m", "latest_charge": "ch_3TJJDz2L7isJb6lY0ae8c5tE", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TJJDz2L7isJb6lY4ehbb5pe", "transfer_group": null, "amount_received": 20000, "payment_details": {"order_reference": "cs_test_a1VhJ8bb5CHpOetHZUEjvJ3uHLMabwwEeSyTG7rx2qg8mb5ElfaSg5skjG", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-07 01:24:25.461177+05:30
94	95	pi_3TJJMn2L7isJb6lY1LjvxyEE	card	1900.00	paid	{"id": "pi_3TJJMn2L7isJb6lY1LjvxyEE", "amount": 190000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775505805, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TJJMn2L7isJb6lY1LjvxyEE_secret_lSKQk8lUXQW5pcEI4rofTqpCX", "latest_charge": "ch_3TJJMn2L7isJb6lY10hUYv0l", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TJJMm2L7isJb6lYE5dkUj52", "transfer_group": null, "amount_received": 190000, "payment_details": {"order_reference": "cs_test_a1KtcS7nqXgEz7jINwisyazGOvz1u1e84xJeIoWEFZOmfxpVCq1XGtTq5K", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-07 01:33:31.404707+05:30
96	96	pi_3TJfOi2L7isJb6lY17l7yr4L	card	1900.00	paid	{"id": "pi_3TJfOi2L7isJb6lY17l7yr4L", "amount": 190000, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775590492, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TJfOi2L7isJb6lY17l7yr4L_secret_Xkpub8ECYq4YiOty94kBjQQQ8", "latest_charge": "ch_3TJfOi2L7isJb6lY1XGAjpKK", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TJfOh2L7isJb6lYmXBfZGut", "transfer_group": null, "amount_received": 190000, "payment_details": {"order_reference": "cs_test_a1pYPmLmSk1iIbHdUaGARObSAH3ZWJT5lMz7aEX7T9tnsd3OKJIEjv7uQf", "customer_reference": null}, "customer_account": null, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-08 01:04:57.538134+05:30
98	97	pi_3TL5hK2L7isJb6lY0403e3RI	card	798.00	paid	{"id": "pi_3TL5hK2L7isJb6lY0403e3RI", "amount": 79800, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1775929918, "currency": "inr", "customer": null, "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": null, "next_action": null, "on_behalf_of": null, "client_secret": "pi_3TL5hK2L7isJb6lY0403e3RI_secret_eLuDwbuNOYnN4V5Iqx3dupNC8", "latest_charge": "ch_3TL5hK2L7isJb6lY0bcaxMYS", "receipt_email": null, "transfer_data": null, "amount_details": {"tax": {"total_tax_amount": 0}, "tip": {}, "shipping": {"amount": 0, "to_postal_code": null, "from_postal_code": null}}, "capture_method": "automatic_async", "payment_method": "pm_1TL5hJ2L7isJb6lYgefuVU1v", "transfer_group": null, "amount_received": 79800, "payment_details": {"order_reference": "cs_test_a12tMrG4HlzRcFdKuYdO2NfbFG3Kbdo1khEJiWdyPr0TpnNrSMm8SPlghl", "customer_reference": null}, "customer_account": null, "managed_payments": {"enabled": false}, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": null, "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	2026-04-11 23:22:12.209412+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, phone_no, password_hash, username, is_verified, is_active, role, failed_login_attempt, created_at, updated_at, last_login) FROM stdin;
42	wq@	\N	$2b$10$nrTstIlDXQUkOftV7PQjue9TGyLhAEz7HHSNuxT9TeumNdJrWYOr2	wq@	f	t	user	0	2026-02-17 02:05:27.137775+05:30	2026-02-17 02:05:27.137775+05:30	2026-02-17 02:05:27.137775+05:30
47	SA@	\N	$2b$10$0m25.mxDEAf6m6OkGGcyHudeGrhWRzF0oF7rnlWoYJSVfOlBNDap2	SA@	f	t	user	0	2026-02-23 00:02:30.787391+05:30	2026-02-23 00:02:30.787391+05:30	2026-02-23 00:02:30.787391+05:30
48	LOP@	\N	$2b$10$HJFwEfs9l/grU.o0Y.78R.66IRgnsvwhYSHwOzR4V5bdnXbq1JjLC	LOP@	f	t	user	0	2026-02-23 00:03:42.790557+05:30	2026-02-23 00:03:42.790557+05:30	2026-02-23 00:03:42.790557+05:30
49	no@	\N	$2b$10$GtPJlyAzNe9oWS1olptoY.Fu/f4zx5./W5qzvJ5DGAEuLCOq.GhB.	no@	f	t	user	0	2026-02-23 00:51:50.959503+05:30	2026-02-23 00:51:50.959503+05:30	2026-02-23 00:51:50.959503+05:30
50	xam@	\N	$2b$10$a8I4/rovsaP74aPsXMp6jOAD9bZ6C16GlBEL7kYk49tFvR2T38B9C	xam@	f	t	user	0	2026-02-23 01:01:33.964861+05:30	2026-02-23 01:01:33.964861+05:30	2026-02-23 01:01:33.964861+05:30
51	lo@	\N	$2b$10$20L90Y3k4V/AOtWiMOvSB.NeKRLyZzOS2.PBEIJuFsEtFwYwdc2/S	lo@	f	t	user	0	2026-02-23 01:06:46.219863+05:30	2026-02-23 01:06:46.219863+05:30	2026-02-23 01:06:46.219863+05:30
24	cvxvxcv	\N	$2b$10$bFNh5ePFcOZfAUQHR9q17e8QGzZTiic5eJ5xv/lKhzyRg5eD90vQW	cvxvxcv	f	t	admin	0	2026-02-16 22:57:09.153969+05:30	2026-02-16 22:57:09.153969+05:30	2026-02-16 22:57:09.153969+05:30
46	u@	\N	$2b$10$YpXCPMH6T55UU5BhnMfe6eigkSMghmBpQDKNQCCf4h0AFfp1aLSCW	u@	f	t	user	0	2026-02-22 13:21:03.638522+05:30	2026-02-22 13:21:03.638522+05:30	2026-02-22 13:21:03.638522+05:30
52	yun@	\N	$2b$10$tN6YXPIcedu/ULp9XMXTVumd3JRmiEXEbdiIZAiy4gZo6uunnTyIK	yun@	f	t	user	0	2026-02-23 01:07:52.797809+05:30	2026-02-23 01:07:52.797809+05:30	2026-02-23 01:07:52.797809+05:30
53	sa@	\N	$2b$10$l98Uo5c80qJvviDlgw3ikO/SWyv.HwVmktKX5WxZEE5Z7yxtsYKNu	sa@	f	t	user	0	2026-02-23 01:08:37.711789+05:30	2026-02-23 01:08:37.711789+05:30	2026-02-23 01:08:37.711789+05:30
54	sdaa@	\N	$2b$10$XJJKIn1uMsg1dh3Ii1l6puwd2v96poHpTzn6WItvmy24ZkYqasCbC	sdaa@	f	t	user	0	2026-02-23 01:12:05.440084+05:30	2026-02-23 01:12:05.440084+05:30	2026-02-23 01:12:05.440084+05:30
55	ml@	\N	$2b$10$4YlDF9JpI8Tv8/PODCwVeu0rb.Bs37FvJYiKQbIKESQ5fevw5quZy	ml@	f	t	user	0	2026-02-23 01:14:07.939788+05:30	2026-02-23 01:14:07.939788+05:30	2026-02-23 01:14:07.939788+05:30
56	mas@	\N	$2b$10$d3fEtqO6SEfZOVU4y.IBq.76NQAqb0VO5zuI8xKP5D0lSGM1A3Ms.	mas@	f	t	user	0	2026-02-23 01:18:07.35674+05:30	2026-02-23 01:18:07.35674+05:30	2026-02-23 01:18:07.35674+05:30
57	\N	9	$2b$10$uj0dCwLPs.406C.gzyltoeqX.YOUfpu/HCqz4TmSGphb7cgCu5IUC	9	f	t	user	0	2026-02-23 01:18:32.987942+05:30	2026-02-23 01:18:32.987942+05:30	2026-02-23 01:18:32.987942+05:30
8	maiid@google.com	9327837212	$2b$10$Lr03evq3xGa0r2Z0kb7upOd49VjaZcPHnCZJ/rMzasUw6eQun1yDO	as	f	t		0	2026-02-15 23:41:51.271624+05:30	2026-02-15 23:41:51.271624+05:30	2026-02-15 23:41:51.271624+05:30
9	maidsjbdd@google.com	35123213	$2b$10$zlTsjmhKb28DxEeJl7eCN.shcfvA.TobcEFi7zHFZApgXL/BHJpjK	maidsjbdd@google.com	f	t	\N	0	2026-02-15 23:43:04.498581+05:30	2026-02-15 23:43:04.498581+05:30	2026-02-15 23:43:04.498581+05:30
26	djjhfb	\N	$2b$10$Q6ATqOVH5UVAVb4dtIkxnOh8ROhSL4wg2NLQLg4AGtSpnRZ8lZopS	djjhfb	f	t	user	0	2026-02-16 23:46:19.249472+05:30	2026-02-16 23:46:19.249472+05:30	2026-02-16 23:46:19.249472+05:30
29	sadas@	\N	$2b$10$jjomd8ZcI9fZ6TBUC4QYy.Qni5fo/4YalOzAGne8RwuWsCBxLbHBu	sadas@	f	t	creator	0	2026-02-17 01:25:10.356978+05:30	2026-02-17 01:25:10.356978+05:30	2026-02-17 01:25:10.356978+05:30
63	as@	\N	$2b$10$xmf0vrv8od4Qav0mqf9rOe7v7Tip0YIQSTXZpW9sSibu6RsGEl7ey	as@	f	t	user	0	2026-03-10 13:35:46.525399+05:30	2026-03-10 13:35:46.525399+05:30	2026-03-10 13:35:46.525399+05:30
64	vikrantdaksha05@gmail.com	\N	$2b$10$QW429.vWZiyP7nrp0i0JgO9xmmlzBOroygb9DAJNSI3k5tfcKB1Cm	vikrantdaksha05@gmail.com	f	t	user	0	2026-03-10 16:53:28.131944+05:30	2026-03-10 16:53:28.131944+05:30	2026-03-10 16:53:28.131944+05:30
45	vik@	1234567890	$2b$10$EtDoWipt0GRj/LT4OrHHXeQepg7UWdIrlRupp9DmuhQiasmTLXLWu	Vikrant	f	t	admin	0	2026-02-17 12:40:39.853001+05:30	2026-03-10 23:00:42.263159+05:30	2026-02-17 12:40:39.853001+05:30
65	l@	\N	$2b$10$9aEDui6xxviux9hvRv8W8e7Ai1JAEKymHOTNzzpAPOkyfI00HuA5S	l@	f	t	user	0	2026-03-11 01:06:09.847249+05:30	2026-03-11 01:06:09.847249+05:30	2026-03-11 01:06:09.847249+05:30
66	new@	\N	$2b$10$otwy/QW27Cam31uHoIHrZOj1TV4d1rBX//WdWgQ2x4F.MBFjm/hN6	new@	f	t	user	0	2026-04-11 15:36:01.738934+05:30	2026-04-11 15:36:01.738934+05:30	2026-04-11 15:36:01.738934+05:30
\.


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_id_seq', 8, true);


--
-- Name: cart_items_cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_cart_items_id_seq', 1397, true);


--
-- Name: carts_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_cart_id_seq', 42, true);


--
-- Name: colors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colors_id_seq', 11, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 4, true);


--
-- Name: coupon_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupon_products_id_seq', 1, false);


--
-- Name: coupon_redemptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupon_redemptions_id_seq', 9, true);


--
-- Name: discount_coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_coupons_id_seq', 9, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 236, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 97, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 34, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 51, true);


--
-- Name: shapes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shapes_id_seq', 8, true);


--
-- Name: sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sizes_id_seq', 9, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 99, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 66, true);


--
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_items_id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- Name: carts carts_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_unique UNIQUE (user_id);


--
-- Name: colors colors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: coupon_products coupon_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_products
    ADD CONSTRAINT coupon_products_pkey PRIMARY KEY (id);


--
-- Name: coupon_redemptions coupon_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_pkey PRIMARY KEY (id);


--
-- Name: discount_coupons discount_coupons_dicount_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_coupons
    ADD CONSTRAINT discount_coupons_dicount_code_key UNIQUE (discount_code);


--
-- Name: discount_coupons discount_coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_coupons
    ADD CONSTRAINT discount_coupons_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: products products_product_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_key UNIQUE (product);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: shapes shapes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shapes
    ADD CONSTRAINT shapes_pkey PRIMARY KEY (id);


--
-- Name: sizes sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_gateway_txn_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_gateway_txn_id_key UNIQUE (gateway_txn_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_no_key UNIQUE (phone_no);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_item_unique_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cart_item_unique_idx ON public.cart_items USING btree (cart_id, product_id, COALESCE(product_variant_id, '-1'::integer));


--
-- Name: address address_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;


--
-- Name: carts carts_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.discount_coupons(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments comments_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: coupon_products coupon_products_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_products
    ADD CONSTRAINT coupon_products_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.discount_coupons(id) ON DELETE CASCADE;


--
-- Name: coupon_products coupon_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_products
    ADD CONSTRAINT coupon_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: coupon_redemptions coupon_redemptions_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.discount_coupons(id) ON DELETE CASCADE;


--
-- Name: coupon_redemptions coupon_redemptions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: coupon_redemptions coupon_redemptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: discount_coupons discount_coupons_referal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_coupons
    ADD CONSTRAINT discount_coupons_referal_id_fkey FOREIGN KEY (referal_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart_items fk_cart_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart_id FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE SET NULL;


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL;


--
-- Name: orders orders_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_variants product_variants_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: product_variants product_variants_shape_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_shape_id_fkey FOREIGN KEY (shape_id) REFERENCES public.shapes(id);


--
-- Name: product_variants product_variants_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.sizes(id);


--
-- Name: transactions transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: TABLE address; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.address TO cbrush;


--
-- Name: SEQUENCE address_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.address_id_seq TO cbrush;


--
-- Name: TABLE cart_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cart_items TO cbrush;


--
-- Name: SEQUENCE cart_items_cart_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cart_items_cart_items_id_seq TO cbrush;


--
-- Name: TABLE carts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.carts TO cbrush;


--
-- Name: SEQUENCE carts_cart_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.carts_cart_id_seq TO cbrush;


--
-- Name: TABLE colors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.colors TO cbrush;


--
-- Name: SEQUENCE colors_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.colors_id_seq TO cbrush;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comments TO cbrush;


--
-- Name: SEQUENCE comments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.comments_id_seq TO cbrush;


--
-- Name: TABLE coupon_products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.coupon_products TO cbrush;


--
-- Name: SEQUENCE coupon_products_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.coupon_products_id_seq TO cbrush;


--
-- Name: TABLE coupon_redemptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.coupon_redemptions TO cbrush;


--
-- Name: SEQUENCE coupon_redemptions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.coupon_redemptions_id_seq TO cbrush;


--
-- Name: TABLE discount_coupons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.discount_coupons TO cbrush;


--
-- Name: SEQUENCE discount_coupons_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.discount_coupons_id_seq TO cbrush;


--
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_items TO cbrush;


--
-- Name: SEQUENCE order_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.order_items_id_seq TO cbrush;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO cbrush;


--
-- Name: SEQUENCE orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.orders_id_seq TO cbrush;


--
-- Name: TABLE product_variants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_variants TO cbrush;


--
-- Name: SEQUENCE product_variants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.product_variants_id_seq TO cbrush;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO cbrush;


--
-- Name: SEQUENCE products_product_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.products_product_id_seq TO cbrush;


--
-- Name: TABLE shapes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shapes TO cbrush;


--
-- Name: SEQUENCE shapes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.shapes_id_seq TO cbrush;


--
-- Name: TABLE sizes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sizes TO cbrush;


--
-- Name: SEQUENCE sizes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.sizes_id_seq TO cbrush;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO cbrush;


--
-- Name: SEQUENCE transactions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.transactions_id_seq TO cbrush;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO cbrush;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.users_id_seq TO cbrush;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO cbrush;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO cbrush;


--
-- PostgreSQL database dump complete
--

\unrestrict glO6P9z3MaznPRiTALaH8yr8V23KIFbVTB9JMXMX3fLtHjnpRGmQEKMZeXbYYVh

