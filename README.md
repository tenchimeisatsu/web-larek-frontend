# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/types/ - папка с типизацией кода

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с дополнительными типами
- src/types/models/AppState.ts — файл с интерфейсом состояния и событиями
- src/types/models/ShopApi.ts — файл с моделью данных и интерфейсом API
- src/types/controllers/Controller.ts — файл с интерфейсом контроллера
- src/types/views/View.ts — файл с интерфейсами представлений
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

---

В проекте реализуется **MVP** (Model-View-Presenter) – это архитектурный паттерн, используемый для разделения логики представления, обработки данных и бизнес-логики в приложении. Он является эволюцией паттерна MVC (Model-View-Controller) и обеспечивает более четкое разделение ответственности между компонентами.
Связь между моделью и представлением обеспечивается брокером событий, частично реализующий паттерн проектирования Наблюдатель (Observer).

### Модель

---

#### Класс `AppState`:

обрабатывает текущее состояние приложения, реализует Интерфейс `IAppState`.
В конструктор класс принимает объект типа `IEvents` для отправки изменений в брокер событий.

##### Поля

Все поля в этом классе приватные для ограничения доступа к внутреннему состоянию модели.

- `private _broker: IEvents` — брокер событий
- `private _productList: IProduct[]` — список товаров, пришедший из API
- `private _selectedProduct?: IProduct` — карточка товара, выбранная пользователем
- `private _basket: IBasket` — корзина товаров
- `private _contacts: IContacts` — контакты пользователя
- `private _details: IDetails` — детали заказа
- `private _openedModal: AppStateModal` — открытое модальное окно
- `private _contactsError?: string` — текст ошибки ввода контактных данных
- `private _detailsError?: string` — текст ошибки ввода деталей заказа
- `private _orderResponse?: IOrderResponse` — ответ сервера о заказе

##### Методы

Методы, начинающиеся с update помимо обновления поля отправляют событие о том, что поле было изменено. Список событий указан ниже.

- `updateProductList(productList: IProduct[]): void`
- `updateSelectedProduct(selectedProduct: IProduct): void`
- `updateBasket(basket: IBasket): void`
- `updateContacts(contacts: IContacts): void`
- `updateDetails(details: IDetails): void`
- `updateOpenedModal(modal: AppStateModal): void`
- `updateContactsError(contactError: string): void`
- `updateDetailsError(detailsError: string): void`
- `updateOrderResponse(orderResponse: IOrderResponse): void`
- `getBasketCounter(): number` — возвращает количество товаров в корзине
- `getOrder(): IOrder` — возвращает данные о заказе
- `getProductList(): IProduct[]` — возвращает загруженный список товаров
- `getBasket(): IBasket` — возвращает корзину
- `get inBasket(): boolean` — геттер, проверяющий находится ли `_selectedProduct` в корзине
- `private _validateDetails(details: IDetails): string` — вспомогательный метод, проверяющий детали информации о заказе. Возвращает текст ошибки или пустую строку
- `private _validateContacts(contacts: IContacts): string` — вспомогательный метод, проверяющий контактную информацию о заказе. Возвращает текст ошибки или пустую строку

### Презентер

---

События отправляются в представлениях и модели. Все слушатели этих событий находятся в **index.ts**.

#### Класс `Controller`:

используется для обработки данных приходящих из представления и взаимодействия с моделью. Конструктор принимает в себя объект типа `IAppState` и объект типа `IShopAPI`. Также конструктор вызывает `loadProductList()` для создания первичного состояния приложения (списка товаров).

##### Поля

- `private _state: IAppState` — состояние приложения
- `private _api: IShopAPI` — объект для взаимодействия с API

##### Методы

- `loadProductList(): Promise<void>` — загружает список товаров и обновляет модель
- `createOrderResponse(): Promise<IOrderResponse>` — создает заказ через API
- `createOrder(): Promise<void>` — устанавливает в модели успешный ответ от сервера
- `selectProduct(id: string): void` — устанавливает в модели выбранную карточку
- `addProduct(id: string): void` — добавляет товар в корзину модели
- `removeProduct(id: string): void` — удаляет товар из корзины модели
- `fillContacts(contacts: Partial<IContacts>): void` — заполняет контакты в модели данными из представления
- `fillDetails(details: Partial<IDetails>): void` — заполняет детали заказа в модели данными из представления
- `clearOrder(): void` — очищает всю информацию о заказе в модели
- `setModal(modal: AppStateModal): void` — устанавливает активное модельное окно в модели
- `private _findProduct(id: string): IProduct | null` — метод реализации для поиска конкретного товара в массиве товаров

