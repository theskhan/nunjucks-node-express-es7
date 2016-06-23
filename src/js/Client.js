'use strict';

class Client {
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

window.client = window.client || new Client();