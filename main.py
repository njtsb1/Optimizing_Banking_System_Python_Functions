from datetime import datetime
import textwrap

# =====================================================================
# BANKING DOMAIN CLASSES (OOP)
# =====================================================================

class History:
    def __init__(self):
        self._transactions = []

    @property
    def transactions(self):
        return self._transactions

    def add_transaction(self, transaction):
        self._transactions.append({
            "type": transaction.__class__.__name__,
            "amount": transaction.amount,
            "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "raw_date": datetime.now().date()
        })


class Transaction:
    @property
    def amount(self):
        pass

    def register(self, account):
        pass


class Deposit(Transaction):
    def __init__(self, amount):
        self._amount = amount

    @property
    def amount(self):
        return self._amount

    def register(self, account):
        success = account.deposit(self.amount)
        if success:
            account.history.add_transaction(self)


class Withdrawal(Transaction):
    def __init__(self, amount):
        self._amount = amount

    @property
    def amount(self):
        return self._amount

    def register(self, account):
        success = account.withdraw(self.amount)
        if success:
            account.history.add_transaction(self)


class Account:
    def __init__(self, number, client):
        self._balance = 0.0
        self._number = number
        self._branch = "0001"
        self._client = client
        self._history = History()

    @classmethod
    def new_account(cls, client, number):
        return cls(number, client)

    @property
    def balance(self):
        return self._balance

    @property
    def number(self):
        return self._number

    @property
    def branch(self):
        return self._branch

    @property
    def client(self):
        return self._client

    @property
    def history(self):
        return self._history

    def withdraw(self, amount):
        balance = self.balance
        exceeded_balance = amount > balance

        if exceeded_balance:
            print("\n@@@ Operation failed! You do not have sufficient balance. @@@")
            return False

        if amount > 0:
            self._balance -= amount
            print(f"\n=== Withdrawal of R$ {amount:.2f} completed successfully! ===")
            return True
        else:
            print("\n@@@ Operation failed! The entered amount is invalid. @@@")
            return False

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"\n=== Deposit of R$ {amount:.2f} completed successfully! ===")
            return True
        else:
            print("\n@@@ Operation failed! The entered amount is invalid. @@@")
            return False


class CheckingAccount(Account):
    def __init__(self, number, client, limit=500.0, withdrawal_limit=3):
        super().__init__(number, client)
        self._limit = limit
        self._withdrawal_limit = withdrawal_limit

    def withdraw(self, amount):
        today = datetime.now().date()
        
        # Enforces security limits dynamically checking transactions from today
        daily_withdrawals = len([
            t for t in self.history.transactions 
            if t["type"] == Withdrawal.__name__ and t["raw_date"] == today
        ])

        exceeded_limit = amount > self._limit
        exceeded_withdrawals = daily_withdrawals >= self._withdrawal_limit

        if exceeded_limit:
            print(f"\n@@@ Operation failed! Amount exceeds maximum limits per transaction (R$ {self._limit:.2f}). @@@")
            return False

        if exceeded_withdrawals:
            print(f"\n@@@ Operation failed! Daily limit of {self._withdrawal_limit} withdrawals reached. @@@")
            return False

        return super().withdraw(amount)

    def __str__(self):
        return f"Branch:\t{self.branch}\nC/A:\t{self.number}\nHolder:\t{self.client.name}"


class Client:
    def __init__(self, address):
        self.address = address
        self.accounts = []

    def perform_transaction(self, account, transaction):
        transaction.register(account)

    def add_account(self, account):
        self.accounts.append(account)


class PhysicalPerson(Client):
    def __init__(self, name, birth_date, cpf, address):
        super().__init__(address)
        self.name = name
        self.birth_date = birth_date
        self.cpf = cpf


# =====================================================================
# INVESTMENT MANAGEMENT CLASS
# =====================================================================

class InterestRate:
    @staticmethod
    def calculate_compound_interest(initial_capital, annual_rate, period_years):
        """Calculates compound interest returns based on past challenges requirements."""
        final_value = initial_capital
        for _ in range(period_years):
            final_value *= (1 + annual_rate)
        return round(final_value, 2)


# =====================================================================
# SYSTEM INTERACTION UTILITIES
# =====================================================================

def menu():
    menu_text = """\n
    ================ MENU ================
    [d]\tDeposit
    [s]\tWithdraw
    [e]\tStatement
    [nc]\tNew Account
    [lc]\tList Accounts
    [nu]\tNew User
    [ci]\tCalculate Investment
    [q]\tQuit
    => """
    return input(textwrap.dedent(menu_text)).strip().lower()


def filter_client(cpf, clients):
    filtered_clients = [c for c in clients if c.cpf == cpf]
    return filtered_clients[0] if filtered_clients else None


