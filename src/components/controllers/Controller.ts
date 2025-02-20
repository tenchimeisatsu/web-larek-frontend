import { IController } from '../../types/controllers/Controller';
import { AppStateModal, IAppState } from '../../types/models/AppState';
import {
	IBasket,
	IContacts,
	IDetails,
	IOrderResponse,
	IProduct,
	IShopAPI,
} from '../../types/models/ShopApi';

export class Controller implements IController {
	private _state: IAppState;
	private _api: IShopAPI;

	constructor(state: IAppState, api: IShopAPI) {
		this._state = state;
		this._api = api;
		this.loadProductList();
	}

	async loadProductList(): Promise<void> {
		const productList = this._api.getProductList();
		this._state.updateProductList((await productList).items);
	}

	async createOrderResponse(): Promise<IOrderResponse> {
		const order = this._state.getOrder();
		const orderResponse = await this._api.createOrder(order);
		return orderResponse;
	}

	async createOrder(orderResponse: IOrderResponse): Promise<void> {
		this._state.updateOrderResponse(orderResponse);
	}

	selectProduct(id: string): void {
		const product = this._findProduct(id);
		this._state.updateSelectedProduct(product);
		this._state.updateOpenedModal(AppStateModal.card);
	}

	addProduct(id: string): void {
		const product = this._findProduct(id);
		const basket = this._state.getBasket();
		const newBasket: IBasket = {
			items: [...basket.items, product],
			total: basket.total + product.price,
		};
		this._state.updateBasket(newBasket);
	}

	removeProduct(id: string): void {
		const basket = this._state.getBasket();
		const newBasket: IBasket = {
			items: basket.items.filter((p) => p.id !== id),
			total: basket.total - basket.items.find((p) => p.id === id).price,
		};
		this._state.updateBasket(newBasket);
	}

	fillContacts(contacts: Partial<IContacts>): void {
		this._state.updateContacts(contacts as IContacts);
	}

	fillDetails(details: Partial<IDetails>): void {
		this._state.updateDetails(details as IDetails);
	}

	clearOrder(): void {
		this._state.updateBasket({
			items: [],
			total: null,
		});
		this._state.updateOrderResponse(undefined);
	}

	setModal(modal: AppStateModal): void {
		this._state.updateOpenedModal(modal);
	}

	private _findProduct(id: string): IProduct | null {
		const productList = this._state.getProductList();
		return productList.find((p) => p.id === id);
	}
}
