export default class NotificationMessage {
  message;
  static _lastShownElement;

  constructor(message = '', props = {}) {
    const {
      duration = 1000,
      type = 'success'
    } = props;

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = this._createElement();
  }

  _createElement() {
    const element = document.createElement('div');

    element.innerHTML = `
        <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
                ${this.message}
            </div>
            </div>
        </div>
      `;

    return element.firstElementChild;
  }

  show(target = document.body) {
    target.append(this.element);
    
    if (NotificationMessage._lastShownElement) {
      NotificationMessage._lastShownElement.destroy();
    }

    NotificationMessage._lastShownElement = this;

    this.timerId = setTimeout(() => this.destroy(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timerId);
    this.remove();
  }
}
