(function (window, $) {

    "use strict";

    let FOUNDATION_VALIDATION_VALIDATOR = "foundation.validation.validator";
    let registry = $(window).adaptTo("foundation-registry");
    let selectors = {
        countPaginationRows: "[name='./countPaginationRows']",
        foundMessage: "[name='./foundMessage']",
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

})(window, Granite.$);
