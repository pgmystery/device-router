class Rounector {
    constructor() {
        // this.url = 'http://192.168.1.10:5000'  // HOME
        this.url = 'http://172.16.100.80:5000'  // neuefische
        this.client = new SSHClient()
        this.data = {}
        this.afterUrlPromp = []

        // SET IP+PORT:
        dialogPrompt({
            title: 'IP:Port of the backend',
            label: 'http://',
            value: this.url.replace('http://', '')
        })
          .then(r => {
            if (r == null) {
                closeApp()
            }
            this.url = 'http://' + r
            this.afterUrlPromp.forEach(callback => callback())
          })
    }

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

    connect(host, showError=true) {
        return new Promise((resolve, reject) => {
            host.onError = err => {
                if (showError) {
                    showLoadingScreen(false)
                    dialog.showMessageBox(null, {
                        type: 'error',
                        title: 'Error!',
                        message: String(err),
                    })
                }
                reject(err)
            }
            host.onEnd = result => {
                resolve(result)
            }
            const SSH = new SSH2shell(host)
            SSH.connect()
        })
    }

    async connectShell(loginData) {
        return new Promise((resolve, reject) => {
            const conn = new SSHClient()
            conn.on('ready', function() {
                console.log('Client :: ready')
                conn.shell(function(err, stream) {
                    if (err) reject(err)
                    stream.on('close', function(code, signal) {
                      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                      conn.end()
                    })
                    resolve(stream)
                })
            }).connect(loginData)
        })
    }
}


 module.exports = Rounector
