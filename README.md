# Optimizing the Banking System with Python Functions

Project developed as part of the "Potência Tech" Bootcamp, powered by iFood | Data Science, under the guidance of expert [Guilherme Carvalho](https://github.com/guicarvalho "Guilherme Carvalho").

In this challenge, you will have the opportunity to optimize the previously developed banking system by using Python functions. The goal is to improve the system's structure and efficiency by implementing deposit, withdrawal, and account statement operations as specific functions. You will be able to refactor the existing code, breaking it down into reusable functions, which will make the system easier to maintain and understand as a whole. Get ready to apply advanced programming concepts and demonstrate your ability to create more elegant and efficient solutions using Python.

A robust and secure command-line banking prototype developed in Python. This version implements Object-Oriented Programming (OOP) concepts, supports multiple users and accounts per client, includes a secure selection mechanism for multi-account clients, enforces transaction limit rules, and features an integrated interest rate calculation class.

## Features

- **Multi-Client & Multi-Account Support:** Register multiple clients (using distinct CPFs) and create one or multiple accounts linked to a single client.
- **Dynamic Account Selection:** Automated account lookup that lists and lets the client choose which specific account to interact with if they possess more than one.
- **Transaction Security & Real-Time History:** Tracks transactions with localized timestamps using the `datetime` module. Restricts operations to a maximum of 3 successful withdrawals per day per account.
- **Interest Rate Management:** A dedicated `InterestRate` class that leverages compound interest formulas to simulate investment returns over specified yearly periods.
- **OOP Architecture:** Code built upon abstraction, encapsulation, and inheritance principles (`Client`, `Account`, `Transaction`, `History`).

## Tech Stack

- **Language:** Python 3.10+
- **Core Modules:** `datetime`, `textwrap`

## How to Run

1. Clone or copy the files into a clean workspace.
2. Ensure you have Python installed on your system:

   ```bash
   python --version
   ```

3. Execute the core program using your terminal:

   ```bash
   python main.py
   ```

## Future Improvements

- Add data persistence using SQLite or JSON file mapping.
- Develop a responsive web or mobile graphical user interface.
- Implement strict field validations for Brazilian CPFs and Birth Dates formatting.

[LICENSE](/LICENSE)
