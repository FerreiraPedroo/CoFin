

// OK
function newUserPage() {
    document.getElementById("center").innerHTML = `
    <span id="register-head">CADASTRAR NOVO USUARIO</span>
    <div id="register-card-list">
        <article id="register-card">
        <div id="register-card-head"></div>
        <div id="register-card-keydados">
            <div id=register-card-key-list>
            <div class="register-card-key">ID</div>
            <div class="register-card-key">NOME</div>
            <div class="register-card-key">EMAIL</div>
            <div class="register-card-key">TELEFONE</div>
            <div class="register-card-key">SENHA</div>
            <div class="register-card-key">REPETIR SENHA</div>
            </div>
            <div id=register-card-dados-list>
            <input type="text" id="form-input-id" class="register-card-dados" disabled>
            <input type="text" id="form-input-name" class="register-card-dados">
            <input type="email" id="form-input-email" class="register-card-dados">
            <input type="tel" id="form-input-phone" class="register-card-dados">
            <input type="password" id="form-register-input-password" class="register-card-dados">
            <input type="password" id="form-register-input-password-repeat" class="register-card-dados">
            </div>
        </div>
        <div class="register-card-message" id="register-message-error"></div>
        <div class="register-card-foot-client">
        <button id="form-register-button-send" class="register-card-foot-client-save" onclick="newUser()">SALVAR</button>
        <button id="form-register-button-back" class="register-card-foot-client-save" onclick="location.href = document.referrer">VOLTAR</button>
        </div>
        </article>
    </div>`;
}

function updateUserPage(_updateUserHTMLID) {
    let userId = 1
    console.log(thisData)
    document.getElementById("section").innerHTML = `
    <span id="register-head">ALTERAR DADOS</span>
    <div id="register-card-list">
        <article id="register-card">
        <div id="register-card-head"></div>
        <div id="register-card-keydados">
            <div id=register-card-key-list>
            <div class="register-card-key">ID</div>
            <div class="register-card-key">NOME</div>
            <div class="register-card-key">EMAIL</div>
            <div class="register-card-key">TELEFONE</div>
            <div class="register-card-key">SENHA</div>
            <div class="register-card-key">REPETIR SENHA</div>
            </div>
            <div id=register-card-dados-list>
            <input type="text" id="form-input-id" class="register-card-dados" disabled>
            <input type="text" id="form-input-name" class="register-card-dados">
            <input type="email" id="form-input-email" class="register-card-dados">
            <input type="tel" id="form-input-phone" class="register-card-dados">
            <input type="password" id="form-register-input-password" class="register-card-dados">
            <input type="password" id="form-register-input-password-repeat" class="register-card-dados">
            </div>
        </div>
        <div class="register-card-message" id="register-message-error"></div>
        <div class="register-card-foot-client">
        <button id="form-register-button-send" class="register-card-foot-client-save" onclick="newUser()">SALVAR</button>
        <button id="form-register-button-back" class="register-card-foot-client-save" onclick="location.href = document.referrer">VOLTAR</button>
        </div>
        </article>
    </div>`;
}
function updateUser(_updateUserID) {
    let userId = 1;
    let thisID = _updateUserID.getAttribute("id");
    let idInput = document.getElementById(`form-input-id-${thisID}`);
    let nameInput = document.getElementById(`form-input-name-${thisID}`);
    let emailInput = document.getElementById(`form-input-email-${thisID}`);
    let phoneInput = document.getElementById(`form-input-phone-${thisID}`);
    let saveButtonForm = document.getElementById(`${thisID}`);
    let divMessage = document.getElementById(`message-error`);

    function registerFromEnableDisable(_code) {
        if (_code == 0) {
            nameInput.removeAttribute("disabled", "disabled");
            emailInput.removeAttribute("disabled", "disabled");
            phoneInput.removeAttribute("disabled", "disabled");
            saveButtonForm.removeAttribute("disabled", "disabled");
        } else if (_code == 1) {
            nameInput.setAttribute("disabled", "disabled");
            emailInput.setAttribute("disabled", "disabled");
            phoneInput.setAttribute("disabled", "disabled");
            saveButtonForm.setAttribute("disabled", "disabled");
        }
    }
    registerFromEnableDisable(1)


    new Promise((resolve, reject) => {
        console.log("PROMISE UPDATE USER")
        const xhttpUpdateUser = new XMLHttpRequest();

        xhttpUpdateUser.open('PUT', '/update')
        xhttpUpdateUser.setRequestHeader("Content-Type", "application/json");
        xhttpUpdateUser.send(`{"id":${idInput.value},"user":"${nameInput.value}","email":"${emailInput.value}","phone":"${phoneInput.value}"}`);

        xhttpUpdateUser.onreadystatechange = () => {
            console.log("STATE: " + xhttpUpdateUser.readyState)

            if (xhttpUpdateUser.readyState == 4 && xhttpUpdateUser.status == 200) {
                console.log(JSON.parse(xhttpUpdateUser.responseText));
                console.log("DADOS ALTERADOS COM SUCCESSO")
                resolve();

            } else if (xhttpUpdateUser.readyState == 4 && xhttpUpdateUser.status >= 300) {
                reject(xhttpUpdateUser.responseText)

            }
        }

    }).then(() => {
        divMessage.innerHTML = "DADOS ALTERADOS COM SUCCESSO";
    }).catch((_errorMessage) => {
        divMessage.innerHTML = JSON.parse(_errorMessage)["UPDATE"];
        registerFromEnableDisable(0);
    })
}




