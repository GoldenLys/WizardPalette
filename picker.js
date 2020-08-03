var APP = {
    TYPES: ["red", "green", "blue"],
    VERSION: 0.1,
    PICKER: [0, 0, 0],
    SELECTION: "",
};

(function () {
    document.title = "Purple Picker v" + APP.VERSION;

    $("#range-red").bind('input', function () {
        document.documentElement.style.setProperty('--EDITOR_RED', $("#range-red").val());
        APP.PICKER[0] = $("#range-red").val();
        WP_UPDATE();
    });

    $("#range-green").bind('input', function () {
        document.documentElement.style.setProperty('--EDITOR_GREEN', $("#range-green").val());
        APP.PICKER[1] = $("#range-green").val();
        WP_UPDATE();
    });

    $("#range-blue").bind('input', function () {
        document.documentElement.style.setProperty('--EDITOR_BLUE', $("#range-blue").val());
        APP.PICKER[2] = $("#range-blue").val();
        WP_UPDATE();
    });

    $("#selector-red .button.minus").on("click", function () {
        WP_CHANGE(0, false);
    });

    $("#selector-red .button.plus").on("click", function () {
        WP_CHANGE(0, true);
    });

    $("#selector-green .button.minus").on("click", function () {
        WP_CHANGE(1, false);
    });

    $("#selector-green .button.plus").on("click", function () {
        WP_CHANGE(1, true);
    });

    $("#selector-blue .button.minus").on("click", function () {
        WP_CHANGE(2, false);
    });

    $("#selector-blue .button.plus").on("click", function () {
        WP_CHANGE(2, true);
    });

    $("#button-validate").on("click", function () {
        $("body").css("background-color", APP.SELECTION);
    });

    $(".hex-color #copy").on("click", function () {
        let SELECTED = document.createElement('textarea');
        SELECTED.value = "#" + $("#color-name").attr("placeholder");
        document.body.appendChild(SELECTED);
        SELECTED.select();
        document.execCommand('copy');
        document.body.removeChild(SELECTED);
        window.getSelection().removeAllRanges();
    });
})();

const WP_CHANGE = function (TYPE, PARAM) {

    if (!PARAM) {
        if (APP.PICKER[TYPE] > 0) APP.PICKER[TYPE]--;
    } else {
        if (APP.PICKER[TYPE] < 255) APP.PICKER[TYPE]++;
    }
    $("#range-" + APP.TYPES[TYPE]).val(APP.PICKER[TYPE]);
    WP_UPDATE();
};

const WP_UPDATE = function () {
    APP.SELECTION = "rgb(" + APP.PICKER[0] + " " + APP.PICKER[1] + " " + APP.PICKER[2] + ")";
    $(".button-validate").attr("style", "background-color: " + APP.SELECTION + ";");

    for (let COLOR in APP.PICKER) {
        $("#selector-" + APP.TYPES[COLOR] + " .value").html(APP.PICKER[COLOR]);
        $("#selector-" + APP.TYPES[COLOR] + " .value").css("margin-left", "calc(" + (APP.PICKER[COLOR] / 255) + " * (100% - 3em))");
    }
    $("#color-name").attr("placeholder", WP_HEXCOLOR("rgb(" + APP.PICKER[0] + "," + APP.PICKER[1] + "," + APP.PICKER[2] + ")"));
};
const WP_HEXCOLOR = function (a) {
    a = a.replace(/[^\d,]/g, "").split(",");
    return ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2]).toString(16).slice(1);
};
