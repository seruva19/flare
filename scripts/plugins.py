import os
import shutil
import subprocess
import tempfile
import toml

plugins_repo = "https://github.com/seruva19/flare-plugins"
destination_dir = "plugins"


def download():
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    subprocess.run(["git", "clone", plugins_repo, destination_dir, "-q"])


def update():
    os.chdir(destination_dir)
    subprocess.run(["git", "pull", "-q"])