// OK
function deleteCategory(_categoryHtmlID) {
    console.log("Delete category: " + _categoryHtmlID.getAttribute("id").slice(8));

    new Promise((resolve, reject) => {
        console.log("DELETE PROMISE");

        const sendCategoryDelete = _categoryHtmlID.getAttribute("id").slice(8);
        console.log(sendCategoryDelete);
        const xhttpDel = new XMLHttpRequest();
        xhttpDel.open("DELETE", "/delete/category/" + sendCategoryDelete, true);
        xhttpDel.send();

        xhttpDel.onreadystatechange = function () {
            console.log(this.readyState)
            console.log(this.status)

            if (this.readyState == 4 && this.status == 200) {
                resolve()
            } else if (this.readyState == 4 && this.status >= 300) {
                reject(sendCategoryDelete)
            }

        }

    }).then(() => {
        allCategory();

    }).catch((_userId) => {
        console.log("ERRO: NÃO FOI POSSIVEL EXCLUIR A CATEGORIA")
        document.getElementById(`message-error-${_userId}`).innerHTML = "NÃO FOI POSSIVEL EXCLUIR A CATEGORIA";
    });

}





// OK
function newUser() {
    let nameInput = document.getElementById('form-input-name');
    let emailInput = document.getElementById('form-input-email');
    let phoneInput = document.getElementById('form-input-phone');
    let passw1Input = document.getElementById('form-register-input-password');
    let passw2Input = document.getElementById('form-register-input-password-repeat');
    let buttonForm = document.getElementById('form-register-button-send');
    let divMessage = document.getElementById("register-message-error");

    function registerFromEnableDisable(_code) {
        if (_code == 0) {
            nameInput.removeAttribute("disabled", "disabled");
            emailInput.removeAttribute("disabled", "disabled");
            phoneInput.removeAttribute("disabled", "disabled");
            passw1Input.removeAttribute("disabled", "disabled");
            passw2Input.removeAttribute("disabled", "disabled");
            buttonForm.removeAttribute("disabled", "disabled");
        } else if (_code == 1) {
            nameInput.setAttribute("disabled", "disabled");
            emailInput.setAttribute("disabled", "disabled");
            phoneInput.setAttribute("disabled", "disabled");
            passw1Input.setAttribute("disabled", "disabled");
            passw2Input.setAttribute("disabled", "disabled");
            buttonForm.setAttribute("disabled", "disabled");
        }
    }

    let xhttpNewUserMessageText;

    const xhttpNewUser = new XMLHttpRequest();
    xhttpNewUser.onreadystatechange = () => {
        console.log("STATE: " + xhttpNewUser.readyState);
        xhttpNewUser.responseText != "" ? xhttpNewUserMessageText = JSON.parse(xhttpNewUser.responseText) : "";
        console.log(xhttpNewUserMessageText);

        if (xhttpNewUser.readyState == 4 && xhttpNewUser.status == 200) {
            divMessage.innerHTML = xhttpNewUserMessageText.register;
            //registerFromEnableDisable(0);
        } else if (xhttpNewUser.readyState == 4 && xhttpNewUser.status >= 300) {
            divMessage.innerHTML = xhttpNewUserMessageText.register;
            registerFromEnableDisable(0);
        }
    }

    if (passw1Input.value == passw2Input.value && passw1Input.value.length != 0 && nameInput.value != "" && emailInput.value != "") {
        registerFromEnableDisable(1);
        divMessage.innerHTML = "INFORMAÇÕES ENVIADAS... AGUARDE...";
        xhttpNewUser.open('POST', '/register/user')
        xhttpNewUser.setRequestHeader("Content-Type", "application/json");
        xhttpNewUser.send(`{"id":"null","user":"${nameInput.value}","email":"${emailInput.value}","phone":"${phoneInput.value}","password":"${passw1Input.value}"}`);
    } else if (nameInput.value == "") {
        divMessage.innerHTML = "O NOME NÃO PODE FICAR EM BRANCO";
        registerFromEnableDisable(0);
    } else if (emailInput.value == "") {
        divMessage.innerHTML = "O EMAIL NÃO PODE FICAR EM BRANCO";
        registerFromEnableDisable(0);
    } else if (passw1Input.value != passw2Input.value) {
        divMessage.innerHTML = "AS SENHAS NÃO IGUAIS";
        registerFromEnableDisable(0);
    } else if (passw1Input.value.length == 0) {
        divMessage.innerHTML = "A SENHA NÃO PODE FICAR EM BRANCO";
        registerFromEnableDisable(0);
    }

}

