// =====================================================================
// DICTIONARY LOOKUP DICTIONARY CONFIGURATION (i18n)
// =====================================================================
const translations = {
    en: {
        balanceTitle: "Balance", deposit: "DEPOSIT", withdraw: "WITHDRAW",
        statementBtn: "STATEMENT", statementTitle: "STATEMENT",
        promoFeatures: "More features coming soon.", promoMonetize: "Monetize with special fees!",
        promptDeposit: "Enter the deposit amount:", promptWithdraw: "Enter the withdrawal amount:",
        promptCpf: "Enter client's CPF (numbers only):", promptName: "Enter full name:",
        promptBirth: "Enter date of birth (dd-mm-yyyy):", promptAddress: "Enter address:",
        promptCapital: "Enter initial investment capital (R$):", promptRate: "Enter annual interest rate (e.g., 0.05):",
        promptYears: "Enter investment duration (in years):",
        errInvalidValue: "Operation failed! Please enter a valid numeric value.",
        errNegative: "Operation failed! The entered amount is invalid.",
        errInsuficiente: "Operation failed! You do not have sufficient balance.",
        errCpfRegistered: "Error! A user with this CPF is already registered.",
        errUserNotFound: "User not found! Register the user first.",
        lblD: "Deposit", lblS: "Withdraw", lblE: "Statement", lblNc: "New Account",
        lblLc: "List Accounts", lblNu: "New User", lblCi: "Calculate Investment", lblQ: "Quit / Reset"
    },
    pt: {
        balanceTitle: "Saldo", deposit: "DEPOSITAR", withdraw: "SACAR",
        statementBtn: "EXTRATO", statementTitle: "EXTRATO",
        promoFeatures: "Mais recursos em breve.", promoMonetize: "Monetize com taxas especiais!",
        promptDeposit: "Informe o valor do depósito:", promptWithdraw: "Informe o valor do saque:",
        promptCpf: "Informe o CPF (somente números):", promptName: "Informe o nome completo:",
        promptBirth: "Informe a data de nascimento (dd-mm-aaaa):", promptAddress: "Informe o endereço completo:",
        promptCapital: "Informe o capital inicial investido (R$):", promptRate: "Informe a taxa de juros anual (ex: 0.05):",
        promptYears: "Informe o período de rendimento (em anos):",
        errInvalidValue: "Operação falhou! Digite um valor numérico válido.",
        errNegative: "Operação falhou! O valor informado é inválido.",
        errInsuficiente: "Operação falhou! Você não tem saldo suficiente.",
        errCpfRegistered: "Erro! Já existe um usuário cadastrado com esse CPF.",
        errUserNotFound: "Usuário não encontrado! Cadastre o usuário primeiro.",
        lblD: "Depositar", lblS: "Sacar", lblE: "Extrato", lblNc: "Nova Conta",
        lblLc: "Listar Contas", lblNu: "Novo Usuário", lblCi: "Calcular Investimento", lblQ: "Sair / Reset"
    },
    es: {
        balanceTitle: "Saldo", deposit: "DEPOSITAR", withdraw: "RETIRAR",
        statementBtn: "EXTRACTO", statementTitle: "EXTRACTO",
        promoFeatures: "Más funciones próximamente.", promoMonetize: "¡Monetiza con tarifas especiales!",
        promptDeposit: "Introduzca el valor del depósito:", promptWithdraw: "Introduzca el valor del retiro:",
        promptCpf: "Ingrese el CPF (solo números):", promptName: "Ingrese el nombre completo:",
        promptBirth: "Ingrese la fecha de nacimiento (dd-mm-aaaa):", promptAddress: "Ingrese la dirección completa:",
        promptCapital: "Ingrese el capital inicial (R$):", promptRate: "Ingrese la tasa de interés anual (ej: 0.05):",
        promptYears: "Ingrese la duración en años:",
        errInvalidValue: "¡Operación fallida! Ingrese un valor numérico válido.",
        errNegative: "¡Operación fallida! El valor ingresado no é válido.",
        errInsuficiente: "¡Operación fallida! No cuenta con saldo suficiente.",
        errCpfRegistered: "¡Error! Ya existe un usuario registrado con este CPF.",
        errUserNotFound: "¡Usuario no encontrado! Registre al usuario primero.",
        lblD: "Depositar", lblS: "Retirar", lblE: "Extracto", lblNc: "Nueva Cuenta",
        lblLc: "Listar Cuentas", lblNu: "Nuevo Usuario", lblCi: "Calcular Inversión", lblQ: "Salir / Reiniciar"
    }
};

