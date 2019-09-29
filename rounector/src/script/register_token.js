frameSites[0] = 'register_token';
frameFunctions['register_token'] = register_token_frame;

let register_token_data;

function register_token_frame() {
    document.getElementById('register_token_form').addEventListener('submit', e => {
        e.preventDefault();
        register_token_data = new FormData(document.getElementById('register_token_form'));
        Rounector.data['register_token'] = register_token_data.get('register_token_input');
        Rounector.data['device_info_description'] = register_token_data.get('register_token_description');
        loadFrameNext();
    });

    if (register_token_data) {
        document.getElementById('register_token_input').value = register_token_data.get('register_token_input');
        document.getElementById('register_token_description').value = register_token_data.get('register_token_description');
    }
}

loadFrame('register_token');
