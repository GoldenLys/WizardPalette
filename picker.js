// TODO list :
// - Add function to import palettes 


var APP = {
    TYPES: ["red", "green", "blue"],
    VERSION: "1.3",
    PICKER: [0, 0, 0],
    SELECTION: "",
    PRESET: [
        [128, 0, 200],   // Purple
        [255, 0, 255],   // Magenta
        [255, 0, 0],     // Red
        [208, 60, 0],    // Dark Orange
        [255, 90, 0],    // Orange
        [255, 128, 0],   // Light Orange
        [240, 200, 0],   // Dark Yellow
        [255, 255, 0],   // Yellow
        [195, 255, 0],   // Lemon
        [0, 255, 0],     // Lime
        [0, 128, 0],     // Green
        [95, 115, 0],    // Olive 
        [0, 255, 255],   // Cyan
        [0, 128, 128],   // Teal
        [0, 0, 255],     // Blue
        [0, 0, 128],     // Navy
        [255, 255, 255], // White
        [192, 192, 192], // Silver
        [128, 128, 128], // Gray
        [56, 56, 56],    // Dark Gray
        [0, 0, 0],       // Black
    ],
    PALETTES: [[
        [0, 0, 0],
        [255, 255, 255],
    ]],
    NOTICE_TIMER: 0,
};

const UPDATE_PALETTES = function () {
    if (APP.PALETTES.length > 0) {
        $("#custom-palettes").html("");
        APP.PALETTES.forEach((palette, index) => {
            let COLORS = "";
            palette.forEach((color, index2) => {
                let colorContainerClass = "color-container";
                if (index2 === 0) colorContainerClass += " first-color";
                else if (index2 === palette.length - 1) colorContainerClass += " last-color";
                COLORS += `<div class="${colorContainerClass}">
                <div class="container-move">
                <div class="button up" onclick="MOVE_COLOR('up', ${index}, ${index2})"><i class="fal fa-arrow-up"></i></div>
                <div class="button down" onclick="MOVE_COLOR('down', ${index}, ${index2})"><i class="fal fa-arrow-down"></i></div>
                </div>
                <div id="color-${index2}" class="color" style="background-color: rgb(${color.join(', ')});"></div><div id="remove-color-${index}" class="button remove-color"><i class="fal fa-minus"></i></div></div>`;
            });

            $("#custom-palettes").append(`<div id="palette-${index}" class="palette">
                <div class="title-container">
                    <div class="small title">Palette ${index + 1}</div>
                    <div id="delete-${index}" class="button delete"><i class="fa-light fa-trash-can-xmark"></i></div>
                </div>
                <div class="divider"></div>
                ${COLORS}
                <div id="add-${index}" class="button add"><i class="fal fa-plus"></i></div>
                <div id="actions-${index}" class="container-actions">
                    <div class="divider"></div>
                    <div id="copy-palette-${index}" class="button copy" onclick="EXPORT_PALETTE(${index})"><i class="fa-light fa-copy"></i></div>
                    <div id="copy-gradient-${index}" class="button copy" onclick="EXPORT_GRADIENT(${index})"><i class="fa-light fa-palette"></i></div>
                </div>
            </div>`);
        });
    } else {
        $("#custom-palettes").html(`No Palettes Found.`);
    }
    SAVE_DATA();
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
        $(selector).css("margin-left", `calc(${color / 255} * (100% - 30px))`);
    });
    $("#color-name-hex").html("#" + RGBTOHEX(`rgb(${APP.PICKER.join(', ')})`));
    $("#color-name-rgb").html(`rgb(${APP.PICKER.join(' ')})`);
    $("#color-name-hsl").html(RGBTOHSL(APP.PICKER[0], APP.PICKER[1], APP.PICKER[2]));
    $("#color-preview").attr("style", "background-color: " + APP.SELECTION + ";");
    $("#color-preview2").attr("style", "background-color: " + APP.SELECTION + ";");
    $("#color-preview3").attr("style", "background-color: " + APP.SELECTION + ";");
    SAVE_DATA();
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

const LOAD_PRESET = (R, G, B) => {
    const root = document.documentElement;
    root.style.cssText = `--EDITOR_RED: ${R}; --EDITOR_GREEN: ${G}; --EDITOR_BLUE: ${B}`;
    $(`#range-red, #range-green, #range-blue`).val((index, value) => index === 0 ? R : index === 1 ? G : B);
    APP.PICKER = [R, G, B];
    UPDATE_APP();
};

const LOAD_EVENTS = function () {
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

    $(".color-picker").on("click", "#new-palette", function (e) {
        e.preventDefault();
        APP.PALETTES.push([APP.PICKER.slice()]);
        UPDATE_PALETTES();
    });

    $(".color-picker").on("click", ".button.add", function (e) {
        e.preventDefault();
        APP.PALETTES[this.id.split('add-')[1]].push([APP.PICKER.slice()])
        UPDATE_PALETTES();
    });

    $(".color-picker").on("click", ".button.delete", function (e) {
        e.preventDefault();
        APP.PALETTES.splice(this.id.split('delete-')[1], 1);
        UPDATE_PALETTES();
    });

    $(".color-picker").on("click", ".palette .remove-color", function (e) {
        e.preventDefault();
        let PALETTE = $(this).parent().parent().attr('id').split('palette-')[1]
        APP.PALETTES[PALETTE].splice(this.id.split('remove-color-')[1], 1);
        if (APP.PALETTES[PALETTE].length == 0) {
            APP.PALETTES.splice(PALETTE, 1);
        }
        UPDATE_PALETTES();
    });

    $(".color-picker").on("click", ".palette .color", function (e) {
        e.preventDefault();
        const rgb = $(this).css('backgroundColor').replace(/[^\d,]/g, '').split(',');
        const [r, g, b] = rgb.map(Number);
        LOAD_PRESET(r, g, b);
    });

    $(".color-picker").on("click", "#copy-hex, #copy-rgb, #copy-hsl", function (e) {
        e.preventDefault();
        let value;

        switch (this.id) {
            case 'copy-hex':
                type = 'hex';
                value = `${$("#color-name-hex").html()}`;
                break;
            case 'copy-rgb':
                type = 'rgb';
                value = `${$("#color-name-rgb").html()}`;
                break;
            case 'copy-hsl':
                type = 'hsl';
                value = `${$("#color-name-hsl").html()}`;
                break;
        }

        navigator.clipboard.writeText(value).then(() => {
            NOTICE("Copied " + type + " value to clipboard", value);
        });
    });
};

