console.log(process.argv)

const argv = process.argv.slice(2)
console.log(argv)

const nome = argv[0].split('=')[1] // = nome=carlos
console.log(nome)

const idade = argv[1].split('=')[1] // = age=17
console.log(idade)
console.log(`O nome ${nome} e aidade ${idade} anos`) //os dois