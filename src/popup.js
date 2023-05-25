function addSliderControls() {
  const slider = document.getElementById('slider');

  slider.addEventListener('change', (element) => {
    if (element.target.value < 1) {
      document.getElementById('slider-label').innerHTML = 'Disabled';
      return;
    }

    document.getElementById('slider-label').innerHTML = 'Enabled';
  });
}

function addHeaderControls() {
  const button = document.getElementById('addHeader');

  button.addEventListener('click', () => {
    const headersDiv = document.getElementById('headers');

    const headerDiv = document.createElement('div');

    const headerNameField = document.createElement('input');
    headerNameField.type = 'text';
    headerNameField.placeholder = 'Header Name';

    const headerValueField = document.createElement('input');
    headerValueField.type = 'text';
    headerValueField.placeholder = 'Header Value';

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('bg-red');
    deleteButton.textContent = 'X';

    deleteButton.addEventListener('click', () => {
      headersDiv.removeChild(headerDiv);
    });

    headerDiv.appendChild(headerNameField);
    headerDiv.appendChild(headerValueField);
    headerDiv.appendChild(deleteButton);

    headersDiv.appendChild(headerDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addSliderControls();
  addHeaderControls();
});
