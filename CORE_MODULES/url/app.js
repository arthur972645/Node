const url = require('url')
const adress = 'https://www.meusite.com.br/catalog?produtos=cadeira'
const parseUrl = new url.URL(adress)

//mpstrar  dominio
console.log(parseUrl.host)
//mostra o camingo
console.log(parseUrl.pathname)
//mostra os paramentros
console.log(parseUrl.search)
//mostra o parametro e o que ta realcionado
console.log(parseUrl.searchParams)
//retorna somente o que o que ta relacionado
console.log(parseUrl.searchParams.get('produtos'))