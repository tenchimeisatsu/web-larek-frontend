import { AppStateModal } from '../models/AppState';
import { IContacts, IDetails, IOrderResponse } from '../models/ShopApi';

export interface IController {
	loadProductList(): Promise<void>;
	createOrder(): Promise<IOrderResponse>;

	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
	fillContacts(contacts: Partial<IContacts>): void;
	fillDetails(details: Partial<IDetails>): void;
	clearBasket(): void;
	validateContacts(contacts: Partial<IContacts>): void;
	validateDetails(details: Partial<IDetails>): void;

	setModal(modal: AppStateModal): void;
}
