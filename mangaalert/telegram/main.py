import time
import os
import schedule
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

from mangaalert.manga.main import search_manga, open_cache_file, create_cache_file, open_target_file, create_target_file, add_new_target


async def add_target(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """ Add a new target to the target list. """
    print("Adding new target...")

    if not context.args:
        await update.message.reply_text("Please provide a target to add.")
        return

    target = context.args[0]
    result = add_new_target(target)

    if result == 0:
        await update.message.reply_text(f"Target {target} added!")
    elif result == 1:
        await update.message.reply_text(f"Target {target} already exists.")
    else:
        await update.message.reply_text("An error occurred while adding the target.")

# Check environment variables for BOT_TOKEN and MANGA_URL
if 'BOT_TOKEN' not in os.environ:
    raise EnvironmentError("BOT_TOKEN environment variable not set")

if 'MANGA_URL' not in os.environ:
    raise EnvironmentError("MANGA_URL environment variable not set")

app = ApplicationBuilder().token(
    f"{os.environ['BOT_TOKEN']}").build()

app.add_handler(CommandHandler("nuevo", add_target))
app.add_handler(CommandHandler("buscar", search_manga))

try:
    open_cache_file()
except FileNotFoundError:
    create_cache_file()

try:
    open_target_file()
except FileNotFoundError:
    create_target_file()

schedule.every().hour.do(search_manga)

app.run_polling()

while True:
    schedule.run_pending()
    time.sleep(1)
