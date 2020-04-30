export const dispatch = <TEventArgs>(eventType: string, args: TEventArgs) => {
    if (!window) return;
    window.dispatchEvent(new CustomEvent(eventType, {detail: args}));
};

export const subscribe = <TEventArgs>(eventType: string, listener: (event: CustomEvent<TEventArgs>) => void) => {
    if (!window) return;
    window.addEventListener(eventType, listener as EventListenerOrEventListenerObject);
};

export const unsubscribe = <TEventArgs>(eventType: string, listener: (event: CustomEvent<TEventArgs>) => void) => {
    if (!window) return;
    window.removeEventListener(eventType, listener as EventListenerOrEventListenerObject);
};
