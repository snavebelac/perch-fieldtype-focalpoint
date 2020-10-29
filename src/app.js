import {FocusedImage, FocusPicker} from 'image-focus';
import axios from 'axios';

let template = '<div class="fi-grid">\n' +
    '  <div class="fi-focused-image-container fi-top-left">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-top-center">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-top-right">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-center-left">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-center-center">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-center-right">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-bottom-left">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-bottom-center">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '  <div class="fi-focused-image-container fi-bottom-right">\n' +
    '    <img class="fi-focused-image" src="#SRC#">\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="fi-picker-controls">\n' +
    '<h2>Click or click and drag to set focal point</h2>\n' +
    '<div>\n' +
    '  <img id="fi-focus-picker-img" src="#SRC#"></div>  \n' +
    '    <button type="button" class="button button-simple" id="fi-done">Done</button>\n' +
    '</div>';

class TriggerButton {
    constructor(element) {
        this.element = element;
        this.path = '';
        this.target = this.data().target;
        this.image_field = document.getElementById(this.data().imagefield);
        this.asset_field = document.getElementById(this.data().imagefield + '_assetID');
        this.target_field = document.getElementById(this.target);
        this.preview = document.getElementById(this.target + '_preview');
        this.preview_button = document.getElementById(this.target + '_toggle_preview');
        this.preview_button.addEventListener('click', () => {
            this.preview.style.display = this.preview.style.display === 'none' ? 'block' : 'none';
        });
        this.assetID = 0;
        this.init();
    }

    async init() {
        this.setInitialValues(this.data().focus);
        await this.getImage();
        this.setPreviewStyle();
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }

    data() {
        return this.element.dataset;
    }

    setInitialValues(values) {
        let coords = values.split(',');
        if (coords.length === 2) {
            this.x = parseFloat(coords[0]);
            this.y = parseFloat(coords[1]);
        } else {
            this.reset();
        }
    }

    getXPercentage() {
        return ((this.x + 1) / 2) * 100;
    }

    getYPercentage() {
        return (1 - ((this.y + 1) / 2)) * 100;
    }

    setPreviewStyle() {
        this.preview.style.backgroundImage = 'url(' + this.imagePath() + ')';
        this.preview.style.backgroundPosition = this.getXPercentage() + '% ' + this.getYPercentage() + '%';
        this.preview.style.backgroundSize = 'cover';
    }

    setAssetID() {
        if (this.asset_field) {
            this.assetID = this.asset_field.value;
        }
    }

    imagePath() {
        return location.origin + '/' + this.path;
    }

    createVisualiser() {
        let fp = document.createElement('div');
        fp.setAttribute('id', 'fp-temp');
        fp.innerHTML = template.replaceAll('#SRC#', this.imagePath());
        document.body.appendChild(fp);
    }

    removeVisualiser() {
        this.setPreviewStyle();
        document.body.removeChild(document.getElementById('fp-temp'));
    }

    initialiseFocalPoint() {
        let focusPickerEl = document.getElementById('fi-focus-picker-img');
        let focusedImageElements = document.querySelectorAll('.fi-focused-image');
        let focusedImages = [];

        focusedImageElements.forEach((image) => {
            focusedImages.push(
                new FocusedImage(image, {focus: {
                        x: this.x,
                        y: this.y
                    }, debounceTime: 15, updateOnWindowResize: true})
            );
        })

        new FocusPicker(focusPickerEl, {
            focus: {
                x: this.x,
                y: this.y
            },
            onChange: (newFocus) => {
                this.x = Math.round(newFocus.x * 1000) / 1000;
                this.y = Math.round(newFocus.y * 1000) / 1000;
                this.target_field.value = this.x + ',' + this.y;
                focusedImages.forEach((image) => {
                    image.setFocus(newFocus);
                })
            }
        });
    }

    async getImage() {
        this.setAssetID();
        return axios.get('/perch/addons/fieldtypes/focalpoint/async/getimage.php?id=' + this.assetID + '&v=' + new Date().getTime())
            .then((response) => {
                if (response.data.error !== '') {
                    alert(response.data.error);
                } else {
                    this.path = response.data.path;
                }
            })
            .catch((error) => {
                console.warn("getImage Error: " + error);
            });
    }
}

let triggers = document.querySelectorAll('.fi-trigger');
triggers.forEach((button) => {
    let trigger = new TriggerButton(button);
    button.addEventListener('click', async () => {

        if (!trigger.image_field) {
            alert('Image field not set or cannot be found');
            return;
        }

        // Get a fresh copy of the image.
        await trigger.getImage();

        trigger.createVisualiser();

        document.getElementById('fi-done').addEventListener('click', function () {
            trigger.removeVisualiser();
        });

        trigger.initialiseFocalPoint();

    });
});

