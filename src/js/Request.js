'use strict';

class Request {
    get(url) {
        return new Promise((resolve, reject) => {
            $.get(url)
                .done(data => {
                    resolve(data);
                })
                .fail(err => {
                    reject(err.responseText);
                });
        });
    }
}

window.request = window.request || new Request();