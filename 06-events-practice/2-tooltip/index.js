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
    this.target.addEventListener('pointermove', this._handlePointerMove);
  }

  _destroyTargetListeners() {
    this.target.removeEventListener('pointerout', this._handlePointerOut);
    this.target.removeEventListener('pointermove', this._handlePointerMove);
  }

  _handlePointerMove = (e) => {
    this.element.style.left = e.clientX + "px";
    this.element.style.top = e.clientY + "px";
  }

  _handlePointerOver = (e) => {
    const tooltip = e.target.dataset.tooltip;

    if (!tooltip) {
      return;
    }
  
    this.target = e.target;
    this._createTargetListeners();
    
    this.render(tooltip);
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

  render(tooltip) {
    this.element.textContent = tooltip;
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
