frameSites[1]="device_finder",frameFunctions.device_finder=(()=>{}),loadFrame("device_finder");const device_finder_comboBox_device_name=document.getElementById("device_finder_device"),device_finder_comboBox_device_version=document.getElementById("device_finder_device_version");let device_finder_devices;function setDevices(){console.log("START_GETTING_DEVICES"),showLoadingScreen(!0),fetch(rounector.url+"/api/device/type").then(e=>e.json()).then(e=>{device_finder_devices=e,e.forEach(e=>addOptionItem(device_finder_comboBox_device_name,e.name)),showLoadingScreen(!1)}).catch(e=>{console.error(e),dialog.showMessageBox(null,{type:"error",title:"Error!",message:"Can not get the devices from server"},closeApp)})}rounector.afterUrlPromp.push(setDevices);const device_finder_form=document.getElementById("device_finder_form");function device_select_clear(e){e.innerHTML="",addOptionItem(e,"Choose automatically..."),e.disabled=!0}function addOptionItem(e,t){const o=document.createElement("option");o.text=t,e.add(o)}async function device_finder_start(){const e=device_finder_comboBox_device_name.selectedIndex,t=device_finder_comboBox_device_version.selectedIndex;if(0===e)return rounector.data.device_type=device_finder_devices,!0;{rounector.data.device_type=device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text;const e=device_finder_devices.find(e=>e.name===device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text);if(0===t)return rounector.data.device_version=e.version,!0;{const t=device_finder_comboBox_device_version.options[device_finder_comboBox_device_version.selectedIndex].text.replace(/\./g,"_");return rounector.data.device_version={[t]:e.version[t]},!0}}}function showLoadingScreen(e){const t=document.getElementById("loading_screen");t.classList.toggle("hide",!e),t.focus()}device_finder_form.addEventListener("submit",e=>{e.preventDefault(),device_finder_start().then(e=>{e&&loadFrameNext()}).catch(e=>{console.log("ERROR"),console.log(e)})}),document.getElementById("device_finder_back").addEventListener("click",()=>{loadFrameBack()}),device_finder_comboBox_device_name.addEventListener("change",()=>{if(device_select_clear(device_finder_comboBox_device_version),device_finder_comboBox_device_name.selectedIndex>0){const e=device_finder_devices.find(e=>e.name===device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text);Object.keys(e.version).forEach(e=>addOptionItem(device_finder_comboBox_device_version,e.replace(/_/g,"."))),device_finder_comboBox_device_version.options.length>1&&(device_finder_comboBox_device_version.disabled=!1)}}),document.getElementById("headerText").textContent="Rounector v"+appVersion.toUpperCase().replace("-"," "),document.getElementById("exit").addEventListener("click",e=>{e.preventDefault(),closeApp()}),frameSites[0]="register_token",frameFunctions.register_token=(()=>{}),loadFrame("register_token"),setActiveFrame("register_token"),document.getElementById("register_token_form").addEventListener("submit",e=>{e.preventDefault();const t=new FormData(document.getElementById("register_token_form"));register_token_data=Object.fromEntries(t),rounector.data={...rounector.data,...register_token_data},loadFrameNext()}),frameSites[3]="rounection",frameFunctions.rounection=startRounection,loadFrame("rounection");const progressbarSteps=7,rounection_status=document.getElementById("rounection_status"),rounection_progessBar=document.getElementById("rounection_progess"),rounection_progessBarLabel=document.getElementById("rounection_progess_label");let device_config;function startRounection(){document.getElementById("rounection_cancel").addEventListener("click",()=>{dialog.showMessageBox(null,{title:"Cancelled the installation",message:"Cancelled the installation"},()=>{closeApp()})}),getDeviceConfig().then(e=>{(device_config=e).info.description=rounector.data.device_info_description,device_config.info.type=rounector.data.device_type,device_config.info.version=rounector.data.device_version,device_config.auth.register_token=rounector.data.register_token,device_config.remote_host=rounector.url.replace("http://",""),writeFileSync(tempPath+"/config.json",JSON.stringify(device_config)),cancel=rounection()})}let checkMatchProgess,checkMatchPath,checkMatchCallback,holdConnectionExit,holdConnectionCallback,holdConnectionPromiseResolve,holdConnectionPromiseReject,progress="start";function setProgress(e,t=!0){if(rounection_status.textContent=e,t){rounection_progessBar.value=Number(rounection_progessBar.value)+1;const e=100*rounection_progessBar.value/progressbarSteps;rounection_progessBarLabel.textContent=Math.round(e)+" %"}}function rounection(){rounection_progessBar.max=progressbarSteps;const e={server:rounector.data.loginData,commands:["cd /tmp/","ls /tmp/match.tar"],onCommandComplete:function(e,t,o){switch(console.log("command",e),console.log("response",t),progress){case"start":"ls /tmp/match.tar"===e&&connectToDevice(e,t.split("\r\n"),o);break;case"checkMatch2":checkMatch2(e,t.split("\r\n"),o);break;case"downloadMatch":downloadMatch(e,t.split("\r\n"),o);break;case"checkMatch":checkMatch(e,t.split("\r\n"),o);break;case"unzipMatch":unzipMatch(e,t.split("\r\n"),o);break;case"startMatch2":startMatch2(e,t.split("\r\n"),o);break;case"cleanUp":cleanUp(e,t.split("\r\n"),o);break;case"holdConnection":holdConnection(e,t.split("\r\n"),o)}}};setProgress("Connect to device..."),rounector.connect(e)}function connectToDevice(e,t,o){let n=!0;t.forEach(e=>{"/tmp/match.tar"===e&&(setProgress("deleting old /tmp/match.tar",!1),progress="checkMatch2",o.commands.push("rm /tmp/match.tar"),n=!1)}),n&&(setProgress("downloading match-files..."),progress="downloadMatch",o.commands.push(`wget "${rounector.url}/api/match/download?type=${rounector.data.device_type}&version=${rounector.data.device_version.replace(/\./g,"_")}" -O match.tar`),o.commands.push('echo "download-done"'))}function checkMatch2(e,t,o){let n=!0;if("rm /tmp/match.tar"===e)return o.commands.push("ls /tmp/match.tar"),void(n=!1);"ls /tmp/match.tar"===e&&(t.forEach(e=>{"/tmp/match.tar"===e&&(progress="exit",setProgress('ERROR: Can\'t delete "/tmp/match.tar"',!1),n=!1,error('Can\'t delete "/tmp/match.tar"'))}),n&&(setProgress("downloading match-files..."),progress="downloadMatch",o.commands.push(`wget "${rounector.url}/api/match/download?type=${rounector.data.device_type}&version=${rounector.data.device_version.replace(/\./g,"_")}" -P /tmp/ -O match.tar`),o.commands.push('echo "download-done"')))}function downloadMatch(e,t,o){t.forEach(n=>{"download-done"===n&&checkMatch(e,t,o,{path:"/tmp/match.tar",callback:downloadMatch2})})}function downloadMatch2(e,t,o){setProgress("unpacking the match-files..."),progress="unzipMatch",o.commands.push("tar xfv /tmp/match.tar -C /tmp/"),o.commands.push('echo "unzip-done"')}function unzipMatch(e,t,o){t.forEach(e=>{"unzip-done"===e&&(setProgress("downloading the config..."),progress="startMatch",startHoldConnection(startMatch,o),uploadFile(rounector.data.loginData,tempPath+"/config.json","/tmp/match/match/config.json",runStartMatch))})}function runStartMatch(){holdConnectionExit=!0}function startMatch(e,t,o){setProgress("start match..."),progress="startMatch2",o.commands.push("python /tmp/match/setup.py"),o.commands.push('echo "MATCH-DONE"')}function startMatch2(e,t,o){t.forEach(e=>{e.toLowerCase().includes("permission denied")?(o.commands.push("sudo python /tmp/match/setup.py"),o.commands.push('echo "MATCH-DONE"')):"MATCH-DONE"===e&&(progress="cleanUp",setProgress("install APP..."),o.commands.push("rm /tmp/match.tar"),o.commands.push("rm -R /tmp/match"),o.commands.push('echo "CLEAN-UP-DONE"'))})}function cleanUp(e,t,o){t.forEach(e=>{"CLEAN-UP-DONE"===e&&(setProgress("Finish!"),progress="done",flashWindow(),dialog.showMessageBox(null,{title:"Done",message:"The installation was successfull!"},()=>{closeApp()}))})}function checkMatch(e,t,o,{path:n,callback:c}={}){if("checkMatch"!==progress)checkMatchProgess=progress,checkMatchPath=n,checkMatchCallback=c,progress="checkMatch",o.commands.push("ls "+n);else{progress=checkMatchProgess;let c=!1;t.forEach(n=>{n===checkMatchPath&&(c=!0,checkMatchCallback(e,t,o))}),c||error(`Can't find "${n}"`)}}function startHoldConnection(e,t){return holdConnectionExit=!1,holdConnectionCallback=e,new Promise((e,o)=>{holdConnectionPromiseResolve=e,holdConnectionPromiseReject=o,progress="holdConnection",holdConnection(void 0,void 0,t)})}function holdConnection(e,t,o){holdConnectionExit?holdConnectionCallback(e,t,o):o.commands.push("\0")}function uploadFile(e,t,o,n){const c=new SSHClient;c.on("ready",()=>{c.sftp((e,c)=>{if(e)throw e;const r=createReadStream(t),s=c.createWriteStream(o);s.on("close",()=>{console.log("- file transferred succesfully"),n()}),s.on("end",()=>{error("sftp connection closed")}),r.pipe(s)})}).connect(e)}function getDeviceConfig(){return fetch(rounector.url+`/api/match/config?type=${rounector.data.device_type}&version=${rounector.data.device_version.replace(/\./g,"_")}}`).then(e=>e.json())}function error(e){console.error(e),dialog.showMessageBox(null,{type:"error",title:"Error!",message:e},()=>{closeApp()})}async function start_connect(){showLoadingScreen(!0);const e=new FormData(document.querySelector("form")),t={},o=e.get("ip_type");rounector.data.ssh_method=o,"ipv4"===o?rounector.data.ssh_ip=e.get("ssh_ipv4"):"ipv6"===o&&(rounector.data.ssh_ip=e.get("ssh_ipv6")),t.host=rounector.data.ssh_ip,rounector.data.ssh_port=e.get("ssh_port"),rounector.data.ssh_username=e.get("ssh_username"),t.port=rounector.data.ssh_port,t.userName=rounector.data.ssh_username,t.username=rounector.data.ssh_username;const n=e.get("password_type");rounector.data.ssh_password=e.get("ssh_password"),"password"===n?(rounector.data.ssh_private_key="",t.password=rounector.data.ssh_password):"pkey"===n&&(rounector.data.ssh_private_key=e.get("key_path"),t.privateKey=readFileSync(rounector.data.ssh_private_key),t.passphrase=rounector.data.ssh_password,t.passPhrase=rounector.data.ssh_password),rounector.data.loginData=t;try{await check_device(t)?(showLoadingScreen(!1),loadFrameNext()):(showLoadingScreen(!1),alert("Connection denied..."))}catch(e){showLoadingScreen(!1),alert("Connection denied...")}}async function check_device(e){const t=rounector.data.device_type;if("object"==typeof t)for(let o=0;o<t.length;o++){const n=t[o],c=n.name;try{const t=await checkVersion(e,n.version);return rounector.data.device_type=c,rounector.data.device_version=t,!0}catch(e){}}else if("string"==typeof t){const t=rounector.data.device_version,o=Object.keys(t);for(let t=0;t<o.length;t++){const n=o[t];try{const t=await checkVersion(e,n);return rounector.data.device_version=t,!0}catch(e){}}}return!1}async function checkVersion(e,t){for(const[o,n]of Object.entries(t)){const t=n.cmd,c=n.validate,r={server:e,commands:[t]};if((await rounector.connect(r,!1)).includes(c))return o.replace(/_/g,".")}}frameSites[2]="ssh_connect",frameFunctions.ssh_connect=(()=>{}),loadFrame("ssh_connect"),document.getElementById("ssh_connect_back").addEventListener("click",()=>{loadFrameBack()}),document.getElementById("ipv4_radio").addEventListener("change",()=>{const e=document.getElementById("ssh_ipv4_address"),t=document.getElementById("ssh_ipv6_address");t.hidden=!0,e.hidden=!1,e.required=!0,t.required=!1,e.focus()}),document.getElementById("ipv6_radio").addEventListener("change",()=>{const e=document.getElementById("ssh_ipv4_address"),t=document.getElementById("ssh_ipv6_address");e.hidden=!0,t.hidden=!1,t.required=!0,e.required=!1,t.focus()}),document.getElementById("password_radio").addEventListener("change",()=>{const e=document.getElementById("ssh_password");document.getElementById("ssh_key_path").required=!1,document.getElementById("ssh_key").classList.add("hidden"),e.placeholder="SSH-Password",e.required=!0,e.focus()}),document.getElementById("pkey_radio").addEventListener("change",()=>{const e=document.getElementById("ssh_key_path"),t=document.getElementById("ssh_password");e.required=!0,document.getElementById("ssh_key").classList.remove("hidden"),t.placeholder="Private-Key password",t.required=!1,e.focus()}),document.getElementById("ssh_key_path_button").addEventListener("click",()=>{dialog.showOpenDialog({properties:["openFile"]},e=>{e.length>0&&(document.getElementById("ssh_key_path").value=e[0])})}),document.getElementById("ssh_connect_form").addEventListener("submit",e=>{e.preventDefault(),start_connect()});