def select_client_account(client):
    """Mechanic allowing clients to choose which account to use if multiple exist."""
    if not client.accounts:
        print("\n@@@ This client does not own any registered bank accounts! @@@")
        return None

    if len(client.accounts) == 1:
        return client.accounts[0]

    print("\n--- Multiple Accounts Found ---")
    for index, account in enumerate(client.accounts):
        print(f"[{index}] Account C/A: {account.number} (Branch: {account.branch})")
    
    try:
        choice = int(input("Select the account index to operate: "))
        if 0 <= choice < len(client.accounts):
            return client.accounts[choice]
        else:
            print("\n@@@ Invalid index selection! Operation cancelled. @@@")
            return None
    except ValueError:
        print("\n@@@ Invalid input! Please enter an integer value. @@@")
        return None


def run_deposit(clients):
    cpf = input("Enter client's CPF (numbers only): ").strip()
    client = filter_client(cpf, clients)

    if not client:
        print("\n@@@ Client not found! @@@")
        return

    account = select_client_account(client)
    if not account:
        return

    try:
        amount = float(input("Enter deposit amount: "))
        transaction = Deposit(amount)
        client.perform_transaction(account, transaction)
    except ValueError:
        print("\n@@@ Error! Please enter a valid numeric value. @@@")


def run_withdrawal(clients):
    cpf = input("Enter client's CPF (numbers only): ").strip()
    client = filter_client(cpf, clients)

    if not client:
        print("\n@@@ Client not found! @@@")
        return

    account = select_client_account(client)
    if not account:
        return

    try:
        amount = float(input("Enter withdrawal amount: "))
        transaction = Withdrawal(amount)
        client.perform_transaction(account, transaction)
    except ValueError:
        print("\n@@@ Error! Please enter a valid numeric value. @@@")


def run_statement(clients):
    cpf = input("Enter client's CPF (numbers only): ").strip()
    client = filter_client(cpf, clients)

    if not client:
        print("\n@@@ Client not found! @@@")
        return

    account = select_client_account(client)
    if not account:
        return

    print("\n================ STATEMENT ================")
    transactions = account.history.transactions

    if not transactions:
        print("No transactions have been recorded.")
    else:
        for t in transactions:
            print(f"[{t['date']}] {t['type']}:\tR$ {t['amount']:.2f}")

    print(f"\nBalance:\t\tR$ {account.balance:.2f}")
    print("===========================================")


def create_user(clients):
    cpf = input("Enter CPF (numbers only): ").strip()
    existing_client = filter_client(cpf, clients)

    if existing_client:
        print("\n@@@ Error! A user with this CPF is already registered. @@@")
        return

    name = input("Enter full name: ").strip()
    birth_date = input("Enter date of birth (dd-mm-yyyy): ").strip()
    address = input("Enter address (street, number - neighborhood - city/state state_abbreviation): ").strip()

    new_client = PhysicalPerson(name=name, birth_date=birth_date, cpf=cpf, address=address)
    clients.append(new_client)

    print("\n=== User created successfully! ===")


def create_account(account_number, clients, accounts):
    cpf = input("Enter client's CPF: ").strip()
    client = filter_client(cpf, clients)

    if not client:
        print("\n@@@ User not found. Account creation execution halted! @@@")
        return

    new_checking_acc = CheckingAccount.new_account(client=client, number=account_number)
    accounts.append(new_checking_acc)
    client.add_account(new_checking_acc)

    print("\n=== Account created successfully! ===")


def list_accounts(accounts):
    if not accounts:
        print("\n@@@ No accounts have been registered yet. @@@")
        return

    for account in accounts:
        print("=" * 50)
        print(textwrap.dedent(str(account)))
    print("=" * 50)


def calculate_investment_simulation():
    print("\n--- Compound Interest Simulator ---")
    try:
        initial_capital = float(input("Enter initial investment capital (R$): "))
        annual_rate = float(input("Enter annual interest rate (e.g., 0.05 for 5%): "))
        period_years = int(input("Enter investment duration (in years): "))
        
        final_value = InterestRate.calculate_compound_interest(initial_capital, annual_rate, period_years)
        print(f"\n=== Final investment valuation: R$ {final_value:.2f} ===")
    except ValueError:
        print("\n@@@ Error! Please fill fields with valid numeric values. @@@")


# =====================================================================
# MAIN LOOP CONTROL
# =====================================================================

def main():
    clients = []
    accounts = []

    while True:
        option = menu()

        if option == "d":
            run_deposit(clients)

        elif option == "s":
            run_withdrawal(clients)

        elif option == "e":
            run_statement(clients)

        elif option == "nu":
            create_user(clients)

        elif option == "nc":
            account_number = len(accounts) + 1
            create_account(account_number, clients, accounts)

        elif option == "lc":
            list_accounts(accounts)

        elif option == "ci":
            calculate_investment_simulation()

        elif option == "q":
            print("\nThank you for choosing our banking services. Goodbye!")
            break

        else:
            print("\n@@@ Invalid action! Please input a valid option from the menu. @@@")


if __name__ == "__main__":
    main()
