# Manga Alert

Manga Alert is a script designed to notify users about the latest updates to their favorite manga series. This script checks for updates from a manga source and sends notifications to users via Telegram.

## Features
- Send notifications when new chapters are released

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/mangaalert.git
    ```

2. Install [Poetry](https://python-poetry.org/):
    ```sh
    pip install poetry
    ```

3. Navigate to the project directory:
```sh
cd mangaalert
```

4. Install the required dependencies:
    ```sh
    poetry install
    ```

## Usage
1. Create a `.env` file in the project directory:
    ```sh
    touch .env
    ```

2. Add the following environment variables to the `.env` file:
    ```sh
    BOT_TOKEN=your_telegram_bot_token
    MANGA_URL=your_manga_source_url
    ```

3. Run the script:
    ```sh
    poetry run bot
    ```

## License

This project is licensed under the MIT License.
