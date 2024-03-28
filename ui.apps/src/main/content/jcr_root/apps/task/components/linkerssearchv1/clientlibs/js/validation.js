(function($, Coral) {

    "use strict";

    let HEX_CODE_ERROR_MESSAGE = "The hexadecimal (HEX) color code must begin with #";
    let FOUNDATION_VALIDATION_VALIDATOR = "foundation.validation.validator";
    let HEX_CODE_SYMBOL = "#";
    let registry = $(window).adaptTo("foundation-registry");
    let selectors = {
        countPaginationRows: "[name='./countPaginationRows']",
        foundMessage: "[name='./foundMessage']",
        errorMessageHexColor: "[name='./errorMessageHexColor']",
        backgroundHexColor: "[name='./backgroundHexColor']",
        pathToResource: "[name='./pathToResource']",
        requestErrorMessage: "[name='./requestErrorMessage']",
        urlIsNotValidMessage: "[name='./urlIsNotValidMessage']",
    }

    registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.countPaginationRows,
        validate: function() {
            let count = $(selectors.countPaginationRows).val();
            if (count < 0) {
				return "The value cannot be less than 0";
            }
			return;
        }
    });

	registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.foundMessage,
        validate: function() {
            let fieldValue = $(selectors.foundMessage).val();
            if (!fieldValue.includes(" {} ")) {
                return "The value {} must be present in the message";
            }
			return;
        }
    });

    registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.errorMessageHexColor,
        validate: function() {
            let fieldValue = $(selectors.errorMessageHexColor).val();
            if (!fieldValue.startsWith(HEX_CODE_SYMBOL)) {
                return HEX_CODE_ERROR_MESSAGE;
            }
            return;
        }
    });

    registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.backgroundHexColor,
        validate: function() {
            let fieldValue = $(selectors.backgroundHexColor).val();
            if (!fieldValue.startsWith(HEX_CODE_SYMBOL)) {
                return HEX_CODE_ERROR_MESSAGE;
            }
            return;
        }
    });

    registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.pathToResource,
        validate: function() {
            let fieldValue = $(selectors.pathToResource).val();
            if (fieldValue.length <= 0) {
                return "Path cannot be empty";
            }
            return;
        }
    });

    registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.requestErrorMessage,
        validate: function() {
            let fieldValue = $(selectors.requestErrorMessage).val();
            if (fieldValue.length <= 0) {
                return "Path cannot be empty";
            }
            return;
        }
    });

    registry.register(FOUNDATION_VALIDATION_VALIDATOR, {
        selector: selectors.urlIsNotValidMessage,
        validate: function() {
            let fieldValue = $(selectors.urlIsNotValidMessage).val();
            if (fieldValue.length <= 0) {
                return "Path cannot be empty";
            }
            return;
        }
    });

})(jQuery, Coral);
