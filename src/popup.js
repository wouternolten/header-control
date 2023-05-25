function getElement(elName) {
  return document.getElementById(elName);
}

function addSliderControls() {
  const slider = getElement('slider');

  slider.addEventListener('change', (element) => {
    if (element.target.value < 1) {
      getElement('slider-label').innerHTML = 'Disabled';
      return;
    }

    getElement('slider-label').innerHTML = 'Enabled';
  });
}

function addHeaderControls() {
  const button = getElement('addHeader');

  button.addEventListener('click', () => {
    const headersDiv = document.getElementById('headers');

    const headerNameField = document.createElement('input');
    headerNameField.type = 'text';
    headerNameField.placeholder = 'Header Name';

    const headerValueField = document.createElement('input');
    headerValueField.type = 'text';
    headerValueField.placeholder = 'Header Value';

    headersDiv.appendChild(headerNameField);
    headersDiv.appendChild(headerValueField);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addSliderControls();
  addHeaderControls();
});
