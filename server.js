// CARREGA O MODULO 'express' E EXECUTA.
const { Console } = require('console');
const express = require('express');
const app = express();

// CARREGA O MODULO 'fs' PARA TRATAMENDO DE ARQUIVOS
const fs = require('fs');
const { parse } = require('path');


// CONFIGURAÇÃO DO EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('.'));

// DIRETORIO DO SISTEMA
const PATH_DIR = "./";

// FUNÇÃO PARA LER ARQUIVOS E RETORNAR SEU CONTEÚDO - OK
/*
    Função para ler dados no arquivo.
    Retorna uma Promise.then(dados do arquivo no formato JSON).catch(erro)
    readFile(  
            _dir = nome do diretorio,
            _name = nome do arquivo com extenção ex:(".txt"),
            ) 
*/
function readFile(_dir, _file) {
    return new Promise((resolve, reject) => {
        fs.readFile(_dir + _file, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(`| ReadFile: '${_file}' - OK`);
                resolve(JSON.parse(data));
            }
        })
    })
}

/*
    Função para gravar dados no formato JSON.
    Retorna uma Promise.then(dados do arquivo no formato JSON).catch(erro)
    writeFile(  
            _dir = nome do diretorio,
            _name = nome do arquivo com extenção ex:(".txt"),
            _data = dados para ser gravado no formato JSON em texto (JSON.stringify)
            )            
*/
function writeFile(_dir, _file, _data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(_dir + _file, _data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();

            }
        })
    })
}

/*
    Função para gravar log em arquivo.
    A função não sobrescreve o conteúdo existente.
    A função faz um append no arquivo.
    writeLog(
            _dir  = diretorio onde está o arquivo,
            _file = nome do arquivo com extenção ex:(".txt"),
            _data = dados que será gravado no arquivo
            )
*/
function writeLog(_dir, _file, _data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(_dir + _file, _data, { encoding: 'utf-8', flag: 'w' }, (err) => {
            if (err) {
                reject('{"writeFile":"ERROR"}');
            } else {
                resolve('{"writeFile":"OK"}');
            }
        })
    })
}

/*
    Verifica se o usuário está "logado".
    Verifica a ultima vez que o usuário intaragiu com a página.
    Se a ultima vez que o usuário interagiu com a página for maior que 1h ele pede o login novamente.
*/
function userCheck(_user, _type = 'check') {
    let userVerific = _user;
    let typeVerific = _type;


    return new Promise(async (resolve, reject) => {
        try {
            let usersLoged = await readFile(PATH_DIR, 'loged.json');
            let userLoginChecked;
            let userLoginCheckPosition = 0;

            if (typeVerific == 'check') {
                console.log("| Checando usuário logado");
                console.log("| Usuario a ser checado : ", userVerific);

                for (l of usersLoged) {
                    if (l.id == userVerific) {
                        if (parseInt((Date.now() - parseInt(l.time)) / 1000) <= 3600) {
                            
                            for (u in usersLoged) {
                                if (usersLoged[u].id == userVerific) {
                                    console.log("| Usuário logado encontrado: ", l)
                                    console.log("| Ultima verificação: ", ((Date.now() - parseInt(l.time)) / 1000),"segundos");
                                    usersLoged[u].key = (Math.random() * 9999999) + ((Math.random() * 9) + 10000000);
                                    usersLoged[u].time = Date.now();
                                    userLoginChecked = usersLoged[u];
                                    break;
                                }
                            }
                            break;

                        } else {
                            console.log("| Usuário com o login expirado por inatividade longa - FIM");
                            reject(false)
                            break;
                        }
                    }
                    userLoginCheckPosition++;
                }

                if (usersLoged.length == userLoginCheckPosition) {
                    console.log("| Usuário não logado anteriormente");
                    reject(false)

                } else if (userLoginChecked != undefined){
                    writeFile(PATH_DIR, 'loged.json', JSON.stringify(usersLoged))
                        .then(() => {
                            console.log("| Atualizando KEY:  ", userLoginChecked.key);
                            console.log("| Atualizando TIME: ", userLoginChecked.time);
                            resolve(userLoginChecked)
                        })
                        .catch((_err) => {
                            console.log("| ERRO AO GRAVAR O REGISTRO: ", _err);
                            reject(false)
                        })
                }

            } else if (typeVerific == 'login') {
                console.log("| Registrando login");
                console.log("| Usuario para registrar ID: " + userVerific );

                for (l of usersLoged) {
                    if (l.id == userVerific) {
                        console.log("| Ultimo login: " + ((Date.now() - parseInt(l.time)) / 1000) + " segundos");
                        for (u in usersLoged) {
                            if (usersLoged[u].id == userVerific) {
                                usersLoged[u].key = (Math.random() * 9999999) + ((Math.random() * 9) + 10000000);
                                usersLoged[u].time = Date.now();
                                userLoginChecked = usersLoged[u];
                                break;
                            }
                        }
                        break;
                    }
                    userLoginCheckPosition++;
                }

                if (usersLoged.length == userLoginCheckPosition) {
                    usersLoged.push({"id":userVerific,"key":(Math.random() * 9999999) + ((Math.random() * 9) + 10000000),"time":Date.now()})
                    console.log("| Usuário não registrado anteriormente");

                    await writeFile(PATH_DIR, 'loged.json', JSON.stringify(usersLoged))
                        .then(() => {
                            console.log("| Atualizando KEY: " + usersLoged[usersLoged.length -1].key);
                            console.log("| Atualizando TIME: " + usersLoged[usersLoged.length -1].time);
                            resolve(usersLoged[usersLoged.length -1])
                        })
                        .catch((_err) => {
                            console.log("| ERRO: " + _err);
                            reject(false)
                        })
                    reject(false)

                } else {
                    await writeFile(PATH_DIR, 'loged.json', JSON.stringify(usersLoged))
                        .then(() => {
                            console.log("| Atualizando KEY: " + userLoginChecked.key);
                            console.log("| Atualizando TIME: " + userLoginChecked.time);
                            resolve(userLoginChecked)
                        })
                        .catch((_err) => {
                            console.log("| 2 ERRO: " + _err);
                            reject(false)
                        })
                }

            }
        } catch (error) {
            console.log("ERRO NO ULTIMO")
            console.log(error)
            reject(false)
        }

    })
}

