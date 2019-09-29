/*
    TODO runtime process:

*/

const Rounector = {
    url: 'http://192.168.1.5:8000',
    // connection_data: {},

    request: new XMLHttpRequest(),
    client: new SSHClient(),
    client2: new SSHClient2(),

    // TODO PARAMETERS:
    //  - register_token
    //  - ssh_method
    //  - ssh_ip
    //  - ssh_port
    //  - ssh_username
    //  - ssh_password / ssh_key_passphrase
    //  - ssh_key_method
    //  - ssh_private_key
    //  - device_version
    //  - device_type
    //  - device_name
    //  - device_info_description
    //  - device_info_id
    data: {},
    rounection: function() {
        const steps = 10;

    // CHECK IF THE SERVER IS AVAILABLE:
        try {
            this.request.open('GET', this.url, false);
            this.request.send(null);
            if (this.request.status !== 200) {
                return false;
            }
        }
        catch (e) {
            console.log(e);
            dialog.showErrorBox('No connection to the webserver', 'Cloud not connect to the webserver!');
            return false;
        }

    // CONNECT TO THE SERVER WITH SSH:


        console.log("DONE!");
        return true;
    },

    connect: async function(loginData, cmd) {
        return await this.client2.connect(loginData)
            .then(() => {
                return this.client2.execCommand(cmd)
                    .then(result => {
                        if (result.stderr) {
                            return result.stderr;
                        }
                        return result.stdout;
                    });
            });
    }
};
