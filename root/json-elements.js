export function loadJSONRunFunc(cursorsJSONUrl, jsonFunc) {
    fetch(cursorsJSONUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            jsonFunc(data);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
};