const navTranslations = {
    en: { home: "Home", statement: "Statement", menu: "Menu" },
    pt: { home: "Início", statement: "Extrato", menu: "Menu" },
    es: { home: "Inicio", statement: "Extracto", menu: "Menú" }
};

// =====================================================================
// CORE STATE DATABASE LAYERS (Replicating OOP structure)
// =====================================================================
let currentBalance = 0.00;
let currentLanguage = "en";
let transactionsHistory = [];
let usersDatabase = [];
let accountsDatabase = [];

// DOM Bindings
const displayBalance = document.getElementById("display-balance");
const statementLogs = document.getElementById("statement-logs");
const bodyElement = document.body;

function renderDashboard() {
    displayBalance.textContent = currentBalance.toFixed(2);
}

function printToConsole(message, isClear = false) {
    if (isClear) statementLogs.innerHTML = "";
    const line = document.createElement("p");
    line.textContent = message;
    statementLogs.appendChild(line);
    document.querySelector(".statement-console").scrollIntoView({ behavior: "smooth" });
}

function updateLanguageUI(lang) {
    currentLanguage = lang;
    const lexicon = translations[lang];
    
    document.getElementById("txt-balance-title").textContent = lexicon.balanceTitle;
    document.getElementById("txt-deposit").textContent = lexicon.deposit;
    document.getElementById("txt-withdraw").textContent = lexicon.withdraw;
    document.getElementById("txt-statement-btn").textContent = lexicon.statementBtn;
    document.getElementById("txt-statement-title").textContent = lexicon.statementTitle;
    document.getElementById("txt-promo-features").textContent = lexicon.promoFeatures;
    document.getElementById("txt-promo-monetize").textContent = lexicon.promoMonetize;

    // Menu sidebar specific options
    document.querySelector(".lbl-d").textContent = lexicon.lblD;
    document.querySelector(".lbl-s").textContent = lexicon.lblS;
    document.querySelector(".lbl-e").textContent = lexicon.lblE;
    document.querySelector(".lbl-nc").textContent = lexicon.lblNc;
    document.querySelector(".lbl-lc").textContent = lexicon.lblLc;
    document.querySelector(".lbl-nu").textContent = lexicon.lblNu;
    document.querySelector(".lbl-ci").textContent = lexicon.lblCi;
    document.querySelector(".lbl-q").textContent = lexicon.lblQ;

    document.querySelectorAll("[data-i18n-nav]").forEach(el => {
        const key = el.getAttribute("data-i18n-nav");
        el.textContent = navTranslations[lang][key];
    });
    renderDashboard();
}

// =====================================================================
// OPERATIONS CONTROL DELEGATION BLOCK
// =====================================================================
function triggerDeposit() {
    const langObj = translations[currentLanguage];
    const val = prompt(langObj.promptDeposit);
    if (!val) return;
    const amount = parseFloat(val);
    if (isNaN(amount)) return alert(langObj.errInvalidValue);
    if (amount <= 0) return alert(langObj.errNegative);

    currentBalance += amount;
    const now = new Date().toLocaleTimeString();
    transactionsHistory.push(`[${now}] Deposit: R$ ${amount.toFixed(2)}`);
    
    printToConsole(`=== Deposit of R$ ${amount.toFixed(2)} completed! ===`);
    renderDashboard();
}

function triggerWithdrawal() {
    const langObj = translations[currentLanguage];
    const val = prompt(langObj.promptWithdraw);
    if (!val) return;
    const amount = parseFloat(val);
    if (isNaN(amount)) return alert(langObj.errInvalidValue);
    if (amount <= 0) return alert(langObj.errNegative);
    if (amount > currentBalance) return alert(langObj.errInsuficiente);

    currentBalance -= amount;
    const now = new Date().toLocaleTimeString();
    transactionsHistory.push(`[${now}] Withdrawal: R$ ${amount.toFixed(2)}`);
    
    printToConsole(`=== Withdrawal of R$ ${amount.toFixed(2)} completed! ===`);
    renderDashboard();
}

function triggerStatement() {
    statementLogs.innerHTML = "";
    if (transactionsHistory.length === 0) {
        printToConsole("No transactions have been recorded.");
    } else {
        transactionsHistory.forEach(t => printToConsole(t));
    }
    printToConsole(`-----------------------`);
    printToConsole(`${translations[currentLanguage].balanceTitle}: R$ ${currentBalance.toFixed(2)}`);
}