function userPasswordCheck(_user) {
    console.log("| Validação do login")
    return new Promise((resolve, reject) => {
        fs.readFile('users.json', 'utf-8', (err, data) => {
            if (err) {
                console.log("| ReadFile erro: 'users.json'");
                reject(false);
            } else {
                console.log("| ReadFile: 'users.json' - OK");
                let userListJSONPosition = 0;
                userListJSON = JSON.parse(data);
                for (u of userListJSON) {
                    if (u.user == _user.user && _user.user != "" && u.password == _user.password) {
                        console.log("| Usuário encontrado - OK: "+ JSON.stringify(u));
                        delete u.password;
                        delete u.email;
                        delete u.phone;
                        resolve(u);
                        break;
                    }
                    userListJSONPosition++;
                }
                if (userListJSONPosition == userListJSON.length) {
                    console.log("| Usuario não encotrado")
                    reject(false)
                }
            }
        })
    })
}

function getElementById(_id,_type){
    let element;

    if(_type == "user"){};


}











// ROTA PARA FAZER UPDATE DO USUÁRIO - OK
app.put('/update', (req, res) => {
    let userJsonUpdateData = req.body;
    console.log(userJsonUpdateData);

    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO ALTERAÇÃO DE DADOS DO USUÁRIO   |");
    console.log("| Informações do usuario para alterar: " + JSON.stringify(userJsonUpdateData));

    new Promise((resolve, reject) => {
        console.log("| Start Promise")

        fs.readFile('users.json', 'utf-8', (err, data) => {

            if (err) {
                console.log("| READ FILE - ERRO: " + err);
                reject();

            } else {
                console.log("| ReadFile: 'users.json' - OK");
                let userListJSON = JSON.parse(data);
                let userListJSONPosition = 0;

                for (u in userListJSON) {
                    if (userListJSON[u].id == userJsonUpdateData.id) {
                        console.log("| Usuario encontrado: " + JSON.stringify(userListJSON[u]));
                        userListJSON[u].user = userJsonUpdateData.user;
                        userListJSON[u].email = userJsonUpdateData.email;
                        userListJSON[u].phone = userJsonUpdateData.phone;
                        console.log("| Dados do usuario alterado : " + JSON.stringify(userListJSON[u]));
                        resolve(userListJSON)
                        break;
                    }
                    userListJSONPosition++
                };

                if (userListJSONPosition == userListJSON.length) {
                    console.log("| Erro usuário não encontrado");
                    reject();
                }
            }
        })

    }).then((_data) => {

        fs.writeFile('users.json', JSON.stringify(_data), (err) => {

            if (err) {

                fs.appendFile('log.txt', `${new Date().toLocaleString()} > UPDATE USER    ->  READ FILE:'users.json'  ->  ERRO CODE: ${err.code}${'\n'}`, (err) => {
                    err ? console.log(`| ${new Date().toLocaleString()} > READ FILE:'log.txt' > ERRO:${err.code}`) : "";
                })

                console.log("| WriteFile: ERRO: " + err);
                console.log("| USUARIO NÃO ALTERADO - FIM                  |");
                console.log("|_____________________________________________|");
                reject();

            } else {
                console.log("| Dados do usuario alterado com sucesso");
                console.log("| USUÁRIO ALTERADO - FIM                      |");
                console.log("|_____________________________________________|");
                res.send('{"UPDATE":"OK"}');
            }

        })
    }).catch(() => {
        console.log("| USUARIO NÃO ALTERADO - FIM                  |");
        console.log("|_____________________________________________|");

        res.status(500).json({ "UPDATE": "NÃO FOI POSSIVEL ATUALIZAR" })
    })

});
// ROTA PARA DELETAR UM USUÁRIO ESPECIFICO - OK
app.delete('/delete/:type/:id', function (req, res) {
    let deleteId = req.params.id;
    let deleteType = req.params.type;
    console.log(deleteId)
    console.log(deleteType)

    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE DELETAR           |");
    console.log("| Deletar tipo:" + deleteType);
    console.log("| Deletar id:" + deleteId);

    new Promise((resolve, reject) => {
        console.log("| Promisse Iniciada");

        if (deleteType == "user") {

            fs.readFile('users.json', 'utf-8', (err, data) => {

                if (err) {
                    console.log("| READ FILE - ERRO: " + err);
                    reject("USUÁRIO NÃO EXCLUIDO - ERRO INTERNO");

                } else {
                    console.log("| ReadFile: 'users.json' - OK");
                    let userListJSON = JSON.parse(data);
                    let userListJSONPosition = 0;

                    for (u of userListJSON) {
                        if (u.id == deleteId) {
                            console.log("| ReadFile: User encontrado: " + JSON.stringify(u));
                            userListJSON.splice(userListJSONPosition, 1);
                            resolve(JSON.parse(`[{"type":"user"},${JSON.stringify(userListJSON)}]`));
                            break;
                        }
                        userListJSONPosition++;
                    }

                    if (userListJSONPosition == userListJSON.length) {
                        reject("ERRO ID DO USUARIO NÃO EXISTE");
                    }
                }
            })

        } else if (deleteType == "category") {


            fs.readFile('categories.json', 'utf-8', (err, data) => {
                if (err) {
                    console.log("| READ FILE - ERRO: " + err);
                    reject("CATEGORIA NÃO EXCLUIDA - ERRO INTERNO");
                } else {
                    console.log("| ReadFile: 'categories.json' - OK");
                    let categoryListJSON = JSON.parse(data);
                    let categoryListJSONPosition = 0;
                    for (u of categoryListJSON) {
                        if (u.id == deleteId) {
                            console.log("| ReadFile: Categoria encontrada: " + JSON.stringify(u));
                            categoryListJSON.splice(categoryListJSONPosition, 1);
                            resolve(JSON.parse(`[{"type":"category"},${JSON.stringify(categoryListJSON)}]`));
                            break;
                        }
                        categoryListJSONPosition++;
                    }
                    if (categoryListJSONPosition == categoryListJSON.length) {
                        reject("ERRO ID DA CATEGORIA NÃO EXISTE");
                    }
                }
            })

        }


    }).then((_data) => {

        if (_data[0].type == "user") {

            fs.writeFile('users.json', JSON.stringify(_data[1]), (err) => {
                if (err) {
                    console.log("| WriteFile: ERRO: " + err);
                    console.log("| USUARIO NÃO DELETADO - FIM       |");
                    console.log("|__________________________________|");
                    fs.appendFile('log.txt', `${new Date().toLocaleString()} > DELETE USER    ->  WRITE FILE:'users.json'  ->  ERRO CODE: ${err.code}${'\n'}`, (err) => {
                        if (err) {
                            console.log(`| ${new Date().toLocaleString()} > WRITE FILE:'log.txt.json' > ERRO:${err.code}`);
                        }
                    })
                    res.send('{"DELETE":"USUARIO_NÃO_DELETADO_ERRO_INTERNO"}');
                } else {
                    console.log("| Usuario deletado com sucesso");
                    console.log("| USUARIO DELETADO - FIM           |");
                    console.log("|__________________________________|");
                    res.send('{"DELETE":"USUARIO_DELETADO_OK"}');
                }
            })

        } else if (_data[0].type == "category") {

            fs.writeFile('categories.json', JSON.stringify(_data[1]), (err) => {
                if (err) {
                    console.log("| WriteFile: ERRO: " + err);
                    console.log("| CATEGORIA NÃO DELETADO - FIM     |");
                    console.log("|__________________________________|");
                    fs.appendFile('log.txt', `${new Date().toLocaleString()} > DELETE CATEGORY->  WRITE FILE:'categories.json'  ->  ERRO CODE: ${err.code}${'\n'}`, (err) => {
                        if (err) {
                            console.log(`| ${new Date().toLocaleString()} > WRITE FILE:'log.txt.json' > ERRO:${err.code}`);
                        }
                    })
                    res.status(500).json(`{"DELETE": "CATEGORIA NÃO DELETADO ERRO INTERNO"`);
                } else {
                    console.log("| Categoria deletada com sucesso");
                    console.log("| CATEGORIA DELETADA - FIM         |");
                    console.log("|__________________________________|");
                    res.send('{"DELETE":"CATEGORIA DELETADA - OK"}');
                }
            })

        }


    }).catch((_err) => {
        console.log("| NÃO DELETADO - FIM               |");
        console.log("|__________________________________|");
        res.status(500).json(`{"DELETE": "${_err}"`);
    })

})


















