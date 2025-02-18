import {
	AppStateModal,
	EventType,
	IAppState,
} from '../../types/models/AppState';
import {
	IProduct,
	IBasket,
	IContacts,
	IDetails,
	IOrder,
	IOrderResponse,
} from '../../types/models/ShopApi';
import { IEvents } from '../base/events';

export class AppState implements IAppState {
	private _broker: IEvents;
	private _productList: IProduct[];
	private _selectedProduct?: IProduct;
	private _basket: IBasket;
	private _contacts: IContacts;
	private _details: IDetails;
	private _openedModal: AppStateModal;
	private _contactsError?: string;
	private _detailsError?: string;
	private _orderResponse?: IOrderResponse;

	constructor(broker: IEvents) {
		this._broker = broker;
		this._productList = [];
		this._selectedProduct = undefined;
		this._basket = {
			items: [],
			total: null,
		};
		this._contacts = {
			email: '',
			phone: '',
		};
		this._details = {
			payment: undefined,
			address: '',
		};
		this._openedModal = AppStateModal.none;
		this._contactsError = undefined;
		this._detailsError = undefined;
	}

	updateProductList(productList: IProduct[]): void {
		this._productList = productList;
		this._broker.emit(EventType.getProductList, this._productList);
	}

	updateSelectedProduct(selectedProduct: IProduct): void {
		this._selectedProduct = selectedProduct;
		this._broker.emit(EventType.openCard, {
			product: this._selectedProduct,
			inBasket: this.inBasket,
		});
	}

	updateBasket(basket: IBasket): void {
		this._basket = basket;
		this._broker.emit(EventType.updateBasket, {
			basket: this._basket,
			counter: this.getBasketCounter(),
			inBasket: this.inBasket,
		});
	}

	updateContacts(contacts: IContacts): void {
		this._contacts = contacts;
		this.updateContactsError(this._validateContacts(contacts));
	}

	updateDetails(details: IDetails): void {
		this._details = details;
		this.updateDetailsError(this._validateDetails(details));
	}

	updateOpenedModal(modal: AppStateModal): void {
		this._openedModal = modal;
		const event =
			modal === AppStateModal.basket
				? EventType.openBasket
				: modal === AppStateModal.none
				? EventType.closeModal
				: EventType.nextModal;
		this._broker.emit(event, { modal: this._openedModal });
	}

	updateContactsError(contactsError: string): void {
		this._contactsError = contactsError ? contactsError : undefined;
		this._broker.emit(EventType.contactsError, {
			contactsError: this._contactsError,
		});
	}

	updateDetailsError(detailsError: string): void {
		this._detailsError = detailsError ? detailsError : undefined;
		this._broker.emit(EventType.detailsError, {
			detailsError: this._detailsError,
		});
	}

	updateOrderResponse(orderResponse: IOrderResponse): void {
		this._orderResponse = orderResponse;
		this._broker.emit(EventType.successOrder, this._orderResponse);
	}

	getBasketCounter(): number {
		return this._basket.items.length;
	}

	getOrder(): IOrder {
		return {
			...this._basket,
			...this._details,
			...this._contacts,
		};
	}

	getProductList(): IProduct[] {
		return this._productList;
	}

	getBasket(): IBasket {
		return this._basket;
	}

	get inBasket(): boolean {
		return (
			this.getBasket().items.findIndex(
				(item) => item.id === this._selectedProduct.id
			) > -1
		);
	}

	private _validateDetails(details: IDetails): string {
		const prefix = details.payment && details.address ? '' : 'Не указан ';
		const paymentError = details.payment ? '' : 'способ оплаты';
		const addressError = details.address ? '' : 'адрес доставки';
		return prefix.concat(
			[addressError, paymentError].filter(Boolean).join(' и ')
		);
	}

	private _validateContacts(contacts: IContacts): string {
		const prefix = contacts.email && contacts.phone ? '' : 'Не указан ';
		const emailError = contacts.email ? '' : 'email';
		const phoneError = contacts.phone ? '' : 'телефон';
		return prefix.concat([emailError, phoneError].filter(Boolean).join(' и '));
	}
}
