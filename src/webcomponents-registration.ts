declare namespace WebComponents {
  function waitFor<T>(callback: () => Promise<T>): void;
}

WebComponents.waitFor(() => {
  return Promise.all([import('./ts-element'), import('./ts-element2')]);
});

export default {};
