function onlyText(value) {
    return /^[a-z\s]+$/i.test(value);
}

function email(value) {
    return /^[^@\s]+@[^@.\s]+\.[a-z]+$/i.test(value);
}

function onlyNumber(value) {
    return /^[\d]+$/.test(value);
}


function buildFixedSize(amount) {
    return (value) => { return fixedSize(value, amount); }; 
}

function fixedSize(value, amount) {
    return value.length === amount;
}

function buildRange(minAmount, maxAmount) {
    return (value) => { return range(value, minAmount, maxAmount); };
}

function range(value, minAmount, maxAmount) {
    return value.length >= minAmount && value.length <= maxAmount;
}

function buildNotDefaultValue(defaultValue) {
    return (value) => { return notDefaultValue(value, defaultValue); };
}

function notDefaultValue(value, defaultValue) {
    return value !== defaultValue;
}

function notEmpty(value) {
    return value !== "" && /^\S+/.test(value);
}

function appendRealTimeValidation(config, errorFieldHandler) {
    for (let property in config) {
        
        if (Array.isArray(config[property])) {
            const $element = $(`#${property}`);  
            const eventType = $element.attr('type') === 'email' || $element.prop('tagName') === 'SELECT' ? 'change' : "input";
            $element.on(eventType, () => {
                validateField(property, config[property], errorFieldHandler);
            });       
        }
        else if (typeof config[property] === "object") {
            appendRealTimeValidation(config[property], errorFieldHandler);
        } 
    }
}

function performValidation(config, errorFieldHandler, errorGroupHandler) {
    let isValid = true;

    for (let property in config) {
        if (Array.isArray(config[property])) {
            if ($(`#${property}`).is(':visible')) {         
                isValid &=validateField(property, config[property], errorFieldHandler, 'error-input', 'message-error');          
            }
        }
        else if (typeof config[property] === "object") {
            const result = performValidation(config[property], errorFieldHandler, errorGroupHandler);
            errorGroupHandler(result, property);           
            isValid &= result;
        }      
    }

    return isValid;
}

function validateField(property, validators, errorFieldHandler, classInput, classMessage) {
    const value = $(`#${property}`).val();
    for (let i = 0; i < validators.length; i++) {
        if (!validators[i][0](value)) {
            errorFieldHandler(true, property, validators[i][1], classInput, classMessage);
            return false;
        }
    }
    errorFieldHandler(false, property);
    return true;
}