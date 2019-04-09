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
            "total": [[() => { return $('#js-sum').text() !== '0'}, "Select at least one activity"]]
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
// Hides options elements and charge events
function loadForm() {
    $('#name').focus();
    $('#other-title').hide();
    $('#colors-js-puns').hide();
    $('#paymentInfo > div').hide();
    $('#payment option[value="credit card"]').attr('selected', true);
    $('#credit-card').show();
    $('#activitiesInfo').append('<h3>Total:</h3><div id="total"><span class="unid">$</span><span id="js-sum">0</span></div>');

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
        checkboxHandle(e.target.parentNode, $('#activitiesInfo label'));
    });
}
// Adds an error message to each input to validate
function customErrorFieldHandler(show, fieldId, errorMessage, classInput = '', classMessage = '') { 
    const $element = $(`#${fieldId}-error`);
    const $prevElement = $(`#${fieldId}`);

    if (!show) {
        $element.remove();
        $prevElement.removeClass($prevElement.attr('class'));
        $prevElement.parents('fieldset').children(':first').removeClass('error-legend');
        return;
    }

    if ($element.length) {
        $element.text(errorMessage).addClass(classMessage);
        $prevElement.addClass(classInput);
    } else {
        const $element = $(`<p id="${fieldId}-error" class="message" >`);
        $element.text(errorMessage).addClass(classMessage);
        $prevElement.after($element).addClass(classInput);
    }
}
// Change the legend style 
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
// Separates the elements by design
function groupingBySelection(selector) {
    const shirt = $(`option[value="${selector.value}"]`).text().replace(/\w+\s-\s(.+)/, '$1');
    let selected = true;
    showOrHideElement(!$(selector.children)[0].value.includes(shirt), $('#colors-js-puns'));

    $('#color option').each(function(i, color) {
        if (color.text.includes(shirt)) {
            $(color).show();
            if ((i === 0 && selected) || (i > 0 && selected)) {
                selected = false;
                color.selected = true;
            }
        }
        else {
            $(color).hide();
        }
    });
    
}
// Applies the style to checkbox selected
function checkboxHandle(select, $options) {
    $(select).toggleClass('selected-checkbox');
    $('#total-error').remove();
    $options.parents('fieldset').children(':first').removeClass('error-legend');

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
// Enable and disable the checkbox
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