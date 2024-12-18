"""
This script checks for new manga releases every hour.
"""

import os
import json
import requests
from bs4 import BeautifulSoup

cached_volumes = []
targets = []


def create_cache_file():
    """ Create a cache file to store the last checked manga release. """
    print("Creating cache file...")
    with open("cache.json", "w", encoding="utf-8") as cache_file:
        json.dump([], cache_file)


def open_cache_file():
    """ Open the cache file to read the last checked manga release. """
    with open("cache.json", "r", encoding="utf-8") as cache_file:
        global cached_volumes
        cached_volumes = json.load(cache_file)


def update_cache_file(new_volume):
    """ Update the cache file with the latest manga release. """
    cached_volumes.append(new_volume)

    # Only save the last 50 manga releases, remove the oldest one
    if len(cached_volumes) > 50:
        cached_volumes.pop(0)

    with open("cache.json", "w", encoding="utf-8") as cache_file:
        json.dump(cached_volumes, cache_file, ensure_ascii=False)


def create_target_file():
    """ Create a target file to store the targets of the user. """
    with open("targets.json", "w", encoding="utf-8") as target_file:
        json.dump([], target_file)


def open_target_file():
    """ Open the target file to read the targets of the user. """
    with open("targets.json", "r", encoding="utf-8") as target_file:
        global targets
        targets = json.load(target_file)


def add_new_target(target):
    """ Add a new target to the target list. """
    # Check if the target is already in the list
    for t in targets:
        if target in t:
            print(f"Target {target} already exists.")
            return 1

    print(f"Adding new target: {target}")
    targets.append(target)

    with open("targets.json", "w", encoding="utf-8") as target_file:
        json.dump(targets, target_file, ensure_ascii=False)


def search_manga():
    """ Search for new manga releases. """
    manga_url = f"{os.environ['MANGA_URL']}"

    response = requests.get(
        manga_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        manga_list = soup.find_all("h2", class_="entry-title")

        for manga in manga_list:
            manga_name = manga.text

            # Check if it's on the target list
            for target in targets:
                if target in manga_name and manga_name not in cached_volumes:
                    print(f"New release: {manga_name}")
                    update_cache_file(manga_name)
                    break