// SAVE AND LOAD FUNCTIONS
const SAVE_DATA = function () {
    localStorage.setItem("WizardPalette", JSON.stringify(APP.PALETTES));
};

const LOAD_SAVE = function () {
    let savegame = JSON.parse(localStorage.getItem("WizardPalette"));
    for (var property in savegame) {
        if (typeof savegame[property] !== "undefined") APP.PALETTES[property] = savegame[property];
    }
}

const EXPORT_SAVE = async function () {
    try {
        const saveData = btoa(JSON.stringify(APP.PALETTES));
        await navigator.clipboard.writeText(saveData);
        NOTICE("Save exported", "Your save is now copied to your clipboard.");
    } catch (error) {
        console.error("Error copying save to clipboard:", error);
        NOTICE("Error", "Failed to copy save to clipboard.");
    }
}

const IMPORT_SAVE = function () {
    var SAVE = prompt("Paste your save code here");
    if (SAVE) {
        RESTORE_SAVE(SAVE);
        NOTICE("Save imported", "Your save has been successfully imported.");
    }
}

const RESTORE_SAVE = function (SAVE) {
    try {
        var decoded = atob(SAVE);
        JSON.parse(decoded);
        if (decoded) {
            localStorage.setItem("WizardPalette", decoded);
            LOAD_SAVE();
        } else NOTICE("Error", "Invalid save data.");
    } catch (err) {
        NOTICE("Error", "Invalid save data.");
    }
}

const NOTICE = function (title, content) {
    $("#notice-title").html(title);
    $("#notice-text").html(content);
    $("#NOTICE").attr("class", "notice active");
    NOTICE_TIMER = [5, setInterval(NOTICE_TIMING, 1000)];
    NOTICE_TIMING();
};

const NOTICE_TIMING = function () {
    let PERCENT = (100 / 5) * NOTICE_TIMER[0];
    $("#notice-countdown").attr("style", `width: calc(${PERCENT}% - 20px);`);
    if (NOTICE_TIMER[0] > 0) NOTICE_TIMER[0]--;
    else {
        clearInterval(NOTICE_TIMER[1]);
        $("#NOTICE").attr("class", "notice");
        $("#notice-title").html("");
        $("#notice-text").html("");
    }
};

const MOVE_COLOR = function(direction = 'up', paletteIndex = 0, colorIndex = 0) {
    const palette = APP.PALETTES[paletteIndex];
    if (!palette || colorIndex < 0 || colorIndex >= palette.length) return;

    const swapIndex = direction === 'up' ? colorIndex - 1 : colorIndex + 1;
    if (swapIndex < 0 || swapIndex >= palette.length) return;

    [palette[colorIndex], palette[swapIndex]] = [palette[swapIndex], palette[colorIndex]];
    UPDATE_PALETTES();
};

const EXPORT_TEXT = async function (DATA) {
    try {
        await navigator.clipboard.writeText(DATA);
    } catch (error) {
        console.error("Error copying save to clipboard:", error);
        NOTICE("Error", "Failed to copy save to clipboard.");
    }
}

const EXPORT_PALETTE = function (palette) {
    let palette_text = "";
    if (APP.PALETTES.length > 0) {
            APP.PALETTES[palette].forEach((color, index) => {
                let first_color = index === 0 ? "#" : " #"; 
                let last_color = (index === APP.PALETTES[palette].length - 1) ? "" : ","; 
                palette_text = palette_text + first_color +RGBTOHEX(color.join(', ')) + last_color;
            });
    }
    EXPORT_TEXT(palette_text);
    NOTICE("Palette exported", "Your palette is now copied to your clipboard.");
};


const EXPORT_GRADIENT = function (palette) {
    let gradient_text = "";
    if (APP.PALETTES.length > 0) {
            APP.PALETTES[palette].forEach((color, index) => {
                let first_color = index === 0 ? "linear-gradient(to right, #" : " #"; 
                let last_color = (index === APP.PALETTES[palette].length - 1) ? ")" : ","; 
                gradient_text = gradient_text + first_color +RGBTOHEX(color.join(', ')) + last_color;
            });
    }
    EXPORT_TEXT(gradient_text);
    NOTICE("Gradient exported", "Your gradient is now copied to your clipboard.");
};


(function () {
    document.title = `Wizard Palette v${APP.VERSION}`;
    if (localStorage.getItem("WizardPalette") !== null) LOAD_SAVE();
    LOAD_EVENTS();
    UPDATE_PRESETS();
    UPDATE_PALETTES();
})();