### API

---

#### Класс `ShopAPI`:

используется для взаимодействия с API сервера. Расширяет класс `Api` и реализует интерфейс `IShopAPI`. Конструктор, как и у родителя, принимает два аргумента: `baseUrl: string` и `options: RequestInit`.

##### Поля

- `readonly baseUrl: string` — базовый URL сервера
- `protected options: RequestInit` — набор опций, использующийся для конфигурирования fetch-запроса

##### Методы

- `getProductList(): Promise<IProduct[]>` — получает список товаров из API
- `getProduct(id: string): Promise<IProduct>` — получает данные о товаре из API по id
- `createOrder(order: IOrder): Promise<IOrderResponse>` — отправляет данные о заказе на сервер

### Представление

---

#### Класс `View<T>`:

абстрактный класс реализующий интерфейс `IView<T>`. В конструкторе принимает объект типа `IEvents`, `HTMLElement` и опционально функцию-хэндлер. Это общий класс от которого наследуются все представления.

##### Поля

- `element: HTMLElement` — элемент, которым манипулирует представление
- `protected broker: IEvents` — брокер событий
- `protected onClick?: (data?: any) => void` — опциональный хэндлер для обработки событий нажатия

##### Методы

- `abstract render(data?: Partial<T>): HTMLElement` — отображает данные в элементе

#### Класс `ModalView<T>`:

абстрактный класс наследующий `View<T>` и реализующий интерфейс `IModalView`. Конструктор и поля аналогичны родительскому `View<T>`, а также шаблон, на основе которого строится модальные окна . Общий класс, от которого наследуются все модальные окна.

##### Поля

- `template: HTMLElement` — шаблон модального окна

##### Методы

- `abstract nextModal(): void` — переключает на следующее модальное окно
- `closeModal(): void` — закрывает модальное окно
- `openModal(): void` — открывает модальное окно
- `private _applyTemplate(): void` — применяет шаблон модального окна

#### Класс `ProductListView`:

класс, наследующий `View<never>`. Конструктору не требуется хэндлер, остальное аналогично родительскому `items: HTMLElement[]`. Класс отвечает за отображение списка товаров.

##### Поля

- `items: HTMLElement[]` — список отрисованных представлений информации о товаре

#### Класс `ProductView`:

класс, наследующий `View<IProduct>`. Конструктору требуется хэндлер. Класс отвечает за отображение карточки товара.

##### Поля

- `private _isCompact: boolean` — флаг переключающее компактное и полное отображение карточки товара
- `private _cardTitle: HTMLElement` — название товара
- `private _cardPrice: HTMLElement` — цена товара
- `private _itemIndex?: HTMLElement` — номер товара в корзине
- `private _deleteButton?: HTMLButtonElement` — кнопка удаления товара из корзины
- `private _cardCategory?: HTMLElement` — категория товара
- `private _cardImage?: HTMLImageElement` — изображение товара
- `private _productId: string` — идентификатор товара

#### Класс `BasketCounterView`:

класс, наследующий `View<{ counter: number }>`. Конструктору нужен хэндлер. Отвечает за отображение счетчика товаров в корзине.

##### Поля

- `private _basketCounter: HTMLElement` — счетчик корзины

#### Класс `ProductModalView`:

класс, наследующий `ModalView<IProduct>`. Конструктору нужен хэндлер. Отвечает за отображение модального окна карточки товара.

##### Поля

- `private _cardImage: HTMLImageElement` — изображение товара
- `private _cardCategory: HTMLElement` — категория товара
- `private _cardTitle: HTMLElement` — название товара
- `private _cardText: HTMLElement` — описание товара
- `private _cardPrice: HTMLElement` — цена товара
- `private _button: HTMLButtonElement` — основная кнопка модального окна
- `private _productId: string` — идентификатор товара
- `private _buyHandler: () => void` — обработчик для добавления товара в корзину
- `private _nextHandler: () => void` — обработчик для перехода в корзину

##### Методы

- `inBasket(inBasket: boolean)` — метод переключающий кнопку

#### Класс `BasketModalView`:

класс, наследующий `ModalView<IBasket>`. Конструктору не нужен хэндлер. Отвечает за отображение модального окна корзины.

##### Поля

