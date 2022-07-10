class CalculadoraController {


    constructor() {

        this._dataEl = document.querySelector(".data");
        this._horaEl = document.querySelector('.hora');
        this._listaExp = ['0'];
        this._displayEl = document.querySelector('.expression');
        this._prev;
        this._prevEl = document.querySelector('.preview');
        this.initialize();
        this.initAddEventosBotoes();
        this.initAddEventskeyboard();
        this._ifResult = false;
    }

    clear() {
        this._listaExp = ['0']
        this._prev = 0;
        this.attDisplay();
    }

    erase() {
        this._listaExp[this._listaExp.length - 1] = this.returnLast().slice(0, -1); // 
        if (this.returnLast() == '') {
            if (this._listaExp.length == 1) { // quando a lista tiver um elemento e for apagar , ela zera
                this._listaExp = ['0'];
            } else {
                this._listaExp.pop(); //apaga ultimo elemento da array
            }

        }

        this.attDisplay();
    }

    error() {
        this._displayEl.innerHTML = "ERROR";
        this._prevEl.innerHTML = "";
        this._ifResult = true;
    }

    inverse() {
        //  console.log("chama")
        if (this.verifOperator(this.returnLast())) { // verifica se é operador
            this._listaExp.pop(); //remove ultimo elemento e roda o codigo
        }
        if (this.returnLast() == '0') {
            return;
        }
        this._listaExp[this._listaExp.length - 1] = (1 / this.returnLast()).toString(); //inverte o numero
        this._ifResult = true;
        this.attDisplay();

    }





    verifOperator(value) {
        return ['×', '÷', '+', '-'].indexOf(value) > -1; // procura em todos os elementos e retorna o index dele o que recebe no indexof value ja retorna true ou false
    }


    initialize() {
        this.attData();

        setInterval(() => {
            this.attData();
        }, 1000)
    }

    attData() { // atualiza data e hora
        let data = new Date();
        this._dataEl.innerHTML = data.toLocaleDateString("pt-BR");

        this._horaEl.innerHTML = data.toLocaleTimeString("pt-BR");
    }

    returnLast() {
        return this._listaExp[this._listaExp.length - 1];
    }

    attDisplay() {
        this._displayEl.innerHTML = this._listaExp.join(''); // retira as virgula e substitui por vazio
        this._prevEl.innerHTML = this._prev;
        this._displayEl.scrollBy(100, 0);

    }


    addValExp(value) { // recebe o valor clicado
        // console.log(value);

        if (this.verifOperator(value)) {
            //se nao for numero
            // manda o val para a lista

            if (this.verifOperator(this.returnLast())) { // verifica se ja tem um operador na ultima posição
                this._listaExp[this._listaExp.length - 1] = value; // se tiver so substitui pelo operador selecionado
            } else {
                this._listaExp.push(value); // se nao ele adiciona operador
            }




        } else {
            //se for numero
            //adiciona no ultimo index



            if (this.verifOperator(this.returnLast())) { // // verifica se ja tem um operador na ultima posição
                this._listaExp.push(value); // adiciona na expressão
            } else {
                if (this.returnLast() == '0' && value.toString() != '.') { // verifica se o ultimo numero é zero
                    this._listaExp[this._listaExp.length - 1] = value.toString(); // se for substitui pelo valor 
                } else { // se nao

                    if (this.returnLast().indexOf('.') > -1 && value.toString() == '.') { // se for ponto o valor vai ser maior que -1
                        return; // retorna e finaliza expressão
                    }
                    this._listaExp[this._listaExp.length - 1] += value.toString(); //adiciona no ultimo elemento
                }

            }




        }

        // console.log(this._listaExp)
        this.attDisplay();

    }

    calculate(arr) {


        for (let i = 0; i < arr.length; i += 2) {
            arr[i] = parseFloat(arr[i]);
        }



        while (this.multIndexOf(arr, ['÷', '×'])[0] > -1) {
            let operation = this.multIndexOf(arr, ['÷', '×']) //[index,el]
            let result;
            switch (operation[1]) {
                case "÷":
                    result = arr[operation[0] - 1] / arr[operation[0] + 1];
                    break;
                case "×":
                    result = arr[operation[0] - 1] * arr[operation[0] + 1];
                    break;
            }

            arr.splice(operation[0] - 1, 3, result); //apaga  3 elementos

        }

        while (this.multIndexOf(arr, ['+', '-'])[0] > -1) {
            let operation = this.multIndexOf(arr, ['+', '-']) //[index,el]
            let result;
            switch (operation[1]) {
                case "+":
                    result = arr[operation[0] - 1] + arr[operation[0] + 1];
                    break;
                case "-":
                    result = arr[operation[0] - 1] - arr[operation[0] + 1];
                    break;
            }

            arr.splice(operation[0] - 1, 3, result); //apaga  3 elementos
            // console.log("ok")
        }


        this._ifResult = true;
        arr[0].toString();
        //  console.log(arr);
        this.attDisplay();
    }

    multIndexOf(arrPrincipal, arr) {

        for (let i = 0; i < arrPrincipal.length; i++) {
            let v = arrPrincipal[i];
            for (let i2 = 0; i2 < arr.length; i2++) {
                let v2 = arr[i2];
                if (v == v2) {
                    return [i, v2];
                }
            }

        }
        return [-1, ''];



    }

    calcPrev() {
        let listPrev = [];

        this._listaExp.forEach(v => {
            listPrev.push(v);
        })

        this.calculate(listPrev);
        this._ifResult = false;
        if (isNaN(listPrev[0])) {
            return;
        }
        this._prev = listPrev.join('');
        this.attDisplay();

        // console.log(listPrev);
    }

    initAddEventskeyboard() {
        document.addEventListener("keydown", (e) => {
            // console.log(e);

            switch (e.key) {
                case "c":
                    //clear
                    this.clear();
                    break;
                case "Backspace":
                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    }
                    this.erase();
                    this.calcPrev();
                    break;
                case "Enter":

                    if (this._ifResult == true) {
                        return;
                    } else {
                        this._prev = '';
                        this.calculate(this._listaExp);
                    }

                    break;
                case "1/x":

                    this.inverse();
                    this.calcPrev();
                    break;
                case "-":
                case "+":
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case '.':

                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    } else
                        this.addValExp(e.key);
                    //adiciona na lista da expressão
                    this.calcPrev();

                    break;
                case "*":
                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    } else
                        this.addValExp("×");
                    //adiciona na lista da expressão
                    this.calcPrev();

                    break;
                case "/":
                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    } else
                        this.addValExp("÷");
                    //adiciona na lista da expressão
                    this.calcPrev();

                    break;
            }

            if (isNaN(this._listaExp[0])) {
                this.error();
            }

        })
    }



    initAddEventosBotoes() {
        let buttons = document.querySelectorAll('table.botoes td');

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                let valor = button.innerHTML;
                switch (valor) {
                    case "AC":
                        //clear
                        this.clear();
                        break;
                    case "backspace":
                        if (this._ifResult == true) {
                            this.clear();
                            this._ifResult = false;
                        }
                        this.erase();
                        this.calcPrev();
                        break;
                    case "=":

                        if (this._ifResult == true) {
                            return;
                        } else {
                            this._prev = '';
                            this.calculate(this._listaExp);
                        }

                        break;
                    case "1/x":

                        this.inverse();
                        this.calcPrev();
                        break;
                    case "×":
                    case "+":
                    case "-":
                    case "÷":
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':
                    case '.':

                        if (this._ifResult == true) {
                            this.clear();
                            this._ifResult = false;
                        } else
                            this.addValExp(valor);
                        //adiciona na lista da expressão
                        this.calcPrev();

                        break;


                }

                if (isNaN(this._listaExp[0])) {
                    this.error();
                }


            })
        })



    }



}