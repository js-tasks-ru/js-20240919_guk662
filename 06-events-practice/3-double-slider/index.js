export default class DoubleSlider {
  element;

  constructor(props = {}) {
    const {
      min = 0, 
      max = 100, 
      formatValue = value => value, 
      selected = {}
    } = props;

    const {from = min, to = max} = selected;

    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.from = from;
    this.to = to;

    this.subElements = {};

    this._getDefaultRatio();
    this.element = this._createElement();
    this._selectSubElements();

    this._createThumbsListeners();
    this._createRangeSelectEvent();
  }

  _createThumbsListeners() {
    this.subElements.leftThumb.addEventListener('pointerdown', this._handleThumbPointerDown);
    this.subElements.rightThumb.addEventListener('pointerdown', this._handleThumbPointerDown);
  }

  _removeThumbsListeners() {
    this.subElements.leftThumb.removeEventListener('pointerdown', this._handleThumbPointerDown);
    this.subElements.rightThumb.removeEventListener('pointerdown', this._handleThumbPointerDown);
  }

  _createRangeSelectEvent() {
    this.rsEvent = new CustomEvent('range-select', {detail: {from: this.from, to: this.to}});
  }

  normalize = (min, max, value) => Math.max(min, Math.min(max, value));

  _handleThumbPointerDown = (e) => {
    this.thumb = e.target;

    const onPointerMove = (event) => {
      if (this.thumb !== e.target) { return; }
      
      const { left, right } = this.subElements.slider.getBoundingClientRect();
      const x = this.normalize(left, right, event.clientX);
      const ratio = (x - left) / (right - left);

      if (this.thumb === this.subElements.leftThumb) {
        if (ratio > 1 - this.rightRatio) {
          this.leftRatio = 1 - this.rightRatio;
        } else {
          this.leftRatio = ratio;
        }
      }

      if (this.thumb === this.subElements.rightThumb) {
        if (ratio < this.leftRatio) {
          this.rightRatio = 1 - this.leftRatio;
        } else {
          this.rightRatio = 1 - ratio;
        }
      }

      this._boundsCalc();
      this._updateClassesElements();
      this._updateBoundsElements();

      this._createRangeSelectEvent();
      this.element.dispatchEvent(this.rsEvent);
    };

    const onPointerUp = () => {
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointermove', onPointerMove);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  _createElement() {
    const element = document.createElement("div");

    element.innerHTML = `
        <div class="range-slider">
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div data-element="slider" class="range-slider__inner">
                <span data-element="progress" class="range-slider__progress" style="left: ${this.leftRatio * 100}%; right: ${this.rightRatio * 100}%"></span>
                <span data-element="leftThumb" class="range-slider__thumb-left" style="left: ${this.leftRatio * 100}%"></span>
                <span data-element="rightThumb" class="range-slider__thumb-right" style="right: ${this.rightRatio * 100}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
    `;

    return element.firstElementChild;
  }

  _getDefaultRatio() {
    this.leftRatio = (this.from - this.min) / (this.max - this.min);
    this.rightRatio = (this.max - this.to) / (this.max - this.min);
  }

  _boundsCalc() {
    this.from = Math.round(this.min + (this.max - this.min) * this.leftRatio);
    this.to = Math.round(this.max - (this.max - this.min) * this.rightRatio);
  }

  _updateClassesElements() {
    this.subElements.progress.style = `left: ${this.leftRatio * 100}%; right: ${this.rightRatio * 100}%`;
    this.subElements.leftThumb.style = `left: ${this.leftRatio * 100}%`;
    this.subElements.rightThumb.style = `right: ${this.rightRatio * 100}%`;
  }

  _updateBoundsElements() {
    this.subElements.from.textContent = this.formatValue(this.from);
    this.subElements.to.textContent = this.formatValue(this.to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeThumbsListeners();
    this.remove();
  }

  _selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }
}
