var toggleSpinner = function() {
                var spinner = document.getElementById('spinner');
                if (!spinner) {
                    spinner = document.createElement('img');
                    spinner.setAttribute('src', location.origin + '/_utils/image/spinner.gif');
                    spinner.setAttribute('id', 'spinner');
                    spinner.setAttribute('style', 'display: show');
                    document.body.getElementsByTagName('div')[2].appendChild(spinner);
                } else {
                    if (spinner.getAttribute('style').indexOf('none') == -1) {
                        spinner.setAttribute('style', 'display: none');
                    } else {
                        spinner.setAttribute('style', 'display: show');
                    }
                }
            };
