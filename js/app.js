document.addEventListener('DOMContentLoaded', () => {
    const errorElement = '<p>';
    const three = 3;
    const five = 5;
    const thirteen = 13;
    const sixtheen = 16;

    const validation = {
        name: [[isNotEmpty, "This camp cann't be empty or being with empty space"], [isOnlyText, "Not write numbers or simbols"]],
        mail: [[isNotEmpty, "This camp cann't be empty or being with empty space"], [isEmail, 'Error of email, write like name@example.com']],
        otherTitle: [[isNotEmpty, "This camp cann't be empty or being with empty space"], [isOnlyText, "Not write numbers or simbols"]],
        ccNum: [[isNotEmpty, "This camp cann't be empty or being with empty space"], [isOnlyNumber, 'Write only numbers'], [(value) => { return minimum(value, thirteen, sixtheen); }, `Minimun ${thirteen} to ${sixtheen} caracters`]],
        zip: [[isNotEmpty, "This camp cann't be empty or being with empty space"], [isOnlyNumber, 'Write only numbers'], [(value) => { return minimum(value, five); }, `Minimun ${five} caracters`]],
        cvv: [[isNotEmpty, "This camp cann't be empty or being with empty space"], [isOnlyNumber, 'Write only numbers'], [(value) => { return minimum(value, three); }, `Minimun ${three} caracters`]],
        css: ['message', 'error-legend', 'error-input', 'message-error']
    }
    loadForm(errorElement, validation);
    $('button:submit').on('click', (e) => { verifyInputs(e, validation) });

});

function verifyInputs(event, validation) {
    let isEmpty = false;
    //Checked if color desing is seleted
    if ($('#design option')[0].selected) {
        isEmpty = true;
        $('.shirt legend').addClass(validation['css'][1]);
    }
    // Checked if some checkbox is checked
    if ($('label input:checked').length === 0) {
        isEmpty = true;
        $('.activities legend').addClass(validation['css'][1]);
    }
    // Checked if a Type of Pay was selected
    if ($('#payment option')[0].selected) {
        isEmpty = true;
        $('fieldset:last legend').addClass(validation['css'][1]);
    }
    // Checked if the imput value are correct
    $('input[type="text"], input[type="email"]').each(function() { 
        if (this.style.display === 'none' || this.parentNode.parentNode.style.display === 'none') {
            return;
        }
        const $error = $(this).next();
        const id = $(this).attr('id');
        const invalid = verifyValueInput(this, validation[id], $error);
        if (invalid) {
            const parent = this.parentNode;
            isEmpty = true;
            if (parent.tagName === 'DIV') $(parent.parentNode.parentNode.firstElementChild).addClass(validation['css'][1]);
            else $(parent.firstElementChild).addClass(validation['css'][1]);
            $(this).addClass(validation['css'][2]);
            $(this).next().addClass(validation['css'][3]);
            console.log('t');
        }    
    });

    if (isEmpty) {
        event.preventDefault();
    }
}

function loadForm(errorElement, validation) {
    $('#name').focus();
    $('#otherTitle').hide();
    $('#colors-js-puns').hide();
    $('fieldset:last > div').hide();
    // Add input if "other" Elemente is select
    $('#title').on('change', (e) => { showOrHideTip(e.target.value === 'other', $('#otherTitle')); });
    // Add message Error to inputs
    $('fieldset:first input').each(function () { addErrorHandle(this); });
    // Add message Error to inputs
    $('fieldset:last input').each(function () { addErrorHandle(this); });
    // Show options by the type payment selected
    $('#payment').on('change', (e) => {

        $('fieldset:last legend').removeClass(validation['css'][1]);

        const payment = e.target.value;
        
        showOrHideTip(payment === 'credit card', $('fieldset:last > div')[0]);
        showOrHideTip(payment === 'paypal', $('fieldset:last > div')[1]);
        showOrHideTip(payment === 'bitcoin', $('fieldset:last > div')[2]);

    });
    // Change color when design is changed
    $('#design').on('change', (e) => { 
        agrupingBySelection(e.target);
        $('.shirt legend').removeClass(validation['css'][1]);
    });
    // Add event to each checkbox
    $('.activities input:checkbox').on('change', (e) => { 
        checkboxHandle(e.target.parentNode, $('.activities label'));
        $('.activities legend').removeClass(validation['css'][1]);
    });

    function addErrorHandle(input) {
        const id = $(input).attr('id');
        const $error = createElementNextTo(input, errorElement, validation['css'][0]);
        $(input).on('input', (e) => {
            const element = e.target;
            const parent = element.parentNode;
            verifyValueInput(element, validation[id], $error);
            
            if (parent.tagName === 'DIV') $(parent.parentNode.parentNode.firstElementChild).removeClass(validation['css'][1]);
            else $(parent.firstElementChild).removeClass(validation['css'][1]);
            
            $(element).removeClass(validation['css'][2]);
            $(element).next().removeClass(validation['css'][3]);
        });
    }

};

// Add an error element next to an DOM element
function createElementNextTo(previousSibling, elementSimbol, nameClass) {
    const $element = $(elementSimbol);
    $element.addClass(nameClass).hide();
    $(previousSibling).after($element);
    return $element;
}

function agrupingBySelection(selector) {

    const colors = $('#color option');
    const limit = colors.length / 2;
    const shirt = selector.value;
    const isShirtOne = $(selector.children)[1].value;

    showOrHideTip(shirt !== $(selector.children)[0].value, $('#colors-js-puns'));

    if (shirt === isShirtOne) colors[0].selected = true;
    else colors[limit].selected = true;

    for (let i = 0; i < colors.length; i++) {

        const show = isPartOf(shirt === isShirtOne, i, limit)
        showOrHideTip(show, colors[i]);
    };

}

function checkboxHandle(select, options) {
    $(select).toggleClass('selected-checkbox');
    for (let i = 0; i < options.length; i++) {
        const option = options[i]
        if (select !== option) {
            continue;
        }
        if (i > 0 && i < 3) {
            toggleAble(options[i + 2]);
        }
        else if (i > 0 && i < 5) {
            toggleAble(options[i - 2]);
        }
    }
}

function toggleAble(sibling) {
    const able = sibling.firstElementChild['disabled'];
    if (able) {
        sibling.firstElementChild['disabled'] = false;
        $(sibling).removeClass('disabled-checkbox');
    }
    else {
        sibling.firstElementChild['disabled'] = true;
        $(sibling).addClass('disabled-checkbox');
    }
}