// OK - 05-07
/*
    Adicionado a função 'sessionModify' para alterar o key da sessão no login.
*/
function userLogin() {
    let userLogin = document.getElementById('form-input-user')
    let passwordLogin = document.getElementById('form-input-password')
    let errorMessageLogin = document.getElementById('message-error')
    let buttonLogin = document.getElementById('form-button-send')
    let jsonLogin = `{"user":"${userLogin.value}","password":"${passwordLogin.value}"}`;
    console.log(jsonLogin)
    userLogin.setAttribute("disabled", "disabled");
    passwordLogin.setAttribute("disabled", "disbled");
    //buttonLogin.setAttribute("disabled", "disbled");
    errorMessageLogin.innerHTML = `&nbsp`;

    xhttpLogin = new XMLHttpRequest();
    xhttpLogin.onreadystatechange = async () => {
        console.log("STATE: " + xhttpLogin.readyState)

        if (xhttpLogin.readyState == 4 && xhttpLogin.status == 200) {
            let xhttpLoginMessageText = JSON.parse(xhttpLogin.responseText);
            await sessionModify(xhttpLoginMessageText)
            window.location.assign(`/painel.html`)

        } else if (xhttpLogin.readyState == 4 && xhttpLogin.status >= 300) {
            userLogin.removeAttribute("disabled", "disabled");
            passwordLogin.removeAttribute("disabled", "disbled");
            //buttonLogin.removeAttribute("disabled", "disbled");
            errorMessageLogin.innerHTML = JSON.parse(xhttpLogin.responseText).LOGIN;
        }
    }

    xhttpLogin.open('POST', '/login')
    xhttpLogin.setRequestHeader("Content-Type", "application/json");
    xhttpLogin.send(jsonLogin);
}








