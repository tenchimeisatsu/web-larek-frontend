export interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price?: number;
}

export interface Basket {
	items: Product[];
	total: number;
}

export interface Details {
	payment: string;
	address: string;
}

export interface Contacts {
	email: string;
	phone: string;
}

export interface Order extends Basket, Contacts, Details {}

export interface OrderResponse {
	id: string;
	total: number;
}

export interface IShopAPI {
	getProductList(): Promise<Product[]>;
	getProduct(id: string): Promise<Product>;
	createOrder(order: Order): Promise<OrderResponse>;
}
