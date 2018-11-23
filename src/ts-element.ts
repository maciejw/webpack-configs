import { html, LitElement, property } from '@polymer/lit-element';

class TSElement extends LitElement implements TSElementProps {
  @property()
  message: string;

  @property({ attribute: 'more-info', type: (value: string) => `[${value}]` })
  extra: string;

  constructor({ message = 'Hi', extra = '' }: TSElementProps = {}) {
    super();
    this.message = message;
    this.extra = extra;
  }
  render() {
    const { message, extra } = this;
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      TSElement says: ${message} ${extra} !!!
    `;
  }
}

customElements.define('ts-element', TSElement);

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
      'ts-element': React.DetailedHTMLProps<
        TSElementAttributes<TSElement>,
        TSElement
      >;
    }
  }
}
