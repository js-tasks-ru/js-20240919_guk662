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
    document.addEventListener('pointerover', this._onPointerOver);
  }

  _destroyDocumentListeners() {
    document.removeEventListener('pointerover', this._onPointerOver);
  }

  _onPointerOver = (e) => {
    const tooltip = e.target.dataset.tooltip;

    if (!tooltip) {
      return;
    }
  
    this.target = e.target;
    
    const onPointerMove = (e) => {
      this.element.style.left = e.clientX + 10 + "px";
      this.element.style.top = e.clientY + 10 + "px";
    };
    
    const onPointerOut = () => {
      this.target.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('pointermove', onPointerMove);
      this.remove();
    };

    this.target.addEventListener('pointerout', onPointerOut);
    document.addEventListener('pointermove', onPointerMove);

    this.render(tooltip);
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
    this.remove();
  }
}

export default Tooltip;
