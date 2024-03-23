import os
import shutil
import toml


def find_pyproject_toml_files(directory):
    toml_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file == "pyproject.toml":
                toml_files.append(os.path.join(root, file))
    return toml_files


def merge():
    base_file = "pyproject.toml"
    plugin_directory = "plugins"

    backup_file = base_file + ".bak"
    shutil.copyfile(base_file, backup_file)
    print(f"backup file created: {backup_file}")

    with open(base_file, "r") as f:
        base_data = toml.load(f)

    additional_files = find_pyproject_toml_files(plugin_directory)

    for additional_file in additional_files:
        with open(additional_file, "r") as f:
            additional_data = toml.load(f)

        for key, value in (
            additional_data.get("tool", {})
            .get("poetry", {})
            .get("dependencies", {})
            .items()
        ):
            base_data["tool"]["poetry"]["dependencies"][key] = value

    with open(base_file, "w") as f:
        toml.dump(base_data, f)

    print(f"dependencies merged into {base_file}")


def reset():
    config_file_path = os.path.join(os.path.join(os.getcwd(), "base", "pyproject.toml"))
    current_file_path = os.path.join(os.getcwd(), "pyproject.toml")

    shutil.copyfile(config_file_path, current_file_path)
    print(f"pyproject.toml restored")
