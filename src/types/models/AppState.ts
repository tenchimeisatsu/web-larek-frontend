import { Basket, Contacts, Details, OrderResponse, Product } from './ShopApi';

export enum AppStateModals {
	card = 'modal:card',
	basket = 'modal:basket',
	details = 'modal:details',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}

export enum EventType {
	closeModal = 'event:close',
	openCard = 'event:openCard',
	openBasket = 'event:openBasket',
	nextModal = 'event:nextModal',
	addToBasket = 'event:addToBasket',
	removeFromBasket = 'event:removeFromBasket'
}

export interface AppState {
	productList: Product[];
	selectedProduct?: Product;
	basket?: Basket;
	basketCounter: number;
	contacts: Contacts;
	details: Details;

	openedModal: AppStateModals;

	loadProductList(): Promise<void>;
	createOrder(): Promise<OrderResponse>;

	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
	fillContacts(contacts: Partial<Contacts>): void;
	fillDetails(details: Partial<Details>): void;

	openModal(modal: AppStateModals): void;
}