- `private _list: HTMLElement` — список товарок в корзине
- `private _basketButton: HTMLButtonElement` — основная кнопка
- `private _basketPrice: HTMLElement` — общая цена товаров к корзине
- `items?: HTMLElement[]` — отрисованные карточки товаров в корзине

#### Класс `PageView`:

класс, наследующий `View<never>`. Конструктор родительский без хэндлера. Включает или выключает прокрутку страницы в зависимости от активности модального окна.

##### Методы

- `set lock(active: boolean)` — сеттер включающий и отключающий прокрутку

#### Класс `DetailsFormModalView`:

класс, наследующий `ModalView<{ detailsError: string }>`. Конструктору не требуется хэндлер. Отвечает за отображение модального окна деталей о заказе.

##### Поля

- `private _altButtons: HTMLButtonElement[]` — кнопки для выбора способа оплаты
- `private _input: HTMLInputElement` — поле ввода
- `private _orderButton: HTMLButtonElement` — основная кнопка
- `private _formErrors: HTMLElement` — текст ошибки

##### Методы

- `private _altButtonHandler(buttons: HTMLButtonElement[], toggleElement: number): void` — реализует механизм выбора одну из двух кнопок
- `private _changeFormHandler(): void` — обработчик события изменения формы

#### Класс `ContactsFormModalView`:

класс, наследующий `ModalView<{contactsError: string;}>`. Конструктору не требуется хэндлер. Отвечает за отображение модального окна с контактной информацией.

##### Поля

- `private _inputs: HTMLInputElement[]` — поля ввода формы
- `private _button: HTMLButtonElement` — основная кнопка
- `private _formErrors: HTMLElement` — текст ошибки

##### Методы

- `private _changeFormHandler(): void` — обработчик события изменения формы

#### Класс `SuccessModalView`:

класс, наследующий `ModalView<IOrderResponse>`. Конструктору не требуется хэндлер. Отвечает за отображение модального окна подтверждения успешного оформления заказа.

##### Поля

- `private _successParagraph: HTMLElement` — текст сообщения об успешном заказе
- `private _button: HTMLButtonElement` — основная кнопка

### Брокер событий

---

#### Класс `EventEmitter`

Класс, являющийся реализацией брокера событий. Позволяет отправлять события и реагировать на них. Класс документирован в файле `src/components/base/events.ts`.

## События

---

- closeModal — закрытие модального окна
- openCard — открытие модального окна карточки товара
- openBasket — открытие модального окна корзины
- nextModal — вызова следующего модального окна
- updateBasket — обновление корзины
- contactsError — ошибка заполнения контактной информации
- detailsError — ошибка заполнения данных о заказе
- getProductList — получение списка товаров
- successOrder — успешное создание заказа
- createOrder — создание заказа
- changeDetailsForm — изменение формы деталей о заказе
- changeContactsForm — изменение формы контактной информации

## Интерфейсы

---

#### Интерфейс `IProduct`

Описывает ответ сервера, содержащий данные о товаре:

- `id` — уникальный идентификатор товара
- `description` — описание товара
- `image` — путь до изображения товара
- `title` — название товара
- `category` — название категории товара
- `price` — цена товара

#### Интерфейс `IBasket`

Описывает содержание корзины:

- `items` — товары, добавленные в корзину
- `total` — стоимость всех товаров, добавленных в корзину

#### Интерфейс `IDetails`

Описывает информацию о заказе:

- `payment` — способ оплаты
- `address` — адрес доставки

#### Интерфейс `IContacts`

Описывает информацию контакты пользователя:

- `email` — электронная почта
- `phone` — номер телефона

#### Интерфейс `IOrder`

Собирает информацию из `IBasket`, `IDetails` и `IContacts` для отправки запроса серверу:

#### Интерфейс `IOrderResponse`

Описывает ответ сервера с данными о заказе:

- `id` — уникальный идентификатор заказа
- `total` — стоимость заказа

#### Интерфейс `IProductListResponse`

Описывает ответ сервера с данными о списке товаров:

- `total` — общее количество товаров
- `items` — список товаров

#### Интерфейс `IShopAPI`

Описывает взаимодействие с API:

- `getProductList(): Promise<IProductListResponse>` — получение списка продуктов
- `getProduct(id: string): Promise<IProduct>` — получение продукта по идентификатору
- `createOrder(order: Order): Promise<IOrderResponse>` — отправка заказа на сервер