// OK
function newCategory() {
    let idInput = sessionStorage.id;
    let categoryName = document.getElementById("form-input-category");
    let divMessage = document.getElementById("message-register-error");
    let buttonForm = document.getElementById('form-button-send');

    categoryName.setAttribute("disabled", "disbled");
    buttonForm.setAttribute("disabled", "disbled");

    const xhttpNewCategory = new XMLHttpRequest();
    xhttpNewCategory.open("POST", "/register/category");
    xhttpNewCategory.setRequestHeader("Content-Type", "application/json");
    xhttpNewCategory.send(JSON.stringify([{ "id": sessionStorage.getItem('id'), "key": sessionStorage.getItem('key'), "time": sessionStorage.getItem('time') }, { "id": null, "user_id": idInput, "category": categoryName.value, "deleted": false }]));

    let xhttpNewCategoryMessageText;

    xhttpNewCategory.onreadystatechange = async () => {
        console.log("STATE: " + xhttpNewCategory.readyState);
        xhttpNewCategory.responseText != "" ? xhttpNewCategoryMessageText = JSON.parse(xhttpNewCategory.responseText) : console.log(xhttpNewCategory.responseText);
        console.log(xhttpNewCategoryMessageText);

        if (xhttpNewCategory.readyState == 4 && xhttpNewCategory.status == 200) {
            divMessage.innerHTML = xhttpNewCategoryMessageText[1].register;

        } else if (xhttpNewCategory.readyState == 4 && xhttpNewCategory.status >= 300 && xhttpNewCategory.status != 403) {
            divMessage.innerHTML = xhttpNewCategoryMessageText[1].register;
            categoryName.removeAttribute("disabled", "disbled");
            buttonForm.removeAttribute("disabled", "disbled");

        } else if (xhttpNewCategory.readyState == 4 && xhttpNewCategory.status == 403) {
            logoutPage('show')
        }
    }



}
// OK - 04-07
function newCategoryPage() {
    document.getElementById("section").innerHTML = `
    <span id="register-category-head">CADASTRO NOVA CATEGORIA</span>
    <div id="register-category-card-list">
        <article id="register-category-card">
        <div id="register-category-card-head"></div>
        <div id="register-category-card-keydados">

            <div id="register-category-card-key-list">
            <span id="register-category-card-key">ID</span>
            <span id="register-category-card-key">CATEGORIA</span>
            </div>

            <div id="register-category-card-dados-list">
            <input type="text" id="form-input-id" class="register-category-card-dados" disabled>
            <input type="text" id="form-input-category" class="register-category-card-dados">
            </div>

        </div>
        <div id="message-register-error"></div>
        <div id="register-category-card-foot-client"><button id="form-button-send" onclick="newCategory()">SALVAR</button></div>
        </article>
    </div>`;
}
// OK - 04-07
function allCategoryPage() {
    let idInput = sessionStorage.id;
    const xhttpAllCategory = new XMLHttpRequest();
    xhttpAllCategory.open("GET", `/query/categories/user/${idInput}`, true);
    xhttpAllCategory.send();

    xhttpAllCategory.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let recListServidor = JSON.parse(this.responseText)
            let element;
            let elementAll = "";
            console.log("DADOS RECEBIDOS")
            console.log(recListServidor)
            sessionStorage.setItem("id", recListServidor[0].id);
            sessionStorage.setItem("key", recListServidor[0].key);
            sessionStorage.setItem("time", recListServidor[0].time);
            console.log(sessionStorage)
            document.getElementById("section").innerHTML = `
            <div>
            <div id="register-categoryall-head">CONSULTAR CATEGORIAS</div>
                <div id="expense-menu-filter">
                </div>
                <div id="expense-head">
                    <div id="expense-head-id">ID</div>
                    <div id="expense-head-category">CATEGORIA</div>
                </div>
                <div id="expense-list">
                </div>
            </div>`;

            for (i = 0; i < recListServidor[1].length; i++) {
                element = recListServidor[1][i];
                elementAll += `
                <div class="expense-list-dados">
                    <div class="expense-id">${recListServidor[1][i].id}</div>
                    <div class="expense-category">${recListServidor[1][i].category}</div>
                </div>`
            }
            document.getElementById("section").innerHTML += elementAll;
        } else if (xhttpAllCategory.readyState == 4 && xhttpAllCategory.status == 403) {
            logoutPage('show')
        }
    }

}


