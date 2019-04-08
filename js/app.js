document.addEventListener('DOMContentLoaded', () => {

    const validationConfig = {
        "basicInfo": {
            "name": [[notEmpty, "This field can not be blank."], [onlyText, "Do not write numbers or symbols."]],
            "mail": [[notEmpty, "This field can not be blank."], [email, "Enter a valid email, write like name@example.com"]],
            "other-title": [[notEmpty, "This field can not be blank."], [onlyText, "Do not write numbers or symbols."]]
        },
        "tshirtInfo": {
            "design": [[buildNotDefaultValue("Select Theme"), "Select the shirt design."]]
        },
        "activitiesInfo": {
            "activitiesInfo": [[() => { return $('#js-sum').text() !== '0'}, ""]]
        },
        "paymentInfo": {
            "payment": [[buildNotDefaultValue("select_method"), "Select a payment method."]],
            "cc-num": [[notEmpty, "This field can not be blank."], [onlyNumber, 'Only accept numbers.'], [buildRange(13, 16), `Minimun ${13} to ${16} caracters`]],
            "zip": [[notEmpty, "This field can not be blank."], [onlyNumber, 'Only accept numbers.'], [buildFixedSize(5), `Insert ${5} caracters`]],
            "cvv": [[notEmpty, "This field can not be blank."], [onlyNumber, 'Only accept numbers.'], [buildFixedSize(3), `Insert ${3} caracters`]],
        }
    }

    loadForm();
    appendRealTimeValidation(validationConfig, customErrorFieldHandler); //Es para registrar validaciones en tiempo real

    $('button:submit').on('click', (e) => { 
        if(!performValidation(validationConfig, customErrorFieldHandler, customErrorGroupHandler)) { // est para registrar validaciones cuando submiteas
            e.preventDefault(); 
        } 
    });
});

function loadForm() {
    $('#name').focus();
    $('#other-title').hide();
    $('#colors-js-puns').hide();
    $('fieldset:last > div').hide();
    $('#activitiesInfo').append('<span id="js-sum">0</span>');

    $('#title').on('change', (e) => {
        const otherSelected = e.target.value === 'other';
        showOrHideElement(otherSelected, $('#other-title'));
        customErrorFieldHandler(otherSelected, 'other-title');
    });
    $('#payment').on('change', (e) => {
        const payment = e.target.value;
        showOrHideElement(payment === 'credit card', $('fieldset:last > div')[0]);
        showOrHideElement(payment === 'paypal', $('fieldset:last > div')[1]);
        showOrHideElement(payment === 'bitcoin', $('fieldset:last > div')[2]);

        
    });
    $('#design').on('change', (e) => { groupingBySelection(e.target); });
    $('.activities input:checkbox').on('change', (e) => { 
        checkboxHandle(e.target.parentNode, $('.activities label'));
    });
}

function customErrorFieldHandler(show, fieldId, errorMessage) { 
    let $element = $(`#${fieldId}-error`);

    if (!show) {
        $element.remove();
        return;
    }

    if ($element.length) {
        $element.text(errorMessage);
    } else {
        const $element = $(`<p id="${fieldId}-error" class="message" >`);
        $element.text(errorMessage);
        $(`#${fieldId}`).after($element);
    }
}

function customErrorGroupHandler(isValid, groupId) {
    const $legend = $(`#${groupId}`).children(':first');
    if(isValid) {
        $legend.toggleClass();
    } else {
        $legend.addClass('error-legend');
    }
}

function showOrHideElement(show, element) {
    if (show) {
        $(element).show();
    } else {
        $(element).hide();
    }
}

function groupingBySelection(selector) {
    const colors = $('#color option');
    const limit = colors.length / 2;
    const shirt = selector.value;
    const isShirtOne = $(selector.children)[1].value;
    showOrHideElement(shirt !== $(selector.children)[0].value, $('#colors-js-puns'));
    if (shirt === isShirtOne) {
        colors[0].selected = true;
    }
    else {
        colors[limit].selected = true; 
    }

    for (let i = 0; i < colors.length; i++) {
        const show = isPartOf(shirt === isShirtOne, i, limit)
        showOrHideElement(show, colors[i]);
    };

    function isPartOf(belong, position, limit) {
        if (belong) {
            return position < limit;
        }
        else {
            return position >= limit;
        }
    }
}

function checkboxHandle(select, $options) {
    $(select).toggleClass('selected-checkbox');
    $options.each(function() {
        const values = $(this).text().split(/[—,] /);
        if (select === this) {
            let sum = parseInt($('#js-sum').text());
            const price = parseInt(values[values.length - 1].replace('$', ''));
            if(select.firstElementChild.checked) {
                sum += price;
            }
            else {
                sum -= price;
            }
            $('#js-sum').text(sum);
        }
        else {
            selectValues = $(select).text().split(/[—,] /);
            if (selectValues[1] === values[1]) {
                calculateAvailability(this);
            }
        }
    });
}

function calculateAvailability(sibling) {
    const isDisabled = sibling.firstElementChild['disabled'];
    if (isDisabled) {
        sibling.firstElementChild['disabled'] = false;
        $(sibling).removeClass('disabled-checkbox');
    }
    else {
        sibling.firstElementChild['disabled'] = true;
        $(sibling).addClass('disabled-checkbox');
    }
}