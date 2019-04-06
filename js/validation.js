function isOnlyText(value) {
    return /^[a-z\s]+$/i.test(value);
}

function isEmail(value) {
    return /^[^@\s]+@[^@.\s]+\.[a-z]+$/i.test(value);
}

function isTextAndNumber(value) {
    return /[\w\s]+/.test(value);
}

function isOnlyNumber(value) {
    return /^[\d]+$/.test(value);
}

function minimum(value, amount) {
    return value.length >= amount;
}

function isNotEmpty(value) {
    return value !== "" && /^\S+/.test(value);
}


function verifyValueInput(input, validations, $tooltipError) {
    const text = input.value;
    let showTip = false;
    for (let i = 0; i < validations.length; i++) {
        const valid = validations[i][0](text);
        showTip = text === "" || !valid;
        
        if (showOrHideTip(showTip, $tooltipError)) {
            $tooltipError.text(validations[i][1]);
            break;
        }
    }
    return showTip;
}

function showOrHideTip(show, element) {
    if (show) {
        $(element).show();
    } else {
        $(element).hide();
    }
    return show;
}

function isPartOf(belong, position, limit) {
    if (belong) {
        return position < limit;
    }
    else {
        return position >= limit;
    }
}