// OK
function newExpensePage() {
    let idInput = sessionStorage.id;
    console.log("usuário ID:", idInput)
    new Promise((resolve, reject) => {
        console.log("Página de nova despesa")
        const xhttpUpdateUser = new XMLHttpRequest();

        xhttpUpdateUser.open('GET', `/query/categories/user/${idInput}`)
        xhttpUpdateUser.setRequestHeader("Content-Type", "application/json");
        xhttpUpdateUser.send();

        xhttpUpdateUser.onreadystatechange = async () => {
            console.log("STATE: " + xhttpUpdateUser.readyState)
            if (xhttpUpdateUser.readyState == 4 && xhttpUpdateUser.status == 200) {
                let receiveMessage = JSON.parse(xhttpUpdateUser.responseText)
                await sessionModify(receiveMessage[0]);
                resolve(receiveMessage[1]);

            } else if (xhttpUpdateUser.readyState == 4 && xhttpUpdateUser.status >= 300) {
                reject(xhttpUpdateUser.status)

            }
        }

    }).then((_listCategory) => {
        let newCategoryHtml = `
        <span id="register-head">CADASTRAR NOVA DESPESA</span>
        <div id="register-card-list">
            <article id="register-card">
            <div id="register-card-head"></div>
            <div id="register-card-keydados">
                <div id=register-card-key-list>
                <div class="register-card-key">ID</div>
                <div class="register-card-key">DATA LANÇADA</div>
                <div class="register-card-key">DATA VENCIMENTO</div>
                <div class="register-card-key">CATEGORIA</div>
                <div class="register-card-key">VALOR R$</div>
                </div>
                <div id=register-card-dados-list>
                <input type="text" id="form-input-id" class="register-card-dados" disabled>
                <input type="text" id="form-input-date" class="register-card-dados" value="${new Date().toLocaleDateString()}" disabled>
                <input type="date" id="form-input-date-expire" class="register-card-dados" >
                <select id="form-input-category" class="register-card-dados" name="select">
        `
        _listCategory.forEach((value) => {
            newCategoryHtml += `<option value="${value.id}">${value.category}</option>`
        })
        newCategoryHtml += `</select>
                <input type="value" id="form-register-input-value" class="register-card-dados">
                    </div>
            </div>
            <div class="register-card-message" id="register-message-error"></div>
            <div class="register-card-foot-client-expense">
            <button id="form-register-button-send" class="register-card-foot-client-save" onclick="newExpense()">SALVAR</button>
            <button id="form-register-button-back" class="register-card-foot-client-save" onclick="location.href = document.referrer">VOLTAR</button>
            </div>
            </article>
        </div>
        `;
        document.getElementById("section").innerHTML = newCategoryHtml

    }).catch((_errorMessage) => {
        if (_errorMessage == 403) {
            logoutPage('show')
        } else {
            console.log(_errorMessage)
            document.getElementById("section").innerHTML = _errorMessage;
        }
    })
}
// OK
function newExpense() {
    let idInput = sessionStorage.id;
    let dateInput = document.getElementById('form-input-date');
    let dateExpireInput = document.getElementById('form-input-date-expire');
    let categoryInput = document.getElementById('form-input-category');
    let valueMoney = document.getElementById('form-register-input-value');
    let buttonForm = document.getElementById('form-register-button-send');
    let divMessage = document.getElementById("register-message-error");
    console.log("ID do usuário: ", idInput);
    console.log("Categoria selecionada: ", categoryInput.options[categoryInput.selectedIndex].value);


    function registerFromEnableDisable(_code) {
        if (_code == 0) {
            //dateInput.removeAttribute("disabled", "disabled");
            dateExpireInput.removeAttribute("disabled", "disabled");
            categoryInput.removeAttribute("disabled", "disabled");
            valueMoney.removeAttribute("disabled", "disabled");
            buttonForm.removeAttribute("disabled", "disabled");
        } else if (_code == 1) {
            //dateInput.setAttribute("disabled", "disabled");
            dateExpireInput.setAttribute("disabled", "disabled");
            categoryInput.setAttribute("disabled", "disabled");
            valueMoney.setAttribute("disabled", "disabled");
            buttonForm.setAttribute("disabled", "disabled");
        }
    }

    let xhttpNewExpenseMessageText;

    const xhttpNewExpense = new XMLHttpRequest();
    xhttpNewExpense.onreadystatechange = async () => {
        console.log("STATE: " + xhttpNewExpense.readyState);
        xhttpNewExpense.responseText != "" ? xhttpNewExpenseMessageText = JSON.parse(xhttpNewExpense.responseText) : "";
        console.log(xhttpNewExpenseMessageText);

        if (xhttpNewExpense.readyState == 4 && xhttpNewExpense.status == 200) {
            divMessage.innerHTML = "DESPESA CADASTRADA";
            await sessionModify(xhttpNewExpenseMessageText)
            registerFromEnableDisable(0);

        } else if (xhttpNewExpense.readyState == 4 && xhttpNewExpense.status >= 300 && xhttpNewExpense.status != 403) {
            divMessage.innerHTML = xhttpNewExpenseMessageText.register;
            registerFromEnableDisable(0);
        } else if (xhttpNewExpense.readyState == 4 && xhttpNewExpense.status == 403) {
            logoutPage('show')
        }
    }

    if (valueMoney.value != "" && dateInput.value != "" && categoryInput.value != "") {
        registerFromEnableDisable(1);
        divMessage.innerHTML = "INFORMAÇÕES ENVIADAS... AGUARDE...";
        xhttpNewExpense.open('POST', '/register/expense');
        xhttpNewExpense.setRequestHeader("Content-Type", "application/json");

        xhttpNewExpense.send(`[{"id":${sessionStorage.getItem('id')},"key":${sessionStorage.getItem('key')},"time":${sessionStorage.getItem('time')} },{"id":null,"date":"${dateInput.value}","date_expire":"${dateExpireInput.value}","user_id":${idInput},"category_id":${categoryInput.options[categoryInput.selectedIndex].value},"value":${valueMoney.value}}]`);
    } else if (dateExpireInput.value == "") {
        dateExpireInput.innerHTML = "A DATA NÃO PODE FICAR EM BRANCO";
        registerFromEnableDisable(0);
    } else if (categoryInput.value == "") {
        divMessage.innerHTML = "A CATEGORIA NÃO PODE FICAR EM BRANCO";
        registerFromEnableDisable(0);
    } else if (valueMoney.value == "") {
        divMessage.innerHTML = "O VALOR NÃO PODE FICAR EM BRANCO";
        registerFromEnableDisable(0);
    }

}
// OK
function allExpensePage() {
    let idInput = sessionStorage.id;
    const xhttpAllExpense = new XMLHttpRequest();
    xhttpAllExpense.open("GET", `/query/expenses/user/${idInput}`, true);
    xhttpAllExpense.send();

    xhttpAllExpense.onreadystatechange = function () {
        if (xhttpAllExpense.readyState == 4 && xhttpAllExpense.status == 200) {
            let recListServidor = JSON.parse(this.responseText)[1];
            let element;
            let elementAll = "";
            console.log(recListServidor);

            elementAll = `
            <div id="register-categoryall-head">CONSULTAR DESPESAS</div>
                <div id="expense-menu-filter">
                </div>
                <div id="expense-list">
                <table>
                <tr>
                    <th id="table-id">ID</th>
                    <th id="table-date">LANÇAMENTO</th>
                    <th id="table-date_expire">VENCIMENTO</th>
                    <th id="table-description">DESCRIÇÃO</th>
                    <th id="table-category">CATEGORIA</th>
                    <th id="table-value">VALOR</th>
                </tr>`;

            for (i = 0; i < recListServidor.length; i++) {
                element = recListServidor[i];
                elementAll += `
                <tr>
                    <td id="table-id-${recListServidor[i].id}">${recListServidor[i].id}</td>
                    <td id="table-date-${recListServidor[i].id}">${recListServidor[i].date}</td>
                    <td id="table-date_expire-${recListServidor[i].id}">${recListServidor[i].date_expire}</td>
                    <td id="table-description-${recListServidor[i].id}"> ------------------ </td>
                    <td id="table-category-${recListServidor[i].id}">${recListServidor[i].category_id}</td>
                    <td id="table-value-${recListServidor[i].id}">R$ ${recListServidor[i].value}</td>
                </tr>`
            }
            elementAll += `</table></div>`;
            document.getElementById("section").innerHTML = "";
            document.getElementById("section").innerHTML += elementAll;
        } else if (xhttpAllExpense.readyState == 4 && xhttpAllExpense.status == 403) {
            logoutPage('show')
        }
    }
}









