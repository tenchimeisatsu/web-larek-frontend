import { IBasket, IContacts, IDetails, IOrder, IProduct } from './ShopApi';

export enum AppStateModal {
	card = 'modal:card',
	basket = 'modal:basket',
	details = 'modal:details',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}

export enum EventType {
	closeModal = 'event:closeModal',
	openCard = 'event:openCard',
	openBasket = 'event:openBasket',
	nextModal = 'event:nextModal',
	updateBasket = 'event:updateBasket',
	contactsError = 'event:contactError',
	detailsError = 'event:detailsError',
}

export interface IAppState {
	updateProductList(productList: IProduct[]): void;
	updateSelectedProduct(selectedProduct: IProduct): void;
	updateBasket(basket: IBasket): void;
	updateContacts(contacts: IContacts): void;
	updateDetails(details: IDetails): void;
	updateOpenedModal(modal: AppStateModal): void;
	updateContactsError(contactError: string): void;
	updateDetailsError(detailsError: string): void;
	getBasketCounter(): number;
	getOrder(): IOrder;
}
