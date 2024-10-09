class Tooltip {
  static _instance;

  constructor() {
    if (Tooltip._instance) {
      return Tooltip._instance;
    }

    Tooltip._instance = this;
    this.initialize();
  }

  initialize () {
    this.element = this._createElement();
    this._createDocumentListeners();
  }

  _createDocumentListeners() {
    document.addEventListener('pointerover', this._handlePointerOver);
  }

  _destroyDocumentListeners() {
    document.removeEventListener('pointerover', this._handlePointerOver);
  }

  _createTargetListeners() {
    this.target.addEventListener('pointerout', this._handlePointerOut);
  }

  _destroyTargetListeners() {
    this.target.removeEventListener('pointerout', this._handlePointerOut);
  }

  _handlePointerOver = (e) => {
    const tooltip = e.target.dataset.tooltip;

    if (!tooltip) {
      return;
    }
  
    this.target = e.target;
    this._createTargetListeners();
    
    this.render(tooltip, e.clientX, e.clientY);
  }

  _handlePointerOut = () => {
    this._destroyTargetListeners(this.target);
    this.remove();
  }

  _createElement() {
    const tooltipElement = document.createElement('div');
    tooltipElement.innerHTML = `<div class="tooltip"></div>`;

    return tooltipElement.firstElementChild;
  }

  render(tooltip, x, y) {
    this.element.textContent = tooltip;

    this.element.style.left = x + "px";
    this.element.style.top = y + "px";

    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._destroyDocumentListeners();
    if (this.target) {
      this._destroyTargetListeners();
    }

    this.remove();
  }
}

export default Tooltip;
