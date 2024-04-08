const os = require('node:os')


//Atividade01:
// console.log(os.type())
// console.log(os.arch())

//Atividade02:
// console.log(os.cpus())

//Atividade03:
// console.log(os.freemem())
// console.log(os.totalmem()/1000000000)

//Atividade04:
// console.log(os.userInfo().username)
// console.log(os.userInfo().homedir)

//Atividade05:
// console.log(os.type())
// console.log(os.release())
// console.log(os.platform())

//Atividade06:
console.log(`IPV4 : ${Object.values(os.networkInterfaces())[0].flat()[0].address}`)
console.log(`IPV6 : ${Object.values(os.networkInterfaces())[0].flat()[1].address}`)
console.log(`Segundos: ${os.uptime()}`)
console.log(`Minutos: ${os.uptime() / 60}`)
console.log(`Horas: ${os.uptime() / 3600}`)
console.log(os.tmpdir())