function sendRequest(path) {
    $.ajax({
        type: 'GET',
        url: '/bin/searchlinks',
        data: {
            'path': path
        },
        success: function (response) {
            console.log(response);
            displayResults(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function displayResults(results) {
    var $table = $('#paginatedTable');
    $table.empty(); // Clear existing content
    $table.append('<thead><tr><th scope="col">Link URL</th><th scope="col">Node path</th></tr></thead>');

    if (results && results.length > 0) {
        var numRows = results.length;
        var numPerPage = 10;
        var numPages = Math.ceil(numRows / numPerPage);
        var currentPage = 0;

        for (var i = 0; i < numRows; i++) {
            var result = results[i];
            $table.append('<tr><td>' + result.link + '</td><td>' + result.pagePath + '</td></tr>');
        }

        $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();

        var $pager = $('<div class="pager"></div>');
        for (var page = 0; page < numPages; page++) {
            $('<span class="page-number"></span>').text(page + 1).bind('click', { newPage: page }, function (event) {
                currentPage = event.data['newPage'];
                $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
                $(this).addClass('active').siblings().removeClass('active');
            }).appendTo($pager).addClass('clickable');
        }
        $pager.insertBefore($table).find('span.page-number:first').addClass('active');
    } else {
        $table.append('<tbody><tr><td colspan="2">No results found</td></tr></tbody>');
    }
}