function triggerNewUser() {
    const langObj = translations[currentLanguage];
    const cpf = prompt(langObj.promptCpf);
    if (!cpf) return;
    
    if (usersDatabase.some(u => u.cpf === cpf)) return alert(langObj.errCpfRegistered);
    
    const name = prompt(langObj.promptName);
    const birth = prompt(langObj.promptBirth);
    const addr = prompt(langObj.promptAddress);
    
    usersDatabase.push({ cpf, name, birth, addr });
    printToConsole(`=== User ${name} created successfully! ===`);
}

function triggerNewAccount() {
    const langObj = translations[currentLanguage];
    const cpf = prompt(langObj.promptCpf);
    if (!cpf) return;

    const user = usersDatabase.find(u => u.cpf === cpf);
    if (!user) return alert(langObj.errUserNotFound);

    const accNumber = accountsDatabase.length + 1;
    accountsDatabase.push({ number: accNumber, branch: "0001", holder: user.name });
    printToConsole(`=== Account C/A 000${accNumber} linked to ${user.name}! ===`);
}

function triggerListAccounts() {
    statementLogs.innerHTML = "";
    if (accountsDatabase.length === 0) {
        printToConsole("No active structural accounts found.");
        return;
    }
    accountsDatabase.forEach(acc => {
        printToConsole(`[Branch: ${acc.branch} | C/A: ${acc.number} | Holder: ${acc.holder}]`);
    });
}

function triggerInvestmentCalculations() {
    const langObj = translations[currentLanguage];
    try {
        const cap = parseFloat(prompt(langObj.promptCapital));
        const rate = parseFloat(prompt(langObj.promptRate));
        const years = parseInt(prompt(langObj.promptYears));
        
        if (isNaN(cap) || isNaN(rate) || isNaN(years)) return alert(langObj.errInvalidValue);
        
        let finalVal = cap;
        for (let i = 0; i < years; i++) {
            finalVal *= (1 + rate);
        }
        printToConsole(`=== Simulated compound profit valuation: R$ ${finalVal.toFixed(2)} ===`);
    } catch (e) {
        alert(langObj.errInvalidValue);
    }
}

// =====================================================================
// INTERACTION LISTENERS & INITIALIZATION
// =====================================================================
const sideMenu = document.getElementById("side-menu");

document.getElementById("open-menu").addEventListener("click", () => sideMenu.classList.add("open"));
document.getElementById("close-menu").addEventListener("click", () => sideMenu.classList.remove("open"));
document.getElementById("nav-statement").addEventListener("click", triggerStatement);
document.getElementById("nav-home").addEventListener("click", () => printToConsole("Welcome to Had Bank!", true));

// Dashboard Button Routing
document.getElementById("btn-deposit").addEventListener("click", triggerDeposit);
document.getElementById("btn-withdraw").addEventListener("click", triggerWithdrawal);
document.getElementById("btn-statement").addEventListener("click", triggerStatement);

// Slide Menu Actions Mapping
document.getElementById("menu-opt-d").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerDeposit(); });
document.getElementById("menu-opt-s").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerWithdrawal(); });
document.getElementById("menu-opt-e").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerStatement(); });
document.getElementById("menu-opt-nu").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerNewUser(); });
document.getElementById("menu-opt-nc").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerNewAccount(); });
document.getElementById("menu-opt-lc").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerListAccounts(); });
document.getElementById("menu-opt-ci").addEventListener("click", () => { sideMenu.classList.remove("open"); triggerInvestmentCalculations(); });
document.getElementById("menu-opt-q").addEventListener("click", () => {
    sideMenu.classList.remove("open");
    currentBalance = 0;
    transactionsHistory = [];
    printToConsole("System session variables purged.", true);
    renderDashboard();
});

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
    if (bodyElement.classList.contains("dark-theme")) {
        bodyElement.classList.replace("dark-theme", "light-theme");
        document.getElementById("theme-toggle").querySelector(".theme-icon").textContent = "🌙";
    } else {
        bodyElement.classList.replace("light-theme", "dark-theme");
        document.getElementById("theme-toggle").querySelector(".theme-icon").textContent = "☀️";
    }
});

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelector(".lang-btn.active").classList.remove("active");
        e.target.classList.add("active");
        updateLanguageUI(e.target.getAttribute("data-lang"));
    });
});

document.addEventListener("DOMContentLoaded", () => updateLanguageUI("en"));
