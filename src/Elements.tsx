import React from 'react';
export class Elements extends React.Component<
  {},
  {
    counter: number;
  }
> {
  readonly state = { counter: 0 };
  handle: null | number = null;
  componentDidMount() {
    this.handle = window.setInterval(
      () => this.setState(state => ({ counter: state.counter + 1 })),
      1000,
    );
  }
  componentWillUnmount() {
    if (this.handle) {
      window.clearInterval(this.handle);
    }
  }
  render() {
    return (
      <>
        <ts-element
          ref={e => {
            if (e) {
              e.message = 'message1';
              e.extra = 'extra1 ' + this.state.counter;
            }
          }}
        />
        <ts-element2
          more-info="extra2a"
          ref={e => {
            if (e) {
              e.message = 'message2';
              e.extra = 'extra2 ' + this.state.counter;
            }
          }}
        />
      </>
    );
  }
}
