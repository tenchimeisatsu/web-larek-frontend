import { ShopAPI } from './components/api/ShopApi';
import { EventEmitter } from './components/base/events';
import { Controller } from './components/controllers/Controller';
import { AppState } from './components/models/AppState';
import './scss/styles.scss';
import { EventType } from './types/models/AppState';
import { API_URL } from './utils/constants';

const broker = new EventEmitter();
const api = new ShopAPI(API_URL);
const state = new AppState(broker);
const controller = new Controller(state, api);
