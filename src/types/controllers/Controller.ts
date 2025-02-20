import { AppStateModal } from '../models/AppState';
import { IContacts, IDetails, IOrderResponse } from '../models/ShopApi';

export interface IController {
	loadProductList(): Promise<void>;
	createOrderResponse(): Promise<IOrderResponse>;
	createOrder(orderResponse: IOrderResponse): Promise<void>;

	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
	fillContacts(contacts: Partial<IContacts>): void;
	fillDetails(details: Partial<IDetails>): void;
	clearOrder(): void;
	setModal(modal: AppStateModal): void;
}
