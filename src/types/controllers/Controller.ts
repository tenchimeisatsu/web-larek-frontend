import { AppStateModal } from '../models/AppState';
import { IContacts, IDetails } from '../models/ShopApi';

export interface IController {
	loadProductList(): Promise<void>;
	createOrder(): Promise<void>;

	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
	fillContacts(contacts: Partial<IContacts>): void;
	fillDetails(details: Partial<IDetails>): void;
	clearBasket(): void;
	setModal(modal: AppStateModal): void;
}
