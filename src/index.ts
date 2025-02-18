import { ShopAPI } from './components/api/ShopApi';
import { EventEmitter } from './components/base/events';
import { Controller } from './components/controllers/Controller';
import { AppState } from './components/models/AppState';
import { BasketCounterView } from './components/views/BasketCounterView';
import { BasketModalView } from './components/views/BasketModalView';
import { ContactsFormModalView } from './components/views/ContactsFormModalView';
import { DetailsFormModalView } from './components/views/DetailsFormModalView';
import { ProductListView } from './components/views/ProductListView';
import { ProductModalView } from './components/views/ProductModalView';
import { ProductView } from './components/views/ProductView';
import { SuccessModalView } from './components/views/SuccessModalView';
import './scss/styles.scss';
import { AppStateModal, EventType } from './types/models/AppState';
import {
	IBasket,
	IContacts,
	IDetails,
	IOrderResponse,
	IProduct,
} from './types/models/ShopApi';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const broker = new EventEmitter();
const state = new AppState(broker);
const api = new ShopAPI(API_URL);
const controller = new Controller(state, api);
const gallery = document.querySelector('.gallery') as HTMLElement;
const listView = new ProductListView(broker, gallery);
const modal = document.querySelector('#modal-container') as HTMLElement;
const pageWrapper = document.querySelector('.page__wrapper') as HTMLElement;
const counterButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;

function cardHandler(id: string) {
	controller.selectProduct(id);
}

broker.on(EventType.getProductList, (list: IProduct[]) => {
	listView.items = list.map((product) => {
		const cardView = new ProductView(
			broker,
			cloneTemplate('#card-catalog'),
			false,
			cardHandler
		);
		return cardView.render(product);
	});
	listView.render();
});

broker.on(EventType.openModal, () =>
	pageWrapper.classList.add('page__wrapper_locked')
);
broker.on(EventType.closeModal, () =>
	pageWrapper.classList.remove('page__wrapper_locked')
);

const cardView = new ProductModalView(
	broker,
	modal,
	cloneTemplate('#card-preview'),
	controller.addProduct.bind(controller)
);

broker.on(
	EventType.openCard,
	(product: { product: IProduct; inBasket: boolean }) => {
		cardView.render(product.product);
		cardView.inBasket(product.inBasket);
		cardView.openModal();
	}
);

broker.on(EventType.updateBasket, (data: { inBasket: boolean }) =>
	cardView.inBasket(data.inBasket)
);

const basketCounter = new BasketCounterView(broker, counterButton, () =>
	controller.setModal(AppStateModal.basket)
);

broker.on(EventType.updateBasket, (data: { counter: number }) =>
	basketCounter.render(data)
);

const basketView = new BasketModalView(broker, modal, cloneTemplate('#basket'));

function deleteHandler(id: string) {
	controller.removeProduct(id);
}

broker.on(EventType.updateBasket, (data: { basket: IBasket }) => {
	basketView.items = data.basket.items.map((product, i) => {
		const cardView = new ProductView(
			broker,
			cloneTemplate('#card-basket'),
			true,
			deleteHandler
		);
		return cardView.render({ ...product, index: i + 1 });
	});
	basketView.render(data.basket);
});

broker.on(EventType.openBasket, () => basketView.openModal());

const detailsView = new DetailsFormModalView(
	broker,
	modal,
	cloneTemplate('#order')
);

const contactsView = new ContactsFormModalView(
	broker,
	modal,
	cloneTemplate('#contacts')
);

const successView = new SuccessModalView(
	broker,
	modal,
	cloneTemplate('#success')
);

broker.on(EventType.nextModal, (data: { modal: AppStateModal }) => {
	switch (data.modal) {
		case AppStateModal.details:
			detailsView.openModal();
			break;
		case AppStateModal.contacts:
			contactsView.openModal();
			break;
		case AppStateModal.success:
			successView.openModal();
			break;
	}
});

broker.on(EventType.changeDetailsForm, (data: IDetails) =>
	controller.fillDetails(data)
);

broker.on(EventType.detailsError, (error: { detailsError: string }) =>
	detailsView.render(error)
);

broker.on(EventType.changeContactsForm, (data: IContacts) =>
	controller.fillContacts(data)
);

broker.on(EventType.contactsError, (error: { contactsError: string }) =>
	contactsView.render(error)
);

broker.on(EventType.createOrder, () => controller.createOrder());

broker.on(EventType.successOrder, (data: IOrderResponse) => {
	successView.render(data);
	controller.clearBasket();
});
