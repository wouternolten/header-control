document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');

  slider.addEventListener('change', (element) => {
    if (element.target.value < 1) {
      document.getElementById('slider-label').innerHTML = 'Disabled';
      return;
    }

    document.getElementById('slider-label').innerHTML = 'Enabled';
  });
});
