import { html, LitElement, property } from '@polymer/lit-element';

class TSElement2 extends LitElement implements TSElementProps {
  @property() message = 'Hi';

  @property({ attribute: 'more-info', type: (value: string) => `[${value}]` })
  extra = '';

  render() {
    const { message, extra } = this;
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      TSElement says: ${message} ${extra}
    `;
  }
}

customElements.define('ts-element2', TSElement2);

interface TSElementProps {
  message?: string;
  extra?: string;
}

interface TSElementAttributes<T> extends React.HTMLAttributes<T> {
  'more-info'?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ts-element2': React.DetailedHTMLProps<
        TSElementAttributes<TSElement2>,
        TSElement2
      >;
    }
  }
}
