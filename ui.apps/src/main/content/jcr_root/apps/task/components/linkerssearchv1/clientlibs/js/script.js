function sendRequest(path) {
    let inputForm = $('#inputForm').val();
    let hiddenPathToResource = $('#hiddenPathToResource').val();

    $.ajax({
        type: 'GET',
        url: '/bin/searchlinks',
        data: {
            "link": inputForm,
            "path": hiddenPathToResource,
        },
        success: function (response) {
            displayResults(response);
        },
        error: function (xhr, status, error) {
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
            $('<span class="page-number"></span>').text(page + 1).bind('click', { newPage: page }, function (event) {
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
        $table.remove();
    }
}
