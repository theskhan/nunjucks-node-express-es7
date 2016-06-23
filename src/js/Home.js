'use strict';

$(document).ready(function () {
    $("#loadpersons").click((async function () {
        let result = await client.get('http://localhost:8000/api/persons');

        if (app.debug)
            console.log(result);

        app.render($("#rendered"), 'includes/persons.html', { persons: result }, 'append');
    }));
});