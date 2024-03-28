function sendRequest() {
    let inputForm = $('#inputForm').val();
    let hiddenPathToResource = $('#hiddenPathToResource').val();
    let hiddenRequestErrorMessage = $('#hiddenRequestErrorMessage').val();

    $.ajax({
        type: 'GET', url: '/bin/searchlinks', data: {
            "link": inputForm, "path": hiddenPathToResource,
        }, success: displayResults, error: function (xhr, status, error) {
            handleRequestError(hiddenRequestErrorMessage);
            console.error(error);
        }
    });
}

function displayResults(results) {
    let hiddenCountRows = $('#hiddenCountRows').val();
    let hiddenFoundMessage = $('#hiddenFoundMessage').val();
    let hiddenNotFoundMessage = $('#hiddenNotFoundMessage').val();
    let $table = $('#paginatedTable');
    let $pager = $('<div class="pager" id="pager"></div>');

    //Empty (clear) table for new results
    $table.empty();
    //Remove pagination for new results
    $('#pager').remove();

    $table.append('<thead><tr><th scope="col" class="lintColumnName">Link URL</th><th scope="col" class="pathColumnName">Node path</th></tr></thead>');
    if (results && results.length > 0) {
        var numRows = results.length;
        var numPerPage = hiddenCountRows;
        var numPages = Math.ceil(numRows / numPerPage);
        var currentPage = 0;
        //Add rows to table
        for (var i = 0; i < numRows; i++) {
            var result = results[i];
            $table.append('<tr><td>' + result.link + '</td><td>' + result.path + '</td></tr>');
        }
        //Add paggination
        $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
        //Add pagination pages
        for (var page = 0; page < numPages; page++) {
            $('<span class="page-number"></span>').text(page + 1).bind('click', {newPage: page}, function (event) {
                currentPage = event.data['newPage'];
                $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
                $(this).addClass('active').siblings().removeClass('active');
            }).appendTo($pager).addClass('clickable');
        }
        //Make pagination button as active
        $pager.insertAfter($table).find('span.page-number:first').addClass('active');
        //Show count of results
        hiddenFoundMessage = hiddenFoundMessage.replace('{}', results.length)
        console.log(hiddenFoundMessage);
        $('#messageValidation').text(hiddenFoundMessage);
    } else {
        //Show messages "Not found"
        $('#messageValidation').text(hiddenNotFoundMessage);
    }
}

function clearSearchField() {
    let inputForm = $('#inputForm');
    let submitButton = $('#submitButton');
    inputForm.val("");
    setNotValidUrl();
    submitButton.prop("disabled", true).removeClass("send-button").addClass("send-button-disabled");
}

function handleRequestError(errorMessage) {
    let notValidURL = $('#notValidURL');
    notValidURL.removeClass("disabled");
    notValidURL.text(errorMessage);
}


function urlValidate() {
    let inputForm = $('#inputForm');
    if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(inputForm.val())) {
        setNotValidUrl();
    } else {
        setValidUrl();
    }
}

function setNotValidUrl() {
    let inputForm = $('#inputForm');
    let submitButton = $('#submitButton');
    let notValidURL = $('#notValidURL');
    let searchLinkTitle = $('#searchLinkTitle');
    let clearFielImg = $('#clearFielImg');
    submitButton.prop("disabled", false).removeClass("send-button-disabled").addClass("send-button");
    notValidURL.addClass("disabled");
    inputForm.removeClass("inputNotValidField");
    searchLinkTitle.removeClass("urlNotValidConnonStyle");
    clearFielImg.attr('src', '/content/dam/task/svg/cancel_black.svg');
}

function setValidUrl() {
    let inputForm = $('#inputForm');
    let submitButton = $('#submitButton');
    let notValidURL = $('#notValidURL');
    let searchLinkTitle = $('#searchLinkTitle');
    let clearFielImg = $('#clearFielImg');
    submitButton.prop("disabled", true).removeClass("send-button").addClass("send-button-disabled");
    notValidURL.removeClass("disabled");
    inputForm.addClass("inputNotValidField");
    searchLinkTitle.addClass("urlNotValidConnonStyle");
    clearFielImg.attr('src', '/content/dam/task/svg/cancel_red.svg');
}
