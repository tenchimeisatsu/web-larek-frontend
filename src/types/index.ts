export interface IView<T> {
    element: HTMLElement;
    render(data?: Partial<T>): HTMLElement;
}
