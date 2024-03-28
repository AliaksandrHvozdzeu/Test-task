function sendRequest() {
    let inputSearch = $('#inputSearch').val();
    let hiddenPathToResource = $('#hiddenPathToResource').val();
    let hiddenRequestErrorMessage = $('#hiddenRequestErrorMessage').val();

    $.ajax({
        type: 'GET',
        url: '/bin/searchlinks',
        data: {
            "link": inputSearch,
            "path": hiddenPathToResource,
        },
        success: displayResults,
        error: function (xhr, status, error) {
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

    $table.append('<thead><tr><th scope="col" class="cmp--container__table-column-link">Link URL</th><th scope="col" class="cmp--container__table-column-path">Node path</th></tr></thead>');
    if (results && results.length > 0) {
        let numRows = results.length;
        let numPerPage = hiddenCountRows;
        let numPages = Math.ceil(numRows / numPerPage);
        let currentPage = 0;
        //Add rows to table
        for (let i = 0; i < numRows; i++) {
            let result = results[i];
            $table.append('<tr><td>' + result.link + '</td><td>' + result.path + '</td></tr>');
        }
        //Add paggination
        $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
        //Add pagination pages
        for (let page = 0; page < numPages; page++) {
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
        $('#messageText').text(hiddenFoundMessage);
    } else {
        //Show messages "Not found"
        $('#messageText').text(hiddenNotFoundMessage);
    }
}

function clearSearchField() {
    let inputSearch = $('#inputSearch');
    let submitButton = $('#submitButton');
    inputSearch.val("");
    setNotValidUrl();
    submitButton.prop("disabled", true).removeClass("cmp--container__submit-button").addClass("cmp--container__submit-button--disable");
}

function handleRequestError(errorMessage) {
    let notValidUrlLabel = $('#notValidUrlLabel');
    notValidUrlLabel.removeClass("disabled");
    notValidUrlLabel.text(errorMessage);
}


function urlValidate() {
    let inputSearch = $('#inputSearch');
    if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(inputSearch.val())) {
        setNotValidUrl();
    } else {
        setValidUrl();
    }
}

function setNotValidUrl() {
    let inputSearch = $('#inputSearch');
    let submitButton = $('#submitButton');
    let notValidUrlLabel = $('#notValidUrlLabel');
    let searchLinkLabel = $('#searchLinkLabel');
    let clearInputButton = $('#clearInputButton');

    submitButton.prop("disabled", false)
        .removeClass("cmp--container__submit-button--disable")
        .addClass("cmp--container__submit-button");

    notValidUrlLabel.addClass("disabled");
    inputSearch.removeClass("cmp--container__input--error");
    searchLinkLabel.removeClass("cmp--container__common-red-color");
    clearInputButton.attr('src', '/content/dam/task/svg/cancel_black.svg');
}

function setValidUrl() {
    let inputSearch = $('#inputSearch');
    let submitButton = $('#submitButton');
    let notValidUrlLabel = $('#notValidUrlLabel');
    let searchLinkLabel = $('#searchLinkLabel');
    let clearInputButton = $('#clearInputButton');

    submitButton.prop("disabled", true)
        .removeClass("cmp--container__submit-button")
        .addClass("cmp--container__submit-button--disable");

    notValidUrlLabel.removeClass("disabled");
    inputSearch.addClass("cmp--container__input--error");
    searchLinkLabel.addClass("cmp--container__common-red-color");
    clearInputButton.attr('src', '/content/dam/task/svg/cancel_red.svg');
}
