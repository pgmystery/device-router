frameSites[2] = 'ssh_connect';
frameFunctions['ssh_connect'] = ssh_connect;

let ssh_connect_data;

function ssh_connect() {
    document.getElementById('ssh_connect_back').addEventListener('click', () => {
        device_finder_data = new FormData(document.querySelector('form'));
        loadFrameBack();
    });

    document.getElementById('ipv4_radio').addEventListener('change', () => {
        const ssh_ipv4_address = document.getElementById('ssh_ipv4_address');
        const ssh_ipv6_address = document.getElementById('ssh_ipv6_address');
        ssh_ipv6_address.hidden = true;
        ssh_ipv4_address.hidden = false;
        ssh_ipv4_address.required = true;
        ssh_ipv6_address.required = false;
        ssh_ipv4_address.focus();
    });

    document.getElementById('ipv6_radio').addEventListener('change', () => {
        const ssh_ipv4_address = document.getElementById('ssh_ipv4_address');
        const ssh_ipv6_address = document.getElementById('ssh_ipv6_address');
        ssh_ipv4_address.hidden = true;
        ssh_ipv6_address.hidden = false;
        ssh_ipv6_address.required = true;
        ssh_ipv4_address.required = false;
        ssh_ipv6_address.focus();
    });

    document.getElementById('password_radio').addEventListener('change', () => {
        const ssh_password = document.getElementById('ssh_password');
        document.getElementById('ssh_key_path').required = false;
        document.getElementById('ssh_key').classList.add('hidden');
        ssh_password.placeholder = 'SSH-Password';
        ssh_password.focus();
    });

    document.getElementById('pkey_radio').addEventListener('change', () => {
        const ssh_key_path = document.getElementById('ssh_key_path');
        ssh_key_path.required = true;
        document.getElementById('ssh_key').classList.remove('hidden');
        document.getElementById('ssh_password').placeholder = 'Private-Key password';
        ssh_key_path.focus();
    });

    document.getElementById('ssh_key_path_button').addEventListener('click', () => {
        dialog.showOpenDialog({
                properties: ['openFile']
            },
            result => {
                if (result) {
                    document.getElementById('ssh_key_path').value = result[0];
                }
            });
    });

    document.getElementById('ssh_connect_form').addEventListener('submit', e => {
        e.preventDefault();
        start_connect();
        // loadFrameNext();
    });

    function start_connect() {
        ssh_connect_data = new FormData(document.querySelector('form'));
        // console.log(ssh_connect_data);
        // for (var pair of ssh_connect_data.entries()) {
        //    console.log(pair[0]+ ', '+ pair[1]);
        // }
        // TODO: LOADING_SCREEN
        const loginData = {};
        const ip_type = ssh_connect_data.get('ip_type');
        Rounector.data['ssh_method'] = ip_type;
        if (ip_type === 'ipv4') {
            Rounector.data['ssh_ip'] = ssh_connect_data.get('ssh_ipv4');
        } else if (ip_type === 'ipv6') {
            Rounector.data['ssh_ip'] = ssh_connect_data.get('ssh_ipv6');
        }
        loginData.host = Rounector.data['ssh_ip'];

        Rounector.data['ssh_port'] = ssh_connect_data.get('ssh_port');
        Rounector.data['ssh_username'] = ssh_connect_data.get('ssh_username');
        loginData.port = Rounector.data['ssh_port'];
        loginData.username = Rounector.data['ssh_username'];

        const password_type = ssh_connect_data.get('password_type');
        Rounector.data['ssh_password'] = ssh_connect_data.get('ssh_password');
        if (password_type === 'password') {
            Rounector.data['ssh_private_key'] = '';
            loginData.password = Rounector.data['ssh_password'];
        } else if (password_type === 'pkey') {
            Rounector.data['ssh_private_key'] = ssh_connect_data.get('key_path');
            loginData.privateKey = Rounector.data['ssh_private_key'];
            loginData.passphrase = Rounector.data['ssh_password'];
        }
        check_device(loginData);
    }

    function check_device(loginData) {
        for (const [device_type, device_type_devices] of Object.entries(Rounector.data["device_type"])) {
            for (const [device_name, device_name_versions] of Object.entries(device_type_devices)) {
                for (const [device_version, device_command] of Object.entries(device_name_versions)) {
                    if (check_connection(device_command)) {
                        return [device_type, device_name, device_version]
                    }
                }
            }
        }
    }

    async function check_connection(cmd) {
        try {
            if (!Rounector.data['ssh_private_key']) {
                await Rounector.connect(loginData, cmd)
                    .then(
                        result => {
                            console.log("RESULT BEGIN");
                            console.log(result);
                            console.log("RESULT END");
                            check_device(result);
                        }
                    );
            }
        } catch (e) {
            console.log(e);
        }
    }
}

// ip_type, ipv4
// ssh_ipv4, 192.168.1.1
// ssh_ipv6,
// ssh_port, 22
// ssh_username, vyos
// password_type, password
// key_type, rsa
// key_path,
// ssh_password, vyos