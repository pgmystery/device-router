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
              if (r !== null) {
                  this.url = 'http://' + r
              }
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
    rounection() {
        const steps = 10

    // CHECK IF THE SERVER IS AVAILABLE:
        try {
            this.request.open('GET', this.url, false)
            this.request.send(null)
            if (this.request.status !== 200) {
                return false
            }
        }
        catch (e) {
            console.log(e)
            dialog.showErrorBox('No connection to the webserver', 'Could not connect to the webserver!')
            return false
        }
        console.log("DONE!")
        return true
    }

    connect(host, callback) {
        const SSH = new SSH2shell(host)
        SSH.connect(callback)
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
