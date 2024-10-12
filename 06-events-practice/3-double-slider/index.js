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

    this._getDefaultRatio();
    this.element = this._createElements();
    this._createThumbsListeners();
    this._createRangeSelectEvent();
  }

  _createThumbsListeners() {
    this.lThumbElement.addEventListener('pointerdown', this._handleThumbPointerDown);
    this.rThumbElement.addEventListener('pointerdown', this._handleThumbPointerDown);
  }

  _removeThumbsListeners() {
    this.lThumbElement.removeEventListener('pointerdown', this._handleThumbPointerDown);
    this.rThumbElement.removeEventListener('pointerdown', this._handleThumbPointerDown);
  }

  _createRangeSelectEvent() {
    this.rsEvent = new CustomEvent('range-select', {detail: {from: this.from, to: this.to}});
  }

  normalize = (min, max, value) => Math.max(min, Math.min(max, value));

  _handleThumbPointerDown = (e) => {
    this.thumb = e.target;

    const onPointerMove = (event) => {
      if (this.thumb !== e.target) { return; }
      
      const { left, right } = this.slider.getBoundingClientRect();
      const x = this.normalize(left, right, event.clientX);
      const ratio = (x - left) / (right - left);

      if (this.thumb === this.lThumbElement) {
        if (ratio > 1 - this.rightRatio) {
          this.leftRatio = 1 - this.rightRatio;
        } else {
          this.leftRatio = ratio;
        }
      }

      if (this.thumb === this.rThumbElement) {
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

  _getLeftRatio(pos) {
    return (pos) / this.sliderRect.width;
  }

  _getRightRatio(pos) {
    return (this.sliderRect.right - pos) / this.sliderRect.width;
  }

  _createElements() {
    const element = document.createElement("div");

    element.innerHTML = `
        <div class="range-slider">
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress" style="left: ${this.leftRatio * 100}%; right: ${this.rightRatio * 100}%"></span>
                <span class="range-slider__thumb-left" style="left: ${this.leftRatio * 100}%"></span>
                <span class="range-slider__thumb-right" style="right: ${this.rightRatio * 100}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
    `;

    this.progressElement = element.querySelector(".range-slider__progress");
    this.lThumbElement = element.querySelector(".range-slider__thumb-left");
    this.rThumbElement = element.querySelector(".range-slider__thumb-right");

    this.slider = element.querySelector(".range-slider__inner");

    const {"0": leftValueElement, "1": rightValueElement } = element.querySelectorAll("div.range-slider > span");

    this.leftValueElement = leftValueElement;
    this.rightValueElement = rightValueElement;

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
    this.progressElement.style = `left: ${this.leftRatio * 100}%; right: ${this.rightRatio * 100}%`;
    this.lThumbElement.style = `left: ${this.leftRatio * 100}%`;
    this.rThumbElement.style = `right: ${this.rightRatio * 100}%`;
  }

  _updateBoundsElements() {
    this.leftValueElement.textContent = this.formatValue(this.from);
    this.rightValueElement.textContent = this.formatValue(this.to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeThumbsListeners();
    this.remove();
  }
}