// CIFRA DE CESAR
//caesarChiper()
function caesarChiper() {
    //let userPassword = document.getElementById('form-input-password');
    let userPassword = ".!#$ --- ýþÿ - ;\"<=>";
    let alphabetUTF8 = ".!#$%& ()*+,-/\\0123456789:;\"<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
    console.log(alphabetUTF8.length)
    let userPasswordCoded = "";
    let userPasswordDecoded = "";
    // CIFRA DE CESAR - CODIFICANDO
    for (u = 0; u < userPassword.length; u++) {
        for (i = 0; i < alphabetUTF8.length; i++) {
            if (userPassword[u] == alphabetUTF8[i]) {
                i + 3 >= 188 ? userPasswordCoded += alphabetUTF8[(i + 3) - 188] : userPasswordCoded += alphabetUTF8[i + 3];
                console.log(userPasswordCoded)
            }
        }
    }
    // CIFRA DE CESAR - DESIFRANDO
    for (u = 0; u < userPasswordCoded.length; u++) {
        for (i = 0; i < alphabetUTF8.length; i++) {
            if (userPasswordCoded[u] == alphabetUTF8[i]) {
                i - 3 < 0 ? userPasswordDecoded += alphabetUTF8[(i - 3) + 188] : userPasswordDecoded += alphabetUTF8[i - 3];
                console.log(userPasswordDecoded)
            }
        }
    }

}
/*
    Função que exibe a página de logout.
*/
function logoutPage(_status) {
    if (_status == 'show') {
        document.getElementById('logout').style.display = 'block';
    } else if (_status == 'close') {
        document.getElementById('logout').style.display = 'none';
    }
}
/*
    Toda solicitação que retornar uma nova 'key' e 'time' da sessão esta função faz a alteração.
*/
function sessionModify(_session) {
    console.log("SESSÃO RECEBIDA")
    sessionStorage.setItem("id", _session.id);
    sessionStorage.setItem("key", _session.key);
    sessionStorage.setItem("time", _session.time);
    console.log(_session)
    console.table(sessionStorage)
}