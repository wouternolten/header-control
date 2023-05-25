document.addEventListener('DOMContentLoaded', function() {
    var slider = document.getElementById('slider');
    slider.addEventListener('change', function() {
        console.log('Slider value: ' + this.value);
    });
});
