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
import { SuccessModalView } from './components/views/SuccessModalView';
import './scss/styles.scss';
import { AppStateModal, EventType } from './types/models/AppState';
import { API_URL } from './utils/constants';

const broker = new EventEmitter();
const api = new ShopAPI(API_URL);
const state = new AppState(broker);
const controller = new Controller(state, api);

const mainProductList = new ProductListView(broker, controller, false);
const basketCounter = new BasketCounterView(broker, controller);
const productView = new ProductModalView(broker, controller);
const basketView = new BasketModalView(broker, controller);
const detailsView = new DetailsFormModalView(broker, controller);
const contactsView = new ContactsFormModalView(broker, controller);
const successView = new SuccessModalView(broker, controller);

function nextModalSwitcher(modal: AppStateModal) {
	const detailsModal = document.getElementById('detailsModal');
	const contactsModal = document.getElementById('contactsModal');
	const successModal = document.getElementById('successModal');
	if (modal === AppStateModal.details) {
		detailsModal.classList.add('modal_active');
	} else if (modal === AppStateModal.contacts) {
		contactsModal.classList.add('modal_active');
	} else if (modal === AppStateModal.success) {
		successModal.classList.add('modal_active');
	}
}

broker.on(EventType.nextModal, (data: { modal: AppStateModal }) =>
	nextModalSwitcher(data.modal)
);