// LOGIN DO USUÁRIO - OK - 04/07
app.post('/login', async function (req, res) {
    let autentication = req.body;
    let loginValidate = -1;
    let registerLogedUser = -1;

    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE LOGIN                        |");
    console.log("| Usuario a logar: ", autentication);

    try {
        loginValidate = await userPasswordCheck(autentication);
        console.log("| Usuário validado : ", loginValidate);
        registerLogedUser = await userCheck(loginValidate.id, 'login');
        console.log("| Usuário registrado : ", registerLogedUser);
    } catch (error) {
        console.log("| Erro: Erro ao efetuar o login");

    }

    if(typeof loginValidate == 'object'  && typeof registerLogedUser == 'object'){
        console.log("| Login realizado com sucesso");
        console.log("| USUÁRIO LOGADO - FIM                    |");
        console.log("|_________________________________________|");
        res.send(JSON.stringify(registerLogedUser));

    }else{
        console.log("| USUARIO NÃO EFETUOU LOGIN - FIM         |");
        console.log("|_________________________________________|");
        res.status(500).send(`{"LOGIN":"ERRO AO FAZER LOGIN"}`);
    }

})




// REGISTRANDO USUÁRIOS - OK - 30/06
app.post('/register/user', function (req, res) {
    let userRegister = req.body;
    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE REGISTRO                 |");
    console.log("| Dados para registrar : " + JSON.stringify(userRegister));
    new Promise((resolve, reject) => {
        console.log("| Promise Iniciada");
        readFile(PATH_DIR, "users.json")
            .then((_data) => {
                console.log(`| ReadFile: 'users.json' - OK`);
                console.log("| Total de registros : " + _data.length);
                userList = _data;
                let userListPosition = 0;
                for (u of userList) {
                    if (u.user == userRegister.user && userRegister.user != "") {
                        console.log("| Nome do usuário ja registrado : " + u.user);
                        reject("NOME JÁ REGISTRADO");
                        break;
                    } else if (u.email == userRegister.email && userRegister.email != "") {
                        console.log("| E-mail do usuário ja registrado : " + u.email);
                        reject("EMAIL JÁ REGISTRADO");
                        break;
                    }
                    userListPosition++;
                }
                if (userListPosition == userList.length) {
                    console.log("| Registro não encontrado");
                    userList[userList.length - 1] == undefined ? userRegister.id = 1 : userRegister.id = userList[userList.length - 1].id + 1;
                    console.log("| Registro: " + JSON.stringify(userRegister));
                    userList.push(userRegister);
                    resolve(userList);
                }

            })
            .catch((_err) => {
                console.log("| ReadFile: ERRO: " + _err)
                console.log("| NÃO REGISTRADO - FIM                    |");
                console.log("|_________________________________________|");
                res.status(500).send(`{"register":"${_err}"}`);
            })
    }).then((_data) => {
        writeFile(PATH_DIR, "users.json", JSON.stringify(_data))
            .then(() => {
                console.log("| Registro realizado com sucesso");
                console.log("| REGISTRADO - FIM                        |");
                console.log("|_________________________________________|");
                res.send('{"register":"REGISTRADO COM SUCESSO"}')
            })
            .catch((_err) => {
                console.log("| WriteFile: ERRO: " + _err.message);
                console.log("| Não foi possivel efetuar o registro");
                console.log("| NÃO REGISTRADO - FIM                    |");
                console.log("|_________________________________________|");
                res.status(500).send(`{"register":"NÃO REGISTRADO - ERRO INTERNO"}`);
            })
    }).catch((_err) => {
        console.log("| WriteFile: ERRO: " + _err);
        console.log("| Não foi possivel efetuar o registro");
        console.log("| NÃO REGISTRADO - FIM                    |");
        console.log("|_________________________________________|");
        res.status(500).send(`{"register":"NÃO REGISTRADO - ERRO INTERNO"}`);
    })
})
// EXIBINDO TODAS DESPESAS - OK - 04-07
app.get('/query/expenses/user/:id', async function (req, res) {
    let userId = req.params.id;
    let userCheckDados = false;
    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE DADOS                    |");
    console.log("| Solicitação expenses: Usuário: " + userId);

    try {
        userCheckDados = await userCheck(userId);
        console.log(userCheckDados)
    } catch (_err) {
        console.log("| ERRO: ERRO INTERNO");
    }

    if (userCheckDados) {
        readFile(PATH_DIR, `expenses.json`)
            .then((_data) => {
                let dados = _data.filter((expense) => {
                    if ((expense.user_id == 0 || expense.user_id == userId) && expense.deleted == false) {
                        return expense;
                    }
                })
                console.log("| SOLICITAÇÃO ENVIADA - FIM               |");
                console.log("|_________________________________________|");
                
                res.send(`[${JSON.stringify(userCheckDados)},${JSON.stringify(dados)}]`);
            })
            .catch((_err) => {
                console.log("| ReadFile: ERRO: " + _err)
                console.log("| NÃO FOI POSSIVEL LER O ARQUIVO - FIM    |");
                console.log("|_________________________________________|");
                res.status(500).send('{"CONSULTA":"LISTA_NÃO_DISPONIVEL_ERRO_INTERNO"}');
            })

    } else {
        console.log("| ERRO - FIM                              |");
        console.log("|_________________________________________|");
        res.status(500).send('{"CONSULTA":"LISTA NÃO DISPONIVEL ERRO INTERNO"}');
    }


})
// CADASTRANDO DESPESAS - OK - 30-06
app.post('/register/expense', function (req, res) {
    let expenseRegister = req.body;
    let expensesList;
    let userIdValidate = -1;
    let categoryIdValidate = -1;

    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE REGISTRO                 |");
    console.log("| Dados para registrar : " + JSON.stringify(expenseRegister));
    new Promise((resolve, reject) => {
        console.log("| Promise Iniciada");

        readFile(PATH_DIR, "expenses.json")
            .then((_data) => {
                console.log("| Total de registros : " + _data.length);
                expensesList = _data;

                readFile(PATH_DIR, "categories.json")
                    .then((_data) => {

                        for (category of _data) {
                            if (category.id == expenseRegister.category_id && (category.user_id == expenseRegister.user_id || category.user_id == 0)) {
                                console.log("| Category validate: OK - " + JSON.stringify(category));
                                categoryIdValidate = 1;
                                break;
                            }
                        }
                        if (categoryIdValidate == -1) {
                            reject("ERRO AO VALIDAR A CATEGORIA")
                        }

                        readFile(PATH_DIR, "users.json")
                            .then((_data) => {
                                for (user of _data) {
                                    if (user.id == expenseRegister.user_id) {
                                        console.log("| User validate: OK - " + JSON.stringify(user));
                                        userIdValidate = 1;
                                        if (expensesList.length == 0) {
                                            expenseRegister.id = 1;
                                        } else {
                                            expenseRegister.id = expensesList[expensesList.length - 1].id + 1;
                                            expenseRegister.deleted = false;
                                        }
                                        expensesList.push(expenseRegister);
                                        resolve(expensesList);
                                        break;
                                    }
                                }
                                if (userIdValidate == -1) {
                                    reject("ERRO AO VALIDAR O USUÁRIO");
                                }

                            })
                            .catch((_err) => {
                                reject(_err);
                            })

                    })
                    .catch((_err) => {
                        reject(_err);
                    })
            })
            .catch((_err) => {
                reject(_err);
            })


    }).then((_data) => {
        writeFile(PATH_DIR, "expenses.json", JSON.stringify(_data))
            .then(() => {
                console.log("| Registrado: OK - " + JSON.stringify(expenseRegister))
                console.log("| Registro realizado com sucesso");
                console.log("| REGISTRADO - FIM                        |");
                console.log("|_________________________________________|");
                res.send('{"register":"REGISTRADO COM SUCESSO"}');
            })
            .catch(() => {
                console.log("| WriteFile: ERRO: " + err.message);
                console.log("| Não foi possivel efetuar o registro");
                console.log("| NÃO REGISTRADO - FIM                    |");
                console.log("|_________________________________________|");
                // res.status(500).send(`{"register":"NÃO REGISTRADO - ERRO INTERNO"}`);
            })

    }).catch((_err) => {
        console.log("| ERRO: " + _err);
        console.log("| Não foi possivel efetuar o registro");
        console.log("| NÃO REGISTRADO - FIM                    |");
        console.log("|_________________________________________|");
        res.status(500).send(`{"register":"NÃO REGISTRADO - ERRO INTERNO"}`);
    })
})
// CADASTRANDO CATEGORIAS - OK - 30-06
app.post('/register/category', async function (req, res) {
    let categoryRegister = req.body;
    let valid = false;
    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE REGISTRO                 |");
    console.log("| Dados para registrar : " + JSON.stringify(categoryRegister));

    try {
        valid = await userCheck(categoryRegister.user_id,'check');
    } catch (_err) {
        console.log("| ERRO: ERRO INTERNO");
    }

    if (valid) {
        new Promise((resolve, reject) => {
            console.log("| Promise Iniciada");
            readFile(PATH_DIR, "categories.json")
                .then((_data) => {
                    console.log("| Total de registros : " + _data.length);
                    categoriesList = _data;
                    let categoriesListPosition = 0;

                    for (u of categoriesList) {
                        if (categoryRegister.category != "" && u.category == categoryRegister.category && u.user == categoryRegister.user && u.deleted == false) {
                            console.log("| Categoria já registrada : " + u.category);
                            reject("CATEGORIA JA REGISTRADA");
                            break;
                        } else if (categoryRegister.category != "" && u.category == categoryRegister.category && u.user == categoryRegister.user && u.deleted == true) {
                            console.log("| Categoria deletada : " + u.category);
                            categoriesList[categoriesList.length - 1] == undefined ? categoryRegister.id = 1 : categoryRegister.id = categoriesList[categoriesList.length - 1].id + 1;
                            categoriesList.push(categoryRegister);
                            console.log("| Registro a reativar: " + JSON.stringify(categoryRegister));
                            resolve(categoriesList);
                            break;
                        }
                        categoriesListPosition++;
                    }

                    if (categoriesListPosition == categoriesList.length) {
                        console.log("| Registro ativo não encontrado");
                        categoriesList[categoriesList.length - 1] == undefined ? categoryRegister.id = 1 : categoryRegister.id = categoriesList[categoriesList.length - 1].id + 1;
                        categoriesList.push(categoryRegister);
                        console.log("| Registro: " + JSON.stringify(categoryRegister));
                        resolve(categoriesList);
                    }

                })
                .catch((_err) => {
                    console.log("| ReadFile: ERRO: " + _err)
                    console.log("| NÃO REGISTRADO - FIM                    |");
                    console.log("|_________________________________________|");
                    res.status(500).send(`{"register":"${_err}"}`);
                })
        }).then((_data) => {
            let dados = _data
            writeFile(PATH_DIR, "categories.json", JSON.stringify(dados))
                .then(() => {
                    console.log("| Registro realizado com sucesso");
                    console.log("| REGISTRADO - FIM                        |");
                    console.log("|_________________________________________|");
                    res.send('{"register":"REGISTRADO COM SUCESSO"}')
                })
                .catch(() => {
                    console.log("| WriteFile: ERRO: " + err.message);
                    console.log("| Não foi possivel efetuar o registro");
                    console.log("| NÃO REGISTRADO - FIM                    |");
                    console.log("|_________________________________________|");
                    res.status(500).send(`{"register":"NÃO REGISTRADO - ERRO INTERNO"}`);
                })
        }).catch((_err) => {
            console.log("| WriteFile: ERRO: " + _err);
            console.log("| Não foi possivel efetuar o registro");
            console.log("| NÃO REGISTRADO - FIM                    |");
            console.log("|_________________________________________|");
            res.status(500).send(`{"register":"NÃO REGISTRADO - ERRO INTERNO"}`);
        })
    } else {
        console.log("| ERRO - FIM                              |");
        console.log("|_________________________________________|");
        res.status(500).send('{"CONSULTA":"LISTA NÃO DISPONIVEL ERRO INTERNO"}');
    }



})
// ENVIANDO TODAS AS CATEGORIAS - OK - 04-07
app.get('/query/categories/user/:id', async function (req, res) {
    let userId = req.params.id
    let userCheckDados = false;
    console.log("|¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨|");
    console.log("| SOLICITAÇÃO DE DADOS                    |");
    console.log("| Categorias usuário id: " + userId);

    try {
        userCheckDados = await userCheck(userId);
    } catch (_err) {
        console.log("| ERRO: ERRO INTERNO");
    }


    if (userCheckDados) {
        readFile(PATH_DIR, `categories.json`)
            .then((_data) => {
                let dados = _data.filter((category) => {
                    if ((category.user_id == 0 || category.user_id == userId) && !category.deleted) {
                        return category;
                    }
                })
                console.log("| Categorias: "+ JSON.stringify(dados))
                console.log("| Categorias selecionadas                 |");               
                console.log("| SOLICITAÇÃO ENVIADA - FIM               |");
                console.log("|_________________________________________|");
                res.send(`[${JSON.stringify(userCheckDados)},${JSON.stringify(dados)}]`);
            })
            .catch((_err) => {
                console.log("| ReadFile: ERRO: " + _err)
                console.log("| NÃO FOI POSSIVEL LER O ARQUIVO - FIM    |");
                console.log("|_________________________________________|");
                res.status(500).send('{"CONSULTA":"LISTA_NÃO_DISPONIVEL_ERRO_INTERNO"}');
            })
    } else {
        console.log("| ERRO NA SOLICITAÇÃO DE DADOS - FIM      |");
        console.log("|_________________________________________|");
        res.status(500).send('{"CONSULTA":"LISTA_NÃO_DISPONIVEL_ERRO_INTERNO"}');
    }
})






// PORTA DO SERVIDOR - OK
app.listen(3000, () => {
    fs.appendFile('log.txt', `${new Date().toLocaleString()} - SERVER RUNNING ON PORT: ` + 3000 + `${'\n'}`, (err) => {
        if (err) {
            console.log(`| ${new Date().toLocaleString()} > NO SERVER START LOG > ERRO:${err.message}`);
        }
    })
    console.log(`${new Date().toLocaleString()} - Server rodando na porta: ` + 3000)
});






















/*

// usando objetos Date
let inicio = Date.now();

// o evento para o tempo vai aqui:
setTimeout(()=>{
let fim = Date.now();
let decorrido = fim - inicio; // tempo decorrido em milisegundos
console.log("decorrido:"+ decorrido)
},0);

*/