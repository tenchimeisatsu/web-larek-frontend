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
		// TODO: проверить реализацию
	}

	updateProductList(productList: IProduct[]): void {
		this._productList = productList;
		this._broker.emit(EventType.getProductList, this._productList);
	}

	updateSelectedProduct(selectedProduct: IProduct): void {
		this._selectedProduct = selectedProduct;
		this._broker.emit(EventType.openCard, this._selectedProduct);
	}

	updateBasket(basket: IBasket): void {
		this._basket = basket;
		this._broker.emit(EventType.updateBasket, {
			basket: this._basket,
			counter: this.getBasketCounter(),
		});
	}

	updateContacts(contacts: IContacts): void {
		this._contacts = contacts;
		this._broker.emit(EventType.nextModal, this._contacts);
	}

	updateDetails(details: IDetails): void {
		this._details = details;
		this._broker.emit(EventType.nextModal, this._details);
	}

	updateOpenedModal(modal: AppStateModal): void {
		this._openedModal = modal;
		const event =
			modal === AppStateModal.card
				? EventType.openCard
				: modal === AppStateModal.basket
				? EventType.openBasket
				: 'Error';
		this._broker.emit(event, { modal: this._openedModal });
	}

	updateContactsError(contactError: string): void {
		this._contactsError = contactError;
		this._broker.emit(EventType.contactsError, {
			contactError: this._contactsError,
		});
	}

	updateDetailsError(detailsError: string): void {
		this._detailsError = detailsError;
		this._broker.emit(EventType.detailsError, {
			detailsError: this._detailsError,
		});
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

	getState(): IAppState {
		return this;
	}
}
