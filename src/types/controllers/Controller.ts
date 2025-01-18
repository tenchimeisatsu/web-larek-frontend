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
	validateContacts(contacts: Partial<IContacts>): boolean;
	validateDetails(details: Partial<IDetails>): boolean;

	setModal(modal: AppStateModal): void;
}
