var APP = {
    TYPES: ["red", "green", "blue"],
    VERSION: 0.3,
    PICKER: [0, 0, 0],
    SELECTION: "",
};

(function () {
    document.title = `Wizard Palette v${APP.VERSION}`;

    APP.TYPES.forEach((type, index) => {
        $(`#range-${type}`).on('input', function () {
            let value = $(this).val();
            document.documentElement.style.setProperty(`--EDITOR_${type.toUpperCase()}`, value);
            APP.PICKER[index] = value;
            WP_UPDATE();
        });

        $(`#selector-${type} .button.minus`).on("click", function () {
            WP_CHANGE(index, false);
        });

        $(`#selector-${type} .button.plus`).on("click", function () {
            WP_CHANGE(index, true);
        });
    });

    $(".color-picker #copy-hex, .color-picker #copy-rgb").on("click", function () {
        let value = this.id === 'copy-hex' ? `#${$("#color-name").attr("placeholder")}` : `rgb(${APP.PICKER.join(' ')})`;
        navigator.clipboard.writeText(value).then(() => {
            alert("Copied to clipboard");
        });
    });
})();

const WP_CHANGE = function (TYPE, PARAM) {
    if (!PARAM) {
        if (APP.PICKER[TYPE] > 0) APP.PICKER[TYPE]--;
    } else {
        if (APP.PICKER[TYPE] < 255) APP.PICKER[TYPE]++;
    }
    $(`#range-${APP.TYPES[TYPE]}`).val(APP.PICKER[TYPE]);
    WP_UPDATE();
};

const WP_UPDATE = function () {
    APP.SELECTION = `rgb(${APP.PICKER.join(' ')})`;

    APP.PICKER.forEach((color, index) => {
        let selector = `#selector-${APP.TYPES[index]} .value`;
        $(selector).html(color);
        $(selector).css("margin-left", `calc(${color / 255} * (100% - 3em))`);
    });
    $("#color-name").attr("placeholder", WP_HEXCOLOR(`rgb(${APP.PICKER.join(', ')})`));
};

const WP_HEXCOLOR = function (a) {
    a = a.replace(/[^\d,]/g, "").split(",");
    return ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2]).toString(16).slice(1);
};