var APP = {
    TYPES: ["red", "green", "blue"],
    VERSION: "1.0",
    PICKER: [0, 0, 0],
    SELECTION: "",
    PRESET: [
        [0, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
        [255, 255, 0],
        [0, 255, 255],
        [255, 0, 255],
    ]
};

const CHANGE_RGB = function (TYPE, PARAM) {
    if (!PARAM) {
        if (APP.PICKER[TYPE] > 0) APP.PICKER[TYPE]--;
    } else {
        if (APP.PICKER[TYPE] < 255) APP.PICKER[TYPE]++;
    }
    $(`#range-${APP.TYPES[TYPE]}`).val(APP.PICKER[TYPE]);
    UPDATE_APP();
};

const UPDATE_APP = function () {
    APP.SELECTION = `rgb(${APP.PICKER.join(' ')})`;
    APP.PICKER.forEach((color, index) => {
        let selector = `#selector-${APP.TYPES[index]} .value`;
        $(selector).html(color);
        $(selector).css("margin-left", `calc(${color / 255} * (100% - 35px))`);
    });
    $("#color-name-hex").html("#" + RGBTOHEX(`rgb(${APP.PICKER.join(', ')})`));
    $("#color-name-rgb").html(`rgb(${APP.PICKER.join(' ')})`);
    $("#color-name-hsl").html(RGBTOHSL(APP.PICKER[0], APP.PICKER[1], APP.PICKER[2]));
    $("#color-preview").attr("style", "background-color: " + APP.SELECTION + ";");
    $("#color-preview2").attr("style", "background-color: " + APP.SELECTION + ";");
    $("#color-preview3").attr("style", "background-color: " + APP.SELECTION + ";");
};
const RGBTOHEX = function (a) {
    a = a.replace(/[^\d,]/g, "").split(",");
    return ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2]).toString(16).slice(1);
};

const RGBTOHSL = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : 
          max === g ? (b - r) / d + 2 : 
          (r - g) / d + 4;
      h *= 60;
    }
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const UPDATE_PRESETS = function () {
    $("#presets").html();
    for (let PRESET in APP.PRESET) {
        $("#presets").append(`<div id="preset-${PRESET}" class="preset" style="background-color: rgb(${APP.PRESET[PRESET].join(', ')});"></div>`);
    }
    UPDATE_APP();
};

const LOAD_PRESET = function (R, G, B) {
    const root = document.documentElement;
    root.style.setProperty('--EDITOR_RED', R);
    root.style.setProperty('--EDITOR_GREEN', G);
    root.style.setProperty('--EDITOR_BLUE', B);
    APP.PICKER = [R, G, B];
    UPDATE_APP();
};

(function () {
    document.title = `Wizard Palette v${APP.VERSION}`;

    APP.TYPES.forEach((type, index) => {
        $(`#range-${type}`).on('input', function (e) {
            e.preventDefault();
            let value = $(this).val();
            document.documentElement.style.setProperty(`--EDITOR_${type.toUpperCase()}`, value);
            APP.PICKER[index] = value;
            UPDATE_APP();
        });

        $(`.presets`).on("click", ".preset", function (e) {
            e.preventDefault();
            const rgb = $(this).css('backgroundColor').replace(/[^\d,]/g, '').split(',');
            const [r, g, b] = rgb.map(Number);
            LOAD_PRESET(r, g, b);
        });

        $(`#selector-${type} .button.minus`).on("click", function (e) {
            e.preventDefault();
            CHANGE_RGB(index, false);
        });

        $(`#selector-${type} .button.plus`).on("click", function (e) {
            e.preventDefault();
            CHANGE_RGB(index, true);
        });
    });

    $(".color-picker").on("click", "#copy-hex, #copy-rgb, #copy-hsl", function (e) {
        e.preventDefault();
        let value;
    
        switch (this.id) {
            case 'copy-hex':
                type = 'hex';
                value = `#${$("#color-name").attr("placeholder")}`;
                break;
            case 'copy-rgb':
                type = 'rgb';
                value = `rgb(${APP.PICKER.join(' ')})`;
                break;
            case 'copy-hsl':
                type = 'hsl';
                value = RGBTOHSL(APP.PICKER[0], APP.PICKER[1], APP.PICKER[2]);
                break;
        }
    
        navigator.clipboard.writeText(value).then(() => {
            alert("Copied " + type + " value to clipboard");
        });
    });

    UPDATE_PRESETS();
})();