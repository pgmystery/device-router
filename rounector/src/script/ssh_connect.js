frameSites[2] = 'ssh_connect'
frameFunctions['ssh_connect'] = () => {}

loadFrame('ssh_connect')


document.getElementById('ssh_connect_back').addEventListener('click', () => {
    loadFrameBack()
})

document.getElementById('ipv4_radio').addEventListener('change', () => {
    const ssh_ipv4_address = document.getElementById('ssh_ipv4_address')
    const ssh_ipv6_address = document.getElementById('ssh_ipv6_address')
    ssh_ipv6_address.hidden = true
    ssh_ipv4_address.hidden = false
    ssh_ipv4_address.required = true
    ssh_ipv6_address.required = false
    ssh_ipv4_address.focus()
})

document.getElementById('ipv6_radio').addEventListener('change', () => {
    const ssh_ipv4_address = document.getElementById('ssh_ipv4_address')
    const ssh_ipv6_address = document.getElementById('ssh_ipv6_address')
    ssh_ipv4_address.hidden = true
    ssh_ipv6_address.hidden = false
    ssh_ipv6_address.required = true
    ssh_ipv4_address.required = false
    ssh_ipv6_address.focus()
})

document.getElementById('password_radio').addEventListener('change', () => {
    const ssh_password = document.getElementById('ssh_password')
    document.getElementById('ssh_key_path').required = false
    document.getElementById('ssh_key').classList.add('hidden')
    ssh_password.placeholder = 'SSH-Password'
    ssh_password.required = true
    ssh_password.focus()
})

document.getElementById('pkey_radio').addEventListener('change', () => {
    const ssh_key_path = document.getElementById('ssh_key_path')
    const ssh_password = document.getElementById('ssh_password')
    ssh_key_path.required = true
    document.getElementById('ssh_key').classList.remove('hidden')
    ssh_password.placeholder = 'Private-Key password'
    ssh_password.required = false
    ssh_key_path.focus()
})

document.getElementById('ssh_key_path_button').addEventListener('click', () => {
    dialog.showOpenDialog({
            properties: ['openFile']
        },
        result => {
            if (result.length > 0) {
                document.getElementById('ssh_key_path').value = result[0]
            }
        })
})

document.getElementById('ssh_connect_form').addEventListener('submit', e => {
    e.preventDefault()
    start_connect()
})

async function start_connect() {
    showLoadingScreen(true)
    const ssh_connect_data = new FormData(document.querySelector('form'))
    const loginData = {}
    const ip_type = ssh_connect_data.get('ip_type')
    rounector.data['ssh_method'] = ip_type
    if (ip_type === 'ipv4') {
        rounector.data['ssh_ip'] = ssh_connect_data.get('ssh_ipv4')
    } else if (ip_type === 'ipv6') {
        rounector.data['ssh_ip'] = ssh_connect_data.get('ssh_ipv6')
    }
    loginData.host = rounector.data['ssh_ip']

    rounector.data['ssh_port'] = ssh_connect_data.get('ssh_port')
    rounector.data['ssh_username'] = ssh_connect_data.get('ssh_username')
    loginData.port = rounector.data['ssh_port']
    loginData.userName = rounector.data['ssh_username']
    loginData.username = rounector.data['ssh_username']

    const password_type = ssh_connect_data.get('password_type')
    rounector.data['ssh_password'] = ssh_connect_data.get('ssh_password')
    if (password_type === 'password') {
        rounector.data['ssh_private_key'] = ''
        loginData.password = rounector.data['ssh_password']
    } else if (password_type === 'pkey') {
        rounector.data['ssh_private_key'] = ssh_connect_data.get('key_path')
        loginData.privateKey = readFileSync(rounector.data['ssh_private_key'])
        loginData.passphrase = rounector.data['ssh_password']
        loginData.passPhrase = rounector.data['ssh_password']
    }
    rounector.data['loginData'] = loginData
    try {
        const status = await check_device(loginData)
        if (status) {
            showLoadingScreen(false)
            loadFrameNext()
        }
        else {
            showLoadingScreen(false)
            alert('Connection denied...')
        }
    }
    catch(err) {
        showLoadingScreen(false)
        alert('Connection denied...')
    }
}

async function check_device(loginData) {
    const device_type = rounector.data['device_type']
    if (typeof device_type === 'object') {
        for (let i=0; i < device_type.length; i++) {
            const device = device_type[i]
            const device_name = device.name
            try {
                const device_version = await checkVersion(loginData, device.version)
                rounector.data['device_type'] = device_name
                rounector.data['device_version'] = device_version
                return true
            }
            catch(err) {}
        }
    }
    else if (typeof device_type === 'string') {
        const device_versions = rounector.data['device_version']
        const device_versions_keys = Object.keys(device_versions)
        for (let i=0; i < device_versions_keys.length; i++) {
            const version = device_versions_keys[i]
            try {
                const device_version = await checkVersion(loginData, version)
                rounector.data['device_version'] = device_version
                return true
            }
            catch(err) {}
        }
    }
    return false
}

async function checkVersion(loginData, device_versions) {
    for (const [version, cmdObject] of Object.entries(device_versions)) {
        const cmd = cmdObject.cmd
        const validateString = cmdObject.validate
        const host = {
            server: loginData,
            commands: [ cmd ]
        }
        const result = await rounector.connect(host, false)
        if (result.includes(validateString)) {
            return version.replace(/_/g, '.')
        }
    }
}
